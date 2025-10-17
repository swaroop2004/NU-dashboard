import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';
import { GoogleGenAI, createUserContent, createPartFromUri } from '@google/genai';

// Initialize Gemini API client
const ai = new GoogleGenAI({ 
  apiKey: process.env.GOOGLE_API_KEY || '' 
});

/**
 * API endpoint to transcribe audio files using Gemini API
 * POST /api/audio/transcribe
 * 
 * Accepts form data with:
 * - audio: Audio file (File object)
 * - filename: Optional filename for the audio file
 */
export async function POST(request: NextRequest) {
  let uploadedFilePath: string | null = null;
  let geminiFileUri: string | null = null;

  try {
    // Parse form data
    const formData = await request.formData();
    const audioFile = formData.get('audio') as File;
    const filename = formData.get('filename') as string;

    if (!audioFile) {
      return NextResponse.json(
        { error: 'No audio file provided' },
        { status: 400 }
      );
    }

    // Validate file type - be more flexible with MIME type detection
    const allowedTypes = ['audio/webm', 'audio/mp3', 'audio/wav', 'audio/mpeg', 'audio/ogg'];
    const allowedExtensions = ['.webm', '.mp3', '.wav', '.mpeg', '.ogg', '.m4a'];
    
    // Check MIME type or filename extension
    const isValidType = allowedTypes.includes(audioFile.type) || 
                       allowedExtensions.some(ext => audioFile.name.toLowerCase().endsWith(ext));
    
    if (!isValidType) {
      return NextResponse.json(
        { error: 'Invalid audio file type. Supported formats: webm, mp3, wav, ogg, m4a, mpeg' },
        { status: 400 }
      );
    }

    // Create temporary directory for processing
    const tempDir = path.join(process.cwd(), 'temp');
    if (!fs.existsSync(tempDir)) {
      fs.mkdirSync(tempDir, { recursive: true });
    }

    // Generate unique filename
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
    const finalFilename = filename || `transcribe-${timestamp}-${audioFile.name}`;
    uploadedFilePath = path.join(tempDir, finalFilename);

    // Save uploaded file to temp directory
    const buffer = Buffer.from(await audioFile.arrayBuffer());
    fs.writeFileSync(uploadedFilePath, buffer);
    console.log(`Audio file saved to temp: ${uploadedFilePath}`);

    // Upload file to Gemini API
    console.log(`Uploading to Gemini API: ${finalFilename}`);
    
    // Determine MIME type for Gemini API - fallback to generic audio type
    let mimeType = audioFile.type;
    if (!mimeType || mimeType === 'application/octet-stream') {
      const ext = path.extname(finalFilename).toLowerCase();
      const mimeTypeMap: { [key: string]: string } = {
        '.webm': 'audio/webm',
        '.mp3': 'audio/mp3',
        '.wav': 'audio/wav',
        '.ogg': 'audio/ogg',
        '.m4a': 'audio/mp4',
        '.mpeg': 'audio/mpeg'
      };
      mimeType = mimeTypeMap[ext] || 'audio/webm';
    }
    
    try {
      const geminiFile = await ai.files.upload({
        file: uploadedFilePath,
        config: { 
          mimeType: mimeType,
          displayName: finalFilename
        },
      });
      geminiFileUri = geminiFile.uri ?? null;
      console.log(`File uploaded to Gemini: ${geminiFileUri}`);
    } catch (uploadError: any) {
      if (uploadError.message?.includes('API key not valid')) {
        throw new Error('Invalid Google API key. Please check your GOOGLE_API_KEY environment variable. Make sure you have a valid Gemini API key from https://makersuite.google.com/app/apikey');
      }
      throw uploadError;
    }
    geminiFileUri = geminiFileUri ?? null;
    console.log(`File uploaded to Gemini: ${geminiFileUri}`);

    // Generate transcription using Gemini
    console.log('Generating transcription...');
    const result = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: createUserContent([
        createPartFromUri(geminiFileUri!, mimeType || 'audio/webm'),
        'Generate a transcript of the speech. Please provide a clean, accurate transcription of the audio content.',
      ]),
    });

    const transcription = result.text;
    console.log('Transcription completed successfully');

    // Cleanup: Delete the temporary file immediately after processing
    try {
      if (uploadedFilePath && fs.existsSync(uploadedFilePath)) {
        fs.unlinkSync(uploadedFilePath);
        console.log(`Temporary file cleaned up: ${uploadedFilePath}`);
      }
    } catch (cleanupError) {
      console.warn('Warning: Failed to cleanup temporary file:', cleanupError);
    }

    // Return successful transcription
    return NextResponse.json({
      success: true,
      transcription: transcription,
      filename: finalFilename,
      fileSize: audioFile.size,
      duration: null,
      mimeType: audioFile.type,
      processedAt: new Date().toISOString()
    });

  } catch (error) {
    console.error('Error in transcription process:', error);
    
    // Cleanup on error
    try {
      if (uploadedFilePath && fs.existsSync(uploadedFilePath)) {
        fs.unlinkSync(uploadedFilePath);
        console.log(`Temporary file cleaned up after error: ${uploadedFilePath}`);
      }
    } catch (cleanupError) {
      console.warn('Warning: Failed to cleanup temporary file after error:', cleanupError);
    }

    // Handle specific error types
    let errorMessage = 'Failed to transcribe audio';
    let statusCode = 500;

    if (error instanceof Error) {
      if (error.message.includes('API key')) {
        errorMessage = 'Gemini API key not configured';
        statusCode = 401;
      } else if (error.message.includes('upload')) {
        errorMessage = 'Failed to upload audio file to Gemini API';
        statusCode = 502;
      } else if (error.message.includes('generateContent')) {
        errorMessage = 'Failed to generate transcription from Gemini API';
        statusCode = 502;
      } else {
        errorMessage = error.message;
      }
    }

    return NextResponse.json(
      { 
        error: errorMessage,
        details: error instanceof Error ? error.message : 'Unknown error',
        timestamp: new Date().toISOString()
      },
      { status: statusCode }
    );
  }
}

/**
 * API endpoint to get transcription status or supported formats
 * GET /api/audio/transcribe
 */
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const action = searchParams.get('action');

    if (action === 'formats') {
      return NextResponse.json({
        success: true,
        supportedFormats: [
          { mimeType: 'audio/webm', extension: '.webm', description: 'WebM audio' },
          { mimeType: 'audio/mp3', extension: '.mp3', description: 'MP3 audio' },
          { mimeType: 'audio/mpeg', extension: '.mpeg', description: 'MPEG audio' },
          { mimeType: 'audio/wav', extension: '.wav', description: 'WAV audio' },
          { mimeType: 'audio/ogg', extension: '.ogg', description: 'OGG audio' }
        ],
        maxFileSize: '100MB',
        maxDuration: '10 minutes'
      });
    }

    return NextResponse.json({
      success: true,
      message: 'Audio transcription service is available',
      endpoints: {
        POST: '/api/audio/transcribe - Transcribe audio file',
        GET: '/api/audio/transcribe?action=formats - Get supported formats'
      }
    });

  } catch (error) {
    console.error('Error in transcription status endpoint:', error);
    return NextResponse.json(
      { 
        error: 'Failed to get transcription status',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}
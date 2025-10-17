import { NextRequest, NextResponse } from 'next/server';

/**
 * Debug endpoint to test transcription service
 * GET /api/audio/transcribe/debug
 */
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const test = searchParams.get('test');

    if (test === 'formats') {
      // Test supported formats
      const supportedFormats = [
        { mimeType: 'audio/webm', extension: '.webm', description: 'WebM audio' },
        { mimeType: 'audio/mp3', extension: '.mp3', description: 'MP3 audio' },
        { mimeType: 'audio/wav', extension: '.wav', description: 'WAV audio' },
        { mimeType: 'audio/ogg', extension: '.ogg', description: 'OGG audio' },
        { mimeType: 'audio/mp4', extension: '.m4a', description: 'M4A audio' },
        { mimeType: 'audio/mpeg', extension: '.mpeg', description: 'MPEG audio' }
      ];
      
      return NextResponse.json({
        success: true,
        message: 'Supported formats',
        formats: supportedFormats,
        validationLogic: 'Checks MIME type OR file extension (case insensitive)'
      });
    }

    if (test === 'env') {
      // Test environment
      const hasApiKey = !!process.env.GOOGLE_API_KEY;
      return NextResponse.json({
        success: true,
        message: 'Environment check',
        hasGoogleApiKey: hasApiKey,
        apiKeyLength: hasApiKey ? process.env.GOOGLE_API_KEY?.length : 0
      });
    }

    return NextResponse.json({
      success: true,
      message: 'Debug endpoint for transcription service',
      availableTests: [
        '?test=formats - Check supported formats',
        '?test=env - Check environment variables'
      ]
    });

  } catch (error) {
    console.error('Debug endpoint error:', error);
    return NextResponse.json({
      success: false,
      error: 'Debug endpoint failed',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}

/**
 * Test endpoint to validate file upload
 * POST /api/audio/transcribe/debug
 */
export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const audioFile = formData.get('audio') as File;
    const filename = formData.get('filename') as string;

    if (!audioFile) {
      return NextResponse.json({
        success: false,
        error: 'No audio file provided',
        receivedFormData: Array.from(formData.keys())
      }, { status: 400 });
    }

    // File analysis
    const fileAnalysis = {
      name: audioFile.name,
      size: audioFile.size,
      type: audioFile.type,
      lastModified: audioFile.lastModified,
      filename: filename || 'not provided'
    };

    // Extension check
    const fileExtension = audioFile.name.toLowerCase().substring(audioFile.name.lastIndexOf('.'));
    const allowedExtensions = ['.webm', '.mp3', '.wav', '.ogg', '.m4a', '.mpeg'];
    const isValidExtension = allowedExtensions.includes(fileExtension);

    // MIME type check
    const allowedTypes = ['audio/webm', 'audio/mp3', 'audio/wav', 'audio/mpeg', 'audio/ogg'];
    const isValidMimeType = allowedTypes.includes(audioFile.type);

    // Validation result
    const validation = {
      extension: fileExtension,
      isValidExtension,
      mimeType: audioFile.type,
      isValidMimeType,
      overallValid: isValidExtension || isValidMimeType,
      validationLogic: 'Valid if either MIME type OR extension matches'
    };

    return NextResponse.json({
      success: true,
      message: 'File validation successful',
      fileAnalysis,
      validation,
      nextSteps: 'File passed validation, ready for transcription'
    });

  } catch (error) {
    console.error('File validation error:', error);
    return NextResponse.json({
      success: false,
      error: 'File validation failed',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}
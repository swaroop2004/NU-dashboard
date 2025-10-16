import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

/**
 * API endpoint to save audio blob to data folder
 * POST /api/audio/save
 */
export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const audioBlob = formData.get('audio') as Blob;
    const filename = formData.get('filename') as string;

    if (!audioBlob) {
      return NextResponse.json(
        { error: 'No audio data provided' },
        { status: 400 }
      );
    }

    // Convert blob to buffer
    const arrayBuffer = await audioBlob.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    // Create data directory if it doesn't exist
    const dataDir = path.join(process.cwd(), 'data');
    if (!fs.existsSync(dataDir)) {
      fs.mkdirSync(dataDir, { recursive: true });
    }

    // Use provided filename or generate one
    const finalFilename = filename || `audio-${Date.now()}.webm`;
    const filePath = path.join(dataDir, finalFilename);

    // Save the file
    fs.writeFileSync(filePath, buffer);

    console.log(`Audio file saved to: ${filePath}`);

    return NextResponse.json({
      success: true,
      filename: finalFilename,
      filePath: filePath,
      size: buffer.length,
      message: `Audio saved successfully as ${finalFilename}`
    });

  } catch (error) {
    console.error('Error saving audio file:', error);
    return NextResponse.json(
      { error: 'Failed to save audio file', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}

/**
 * API endpoint to list saved audio files
 * GET /api/audio/save
 */
export async function GET(request: NextRequest) {
  try {
    const dataDir = path.join(process.cwd(), 'data');
    
    if (!fs.existsSync(dataDir)) {
      return NextResponse.json({
        success: true,
        files: [],
        message: 'No data directory found'
      });
    }

    const files = fs.readdirSync(dataDir)
      .filter(file => file.endsWith('.webm') || file.endsWith('.mp3') || file.endsWith('.wav'))
      .map(file => {
        const filePath = path.join(dataDir, file);
        const stats = fs.statSync(filePath);
        return {
          filename: file,
          size: stats.size,
          created: stats.birthtime,
          modified: stats.mtime,
          path: filePath
        };
      })
      .sort((a, b) => b.created.getTime() - a.created.getTime()); // Most recent first

    return NextResponse.json({
      success: true,
      files: files,
      count: files.length,
      directory: dataDir
    });

  } catch (error) {
    console.error('Error listing audio files:', error);
    return NextResponse.json(
      { error: 'Failed to list audio files', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}

/**
 * API endpoint to delete an audio file
 * DELETE /api/audio/save
 */
export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const filename = searchParams.get('filename');

    if (!filename) {
      return NextResponse.json(
        { error: 'No filename provided' },
        { status: 400 }
      );
    }

    const dataDir = path.join(process.cwd(), 'data');
    const filePath = path.join(dataDir, filename);

    if (!fs.existsSync(filePath)) {
      return NextResponse.json(
        { error: 'File not found' },
        { status: 404 }
      );
    }

    fs.unlinkSync(filePath);

    console.log(`Audio file deleted: ${filePath}`);

    return NextResponse.json({
      success: true,
      filename: filename,
      message: `File ${filename} deleted successfully`
    });

  } catch (error) {
    console.error('Error deleting audio file:', error);
    return NextResponse.json(
      { error: 'Failed to delete audio file', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}
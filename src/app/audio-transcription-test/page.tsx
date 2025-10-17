"use client";

import { useState, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { Mic, MicOff, Upload, Play, Download } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

export default function AudioTranscriptionTest() {
  const [isRecording, setIsRecording] = useState(false);
  const [isTranscribing, setIsTranscribing] = useState(false);
  const [transcription, setTranscription] = useState('');
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioBlobRef = useRef<Blob | null>(null);
  const { toast } = useToast();

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ 
        audio: {
          channelCount: 1,
          sampleRate: 16000,
          sampleSize: 16,
          echoCancellation: true,
          noiseSuppression: true,
          autoGainControl: true
        } 
      });
      
      const mediaRecorder = new MediaRecorder(stream, {
        mimeType: 'audio/webm;codecs=opus',
        audioBitsPerSecond: 128000
      });
      
      mediaRecorderRef.current = mediaRecorder;
      const audioChunks: BlobPart[] = [];

      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          audioChunks.push(event.data);
        }
      };

      mediaRecorder.onstop = () => {
        const audioBlob = new Blob(audioChunks, { 
          type: 'audio/webm;codecs=opus' 
        });
        audioBlobRef.current = audioBlob;
        stream.getTracks().forEach(track => track.stop());
        
        toast({
          title: "Recording completed",
          description: "Audio recording finished. Ready to transcribe.",
        });
      };

      mediaRecorder.start(1000);
      setIsRecording(true);

      // Stop recording after 15 seconds
      setTimeout(() => {
        if (mediaRecorder.state === 'recording') {
          mediaRecorder.stop();
          setIsRecording(false);
        }
      }, 15000);

    } catch (error) {
      console.error('Error starting recording:', error);
      toast({
        title: "Recording failed",
        description: "Could not access microphone. Please check permissions.",
        variant: "destructive",
      });
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
    }
  };

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      // Validate file type
      const allowedExtensions = ['.webm', '.mp3', '.wav', '.ogg', '.m4a', '.mpeg'];
      const fileExtension = file.name.toLowerCase().substring(file.name.lastIndexOf('.'));
      
      if (!allowedExtensions.includes(fileExtension)) {
        toast({
          title: "Invalid file type",
          description: `Supported formats: ${allowedExtensions.join(', ')}`,
          variant: "destructive",
        });
        return;
      }
      
      // Check file size (100MB limit)
      const maxSize = 100 * 1024 * 1024; // 100MB in bytes
      if (file.size > maxSize) {
        toast({
          title: "File too large",
          description: "Maximum file size is 100MB",
          variant: "destructive",
        });
        return;
      }
      
      setSelectedFile(file);
      audioBlobRef.current = null; // Clear recorded audio when file is selected
      toast({
        title: "File selected",
        description: `Selected: ${file.name} (${(file.size / 1024 / 1024).toFixed(1)} MB)`,
      });
    }
  };

  const transcribeAudio = async () => {
    if (!audioBlobRef.current && !selectedFile) {
      toast({
        title: "No audio",
        description: "Please record audio or select a file first.",
        variant: "destructive",
      });
      return;
    }

    setIsTranscribing(true);
    setTranscription('');

    try {
      const formData = new FormData();
      
      if (selectedFile) {
        // Use selected file
        formData.append('audio', selectedFile);
        formData.append('filename', selectedFile.name);
      } else if (audioBlobRef.current) {
        // Use recorded audio
        const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
        const filename = `test-recording-${timestamp}.webm`;
        const audioFile = new File([audioBlobRef.current], filename, { 
          type: 'audio/webm;codecs=opus',
          lastModified: Date.now()
        });
        formData.append('audio', audioFile);
        formData.append('filename', filename);
      }

      const response = await fetch('/api/audio/transcribe', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ error: 'Unknown error' }));
        throw new Error(errorData.error || 'Transcription failed');
      }

      const result = await response.json();

      if (result.success) {
        setTranscription(result.transcription);
        toast({
          title: "Transcription complete",
          description: `Processed ${result.fileSize} bytes in ${result.processedAt}`,
        });
      } else {
        throw new Error(result.error || 'Transcription failed');
      }

    } catch (error) {
      console.error('Transcription error:', error);
      toast({
        title: "Transcription failed",
        description: error instanceof Error ? error.message : 'Failed to transcribe audio',
        variant: "destructive",
      });
    } finally {
      setIsTranscribing(false);
    }
  };

  const clearTranscription = () => {
    setTranscription('');
    setSelectedFile(null);
    audioBlobRef.current = null;
    toast({
      title: "Cleared",
      description: "Transcription and audio cleared.",
    });
  };

  return (
    <div className="container mx-auto p-6 max-w-4xl">
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl">Audio Transcription Test</CardTitle>
          <p className="text-sm text-gray-600">
            Test the Gemini API audio transcription service
          </p>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Recording Section */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Record Audio</h3>
            <div className="flex gap-3">
              <Button 
                onClick={isRecording ? stopRecording : startRecording}
                variant={isRecording ? "destructive" : "outline"}
                disabled={isTranscribing}
              >
                {isRecording ? <MicOff className="h-4 w-4" /> : <Mic className="h-4 w-4" />}
                {isRecording ? "Stop Recording" : "Start Recording"}
              </Button>
              
              {isRecording && (
                <div className="flex items-center gap-2 text-red-600">
                  <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse"></div>
                  Recording... 15s max
                </div>
              )}
            </div>
          </div>

          {/* File Upload Section */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Or Upload Audio File</h3>
            <div className="flex gap-3">
              <input
                type="file"
                accept="audio/*"
                onChange={handleFileSelect}
                className="hidden"
                id="audio-upload"
                disabled={isTranscribing}
              />
              <label htmlFor="audio-upload">
                <Button variant="outline" asChild disabled={isTranscribing}>
                  <span>
                    <Upload className="h-4 w-4 mr-2" />
                    Choose File
                  </span>
                </Button>
              </label>
              
              {selectedFile && (
                <div className="flex items-center gap-2 text-green-600">
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  {selectedFile.name}
                </div>
              )}
            </div>
          </div>

          {/* Transcription Controls */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Transcription</h3>
            <div className="flex gap-3">
              <Button 
                onClick={transcribeAudio}
                disabled={isTranscribing || (!audioBlobRef.current && !selectedFile)}
              >
                {isTranscribing ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                    Transcribing...
                  </>
                ) : (
                  <>
                    <Play className="h-4 w-4 mr-2" />
                    Transcribe Audio
                  </>
                )}
              </Button>
              
              <Button 
                onClick={clearTranscription}
                variant="outline"
                disabled={isTranscribing}
              >
                Clear
              </Button>
            </div>

            {isTranscribing && (
              <div className="text-blue-600 text-sm">
                Processing audio with Gemini API...
              </div>
            )}
          </div>

          {/* Transcription Result */}
          {transcription && (
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Transcription Result</h3>
              <Textarea
                value={transcription}
                readOnly
                className="min-h-[150px] bg-gray-50"
                placeholder="Transcription will appear here..."
              />
            </div>
          )}

          {/* API Key Setup */}
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-6">
            <h4 className="font-semibold text-yellow-800 mb-2">⚠️ API Key Required</h4>
            <p className="text-sm text-yellow-700 mb-2">
              You need to set up a valid Google Gemini API key in your <code className="bg-yellow-100 px-1 rounded">.env.local</code> file.
            </p>
            <ol className="list-decimal list-inside space-y-1 text-sm text-yellow-700">
              <li>Get your API key from <a href="https://makersuite.google.com/app/apikey" target="_blank" rel="noopener noreferrer" className="underline">Google AI Studio</a></li>
              <li>Update the <code className="bg-yellow-100 px-1 rounded">GOOGLE_API_KEY</code> in your <code className="bg-yellow-100 px-1 rounded">.env.local</code> file</li>
              <li>Restart your development server</li>
            </ol>
          </div>

          {/* Usage Instructions */}
          <div className="bg-blue-50 p-4 rounded-lg">
            <h4 className="font-semibold text-blue-900 mb-2">How to test:</h4>
            <ul className="text-sm text-blue-800 space-y-1">
              <li>• Click "Start Recording" and speak for a few seconds</li>
              <li>• Click "Stop Recording" when done</li>
              <li>• Or upload an existing audio file (MP3, WAV, WebM, OGG, M4A, MPEG)</li>
              <li>• Click "Transcribe Audio" to process with Gemini API</li>
              <li>• View the transcription result below</li>
              <li>• Maximum file size: 100MB</li>
            </ul>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
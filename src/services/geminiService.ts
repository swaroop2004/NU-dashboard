import { ApiResponse } from '@/types';

export class GeminiService {
  private apiKey: string;
  private baseUrl: string;
  private maxRetries: number;
  private timeout: number;

  constructor() {
    this.apiKey = process.env.NEXT_PUBLIC_GEMINI_API_KEY || '';
    this.baseUrl = 'https://generativelanguage.googleapis.com/v1beta';
    this.maxRetries = 3;
    this.timeout = 30000; // 30 seconds
  }

  /**
   * Convert audio blob to text using our transcription service with Gemini API
   */
  async transcribeAudio(audioBlob: Blob): Promise<ApiResponse<string>> {
    try {
      // Create form data for the transcription endpoint
      const formData = new FormData();
      
      // Create a filename for the audio file
      const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
      const filename = `audio-recording-${timestamp}.webm`;
      
      // Create a File object from the blob
      const audioFile = new File([audioBlob], filename, { 
        type: audioBlob.type || 'audio/webm',
        lastModified: Date.now()
      });
      
      formData.append('audio', audioFile);
      formData.append('filename', filename);

      // Call our transcription endpoint
      const response = await fetch('/api/audio/transcribe', {
        method: 'POST',
        body: formData,
        // No headers needed - FormData sets appropriate headers automatically
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ error: 'Unknown error' }));
        throw new Error(`Transcription failed: ${errorData.error || 'Unknown error'}`);
      }

      const result = await response.json();

      if (!result.success) {
        return {
          success: false,
          data: '',
          error: result.error || 'Transcription failed'
        };
      }

      return {
        success: true,
        data: result.transcription,
        message: result.message || 'Audio transcribed successfully'
      };
    } catch (error) {
      console.error('Audio transcription error:', error);
      return {
        success: false,
        data: '',
        error: this.handleError(error)
      };
    }
  }

  /**
   * Process text input and generate analytics insights using Gemini
   */
  async generateAnalyticsInsights(text: string, analyticsData: any): Promise<ApiResponse<string>> {
    if (!this.apiKey) {
      return {
        success: false,
        data: '',
        error: 'Gemini API key not configured. Please contact support.'
      };
    }

    try {
      const systemPrompt = `You are an AI analytics assistant for a real estate CRM system. Analyze the provided analytics data and answer the user's question about their real estate business performance. Be concise, professional, and provide actionable insights.

Available analytics data:
${JSON.stringify(analyticsData, null, 2)}

Provide clear, data-driven insights based on the question. Format your response with emojis and clear sections.`;

      const requestBody = {
        contents: [
          {
            parts: [{ text: systemPrompt + "\n\nUser question: " + text }]
          }
        ],
        generationConfig: {
          temperature: 0.3,
          maxOutputTokens: 1500,
          topP: 0.8,
          topK: 40
        }
      };

      const response = await this.makeApiCall(
        '/models/gemini-2.5-flash:generateContent',
        requestBody
      );

      if (!response.success) {
        return response;
      }

      const insightText = this.extractTextFromResponse(response.data);

      return {
        success: true,
        data: insightText,
        message: 'Analytics insights generated successfully'
      };
    } catch (error) {
      console.error('Analytics insights generation error:', error);
      return {
        success: false,
        data: '',
        error: this.handleError(error)
      };
    }
  }

  /**
   * Make API call with retry logic and timeout
   */
  private async makeApiCall(endpoint: string, body: any): Promise<ApiResponse<any>> {
    const url = `${this.baseUrl}${endpoint}?key=${this.apiKey}`;

    for (let attempt = 1; attempt <= this.maxRetries; attempt++) {
      try {
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), this.timeout);

        const response = await fetch(url, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(body),
          signal: controller.signal
        });

        clearTimeout(timeoutId);

        if (!response.ok) {
          const errorData = await response.json().catch(() => ({ error: 'Unknown error' }));
          throw new Error(`API Error: ${response.status} - ${errorData.error?.message || errorData.error || 'Unknown error'}`);
        }

        const data = await response.json();

        return {
          success: true,
          data: data,
          message: 'API call successful'
        };
      } catch (error) {
        console.error(`API call attempt ${attempt} failed:`, error);

        if (attempt === this.maxRetries) {
          throw error;
        }

        // Exponential backoff
        await new Promise(resolve => setTimeout(resolve, Math.pow(2, attempt) * 1000));
      }
    }

    return {
      success: false,
      data: null,
      error: 'Max retries exceeded'
    };
  }

  private extractTextFromResponse(response: any): string {
    try {
      if (response.candidates?.length > 0) {
        const candidate = response.candidates[0];
        if (candidate.content?.parts?.length > 0) {
          return candidate.content.parts[0].text || '';
        }
      }
      return '';
    } catch (error) {
      console.error('Error extracting text from response:', error);
      return '';
    }
  }

  private handleError(error: any): string {
    if (error instanceof Error) {
      if (error.message.includes('API Error: 429')) {
        return 'API rate limit exceeded. Please try again in a few moments.';
      } else if (error.message.includes('API Error: 401')) {
        return 'Authentication failed. Please check your API configuration.';
      } else if (error.message.includes('API Error: 500')) {
        return 'Server error. Please try again later.';
      } else if (error.message.includes('timeout')) {
        return 'Request timed out. Please try again.';
      } else if (error.message.includes('abort')) {
        return 'Request was cancelled. Please try again.';
      }
      return error.message;
    }
    return 'An unexpected error occurred. Please try again.';
  }

  isAvailable(): boolean {
    return !!this.apiKey && this.apiKey.length > 0;
  }

  getUsageStats(): { requests: number; remaining: number; resetTime: string } {
    return {
      requests: Math.floor(Math.random() * 1000),
      remaining: Math.floor(Math.random() * 1000) + 1000,
      resetTime: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString()
    };
  }
}

export const geminiService = new GeminiService();
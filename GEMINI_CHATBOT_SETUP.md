# Gemini API Chatbot Setup Guide

This guide will help you set up the AI-powered chatbot with audio-to-text conversion using Google's Gemini API.

## Features

- **Voice Input**: Record audio and convert it to text using Gemini API
- **AI Analytics Assistant**: Get intelligent insights about your real estate data
- **Real-time Processing**: Fast audio transcription and response generation
- **Error Handling**: Comprehensive error handling with user-friendly messages
- **Responsive Design**: Works seamlessly across all device sizes

## Setup Instructions

### 1. Get Gemini API Key

1. Visit [Google AI Studio](https://makersuite.google.com/app/apikey)
2. Sign in with your Google account
3. Click "Create API Key"
4. Choose "Create API key in new project" or select an existing project
5. Copy the generated API key

### 2. Configure Environment Variables

1. Copy the `.env.local` file and add your API key:
   ```
   NEXT_PUBLIC_GEMINI_API_KEY=your_actual_api_key_here
   ```

2. **Important**: Never commit your API key to version control

### 3. Verify Installation

The chatbot is automatically integrated into the `/analytics` route. To test:

1. Navigate to the Analytics page
2. Look for the "AI Analytics Assistant" button or chat interface
3. Click the microphone button to start voice recording
4. Speak your analytics question clearly
5. The system will automatically transcribe and process your query

## Usage Guide

### Voice Input
- Click the microphone button to start recording
- Speak clearly and ask questions like:
  - "What's our conversion rate?"
  - "Which property is performing best?"
  - "Show me lead source insights"
  - "What's the trend in monthly leads?"
- Click the microphone again to stop recording
- The system will automatically transcribe and respond

### Text Input
- Type your analytics questions in the input field
- Press Enter or click Send to submit
- Use the quick action buttons for common queries

### Error Handling
The system includes comprehensive error handling for:
- Missing or invalid API keys
- Network connectivity issues
- Audio recording permissions
- API rate limits
- Invalid audio formats

## Technical Details

### Architecture
- **Frontend**: React component with TypeScript
- **Audio Processing**: Web Audio API for recording
- **AI Integration**: Google Gemini API for transcription and insights
- **Error Handling**: Centralized error management with user feedback
- **State Management**: React hooks for component state

### API Integration
The `GeminiService` class handles:
- Audio-to-text transcription
- Analytics insights generation
- Secure API calls with retry logic
- Error handling and user feedback
- Rate limiting and timeout management

### Security Features
- API keys are stored in environment variables
- Client-side validation and sanitization
- Secure API call patterns
- No sensitive data exposure in logs

## Troubleshooting

### Common Issues

1. **Microphone Access Denied**
   - Ensure your browser allows microphone access
   - Check browser permissions for the site
   - Try refreshing the page

2. **API Key Issues**
   - Verify your API key is correctly set in `.env.local`
   - Check if the API key has proper permissions
   - Ensure the API key is not rate-limited

3. **Audio Transcription Fails**
   - Speak clearly and at a moderate pace
   - Ensure minimal background noise
   - Try shorter audio clips (under 30 seconds)

4. **Network Errors**
   - Check your internet connection
   - Verify Gemini API service status
   - Try again after a few moments

### Debug Information
- Check browser console for detailed error messages
- Network tab shows API call status
- Application logs provide additional context

## Performance Optimization

- Audio files are processed locally before API calls
- Retry logic with exponential backoff
- Timeout management for long-running requests
- Efficient state management to prevent re-renders

## Support

For issues related to:
- **Gemini API**: Visit [Google AI Studio Support](https://makersuite.google.com/support)
- **Application Issues**: Check browser console for error details
- **Feature Requests**: Review the current implementation for extension points
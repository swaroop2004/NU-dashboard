/**
 * Audio storage utility for saving recorded audio blobs
 */

/**
 * Save audio blob to server data folder via API
 */
export async function saveAudioBlob(audioBlob: Blob, filename?: string): Promise<string> {
  try {
    // Generate filename with timestamp if not provided
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
    const fileName = filename || `audio-recording-${timestamp}.webm`;
    
    // Create FormData to send to API
    const formData = new FormData();
    formData.append('audio', audioBlob);
    formData.append('filename', fileName);

    // Send to server API
    const response = await fetch('/api/audio/save', {
      method: 'POST',
      body: formData,
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || 'Failed to save audio file');
    }

    const result = await response.json();
    console.log(`Audio file saved to server: ${result.filename}`);
    return result.filename;
  } catch (error) {
    console.error('Error saving audio blob to server:', error);
    // Fallback to browser download if server save fails
    console.log('Falling back to browser download...');
    return saveAudioBlobToBrowser(audioBlob, filename);
  }
}

/**
 * Save audio blob as browser download (fallback method)
 */
export async function saveAudioBlobToBrowser(audioBlob: Blob, filename?: string): Promise<string> {
  try {
    // Generate filename with timestamp if not provided
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
    const fileName = filename || `audio-recording-${timestamp}.webm`;
    
    // Create a download link and trigger download
    const url = URL.createObjectURL(audioBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = fileName;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    // Clean up the object URL
    setTimeout(() => {
      URL.revokeObjectURL(url);
    }, 100);
    
    console.log(`Audio file downloaded: ${fileName}`);
    return fileName;
  } catch (error) {
    console.error('Error saving audio blob to browser:', error);
    throw new Error('Failed to save audio file');
  }
}

/**
 * Save audio blob to browser's local storage as base64 (fallback method)
 */
export async function saveAudioToLocalStorage(audioBlob: Blob, key?: string): Promise<string> {
  try {
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
    const storageKey = key || `audio-${timestamp}`;
    
    // Convert blob to base64
    const base64 = await blobToBase64(audioBlob);
    
    // Store in localStorage
    localStorage.setItem(storageKey, base64);
    
    console.log(`Audio saved to localStorage with key: ${storageKey}`);
    return storageKey;
  } catch (error) {
    console.error('Error saving audio to localStorage:', error);
    throw new Error('Failed to save audio to local storage');
  }
}

/**
 * Convert blob to base64
 */
function blobToBase64(blob: Blob): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onloadend = () => {
      const base64String = reader.result as string;
      resolve(base64String);
    };
    reader.onerror = reject;
    reader.readAsDataURL(blob);
  });
}

/**
 * Get all saved audio keys from localStorage
 */
export function getSavedAudioKeys(): string[] {
  const keys: string[] = [];
  for (let i = 0; i < localStorage.length; i++) {
    const key = localStorage.key(i);
    if (key && key.startsWith('audio-')) {
      keys.push(key);
    }
  }
  return keys.sort().reverse(); // Most recent first
}

/**
 * Load audio from localStorage
 */
export function loadAudioFromLocalStorage(key: string): string | null {
  return localStorage.getItem(key);
}

/**
 * Delete audio from localStorage
 */
export function deleteAudioFromLocalStorage(key: string): void {
  localStorage.removeItem(key);
}

/**
 * Clear all saved audio from localStorage
 */
export function clearAllSavedAudio(): void {
  const keys = getSavedAudioKeys();
  keys.forEach(key => {
    localStorage.removeItem(key);
  });
  console.log(`Cleared ${keys.length} audio files from localStorage`);
}

/**
 * Get list of saved audio files from server
 */
export async function getServerAudioFiles(): Promise<any[]> {
  try {
    const response = await fetch('/api/audio/save', {
      method: 'GET',
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || 'Failed to get audio files');
    }

    const result = await response.json();
    return result.files || [];
  } catch (error) {
    console.error('Error getting server audio files:', error);
    return [];
  }
}

/**
 * Delete audio file from server
 */
export async function deleteServerAudioFile(filename: string): Promise<boolean> {
  try {
    const response = await fetch(`/api/audio/save?filename=${encodeURIComponent(filename)}`, {
      method: 'DELETE',
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || 'Failed to delete audio file');
    }

    const result = await response.json();
    console.log(`Audio file deleted from server: ${filename}`);
    return true;
  } catch (error) {
    console.error('Error deleting server audio file:', error);
    return false;
  }
}
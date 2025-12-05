/**
 * Device Fingerprinting Utility
 * Generates a unique device ID based on browser and device characteristics
 * This ID persists across sessions using localStorage
 */

/**
 * Generate a unique device fingerprint
 * Combines multiple browser/device characteristics for uniqueness
 */
export const generateDeviceFingerprint = (): string => {
  const components: string[] = [];

  // Screen resolution
  components.push(`${screen.width}x${screen.height}`);
  components.push(`${screen.availWidth}x${screen.availHeight}`);
  components.push(screen.colorDepth.toString());
  components.push(screen.pixelDepth.toString());

  // Timezone
  components.push(Intl.DateTimeFormat().resolvedOptions().timeZone);

  // Language
  components.push(navigator.language);
  components.push(navigator.languages.join(','));

  // Platform
  components.push(navigator.platform);
  components.push(navigator.userAgent);

  // Hardware concurrency
  if (navigator.hardwareConcurrency) {
    components.push(navigator.hardwareConcurrency.toString());
  }

  // Device memory (if available)
  if ((navigator as any).deviceMemory) {
    components.push((navigator as any).deviceMemory.toString());
  }

  // Canvas fingerprint (more unique)
  try {
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    if (ctx) {
      ctx.textBaseline = 'top';
      ctx.font = '14px Arial';
      ctx.fillText('Device fingerprint', 2, 2);
      const canvasHash = canvas.toDataURL();
      components.push(canvasHash.substring(0, 50)); // Use first 50 chars
    }
  } catch (e) {
    // Canvas not available
  }

  // WebGL fingerprint
  try {
    const canvas = document.createElement('canvas');
    const gl = canvas.getContext('webgl') || canvas.getContext('experimental-webgl');
    if (gl) {
      const debugInfo = gl.getExtension('WEBGL_debug_renderer_info');
      if (debugInfo) {
        components.push(gl.getParameter(debugInfo.UNMASKED_VENDOR_WEBGL) || '');
        components.push(gl.getParameter(debugInfo.UNMASKED_RENDERER_WEBGL) || '');
      }
    }
  } catch (e) {
    // WebGL not available
  }

  // Combine all components
  const combined = components.join('|');

  // Generate hash (simple hash function)
  let hash = 0;
  for (let i = 0; i < combined.length; i++) {
    const char = combined.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash; // Convert to 32-bit integer
  }

  // Convert to positive hex string
  const deviceId = Math.abs(hash).toString(16).padStart(8, '0');

  return deviceId;
};

/**
 * Get or create device ID
 * Stores in localStorage for persistence across sessions
 */
export const getDeviceId = (): string => {
  const STORAGE_KEY = 'enyard_device_id';
  
  // Try to get existing device ID
  let deviceId = localStorage.getItem(STORAGE_KEY);
  
  if (!deviceId) {
    // Generate new device ID
    deviceId = generateDeviceFingerprint();
    
    // Add timestamp for additional uniqueness
    const timestamp = Date.now().toString(36);
    deviceId = `${deviceId}-${timestamp}`;
    
    // Store in localStorage
    localStorage.setItem(STORAGE_KEY, deviceId);
  }
  
  return deviceId;
};

/**
 * Get device information
 * Returns device characteristics for tracking
 */
export const getDeviceInfo = () => {
  return {
    deviceId: getDeviceId(),
    userAgent: navigator.userAgent,
    platform: navigator.platform,
    language: navigator.language,
    languages: navigator.languages,
    screenWidth: screen.width,
    screenHeight: screen.height,
    screenColorDepth: screen.colorDepth,
    timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
    hardwareConcurrency: navigator.hardwareConcurrency || null,
    deviceMemory: (navigator as any).deviceMemory || null,
    cookieEnabled: navigator.cookieEnabled,
    onLine: navigator.onLine,
    timestamp: new Date().toISOString(),
  };
};

/**
 * Reset device ID (for testing or user request)
 */
export const resetDeviceId = (): string => {
  const STORAGE_KEY = 'enyard_device_id';
  localStorage.removeItem(STORAGE_KEY);
  return getDeviceId();
};

export default {
  getDeviceId,
  getDeviceInfo,
  generateDeviceFingerprint,
  resetDeviceId,
};


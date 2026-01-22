import AsyncStorage from '@react-native-async-storage/async-storage';

const DEVICE_ID_KEY = 'campy_device_id';

/**
 * Generates a UUID v4 string
 */
function generateUUID(): string {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
    const r = (Math.random() * 16) | 0;
    const v = c === 'x' ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
}

/**
 * Gets the device ID from storage, or generates and stores a new one if it doesn't exist.
 * This ID persists across app sessions and is used to identify anonymous users.
 */
export async function getDeviceId(): Promise<string> {
  try {
    const existingId = await AsyncStorage.getItem(DEVICE_ID_KEY);
    if (existingId) {
      return existingId;
    }

    const newId = `device_${generateUUID()}`;
    await AsyncStorage.setItem(DEVICE_ID_KEY, newId);
    return newId;
  } catch (error) {
    console.error('Error getting/setting device ID:', error);
    // Fallback to a temporary ID if storage fails
    return `temp_${generateUUID()}`;
  }
}

/**
 * Gets the device ID synchronously from cache if available.
 * Returns null if not yet loaded. Use getDeviceId() for guaranteed result.
 */
let cachedDeviceId: string | null = null;

export async function initializeDeviceId(): Promise<string> {
  const deviceId = await getDeviceId();
  cachedDeviceId = deviceId;
  return deviceId;
}

export function getCachedDeviceId(): string | null {
  return cachedDeviceId;
}

/**
 * Clears the cached device ID (useful for testing)
 */
export function clearDeviceIdCache(): void {
  cachedDeviceId = null;
}

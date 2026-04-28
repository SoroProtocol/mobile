import * as LocalAuthentication from 'expo-local-authentication';

export async function isBiometricsAvailable(): Promise<boolean> {
  const compatible = await LocalAuthentication.hasHardwareAsync();
  const enrolled   = await LocalAuthentication.isEnrolledAsync();
  return compatible && enrolled;
}

export async function authenticateWithBiometrics(reason = 'Unlock SoroProtocol'): Promise<boolean> {
  const available = await isBiometricsAvailable();
  if (!available) return true; // fall back to allowing access

  const result = await LocalAuthentication.authenticateAsync({
    promptMessage:     reason,
    cancelLabel:       'Use PIN instead',
    fallbackLabel:     'Use PIN',
    disableDeviceFallback: false,
  });

  return result.success;
}

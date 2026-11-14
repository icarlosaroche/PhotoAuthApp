import { Alert, Linking, Platform } from 'react-native';
import * as ImagePicker from 'expo-image-picker';

export type PhotoAsset = {
  uri: string;
  source: 'gallery' | 'camera';
};

function permissionDeniedMessage(kind: 'galería' | 'cámara') {
  return `Se necesita permiso de ${kind} para continuar. Actívalo en la configuración del dispositivo.`;
}

async function ensureMediaLibraryPermission() {
  const current = await ImagePicker.getMediaLibraryPermissionsAsync();
  if (current.granted) {
    return true;
  }

  const requested = await ImagePicker.requestMediaLibraryPermissionsAsync();
  if (requested.granted) {
    return true;
  }

  Alert.alert('Permiso requerido', permissionDeniedMessage('galería'), [
    { text: 'Cancelar', style: 'cancel' },
    { text: 'Abrir ajustes', onPress: () => Linking.openSettings() },
  ]);
  return false;
}

async function ensureCameraPermission() {
  const current = await ImagePicker.getCameraPermissionsAsync();
  if (current.granted) {
    return true;
  }

  const requested = await ImagePicker.requestCameraPermissionsAsync();
  if (requested.granted) {
    return true;
  }

  Alert.alert('Permiso requerido', permissionDeniedMessage('cámara'), [
    { text: 'Cancelar', style: 'cancel' },
    { text: 'Abrir ajustes', onPress: () => Linking.openSettings() },
  ]);
  return false;
}

export async function pickPhotoFromGallery(): Promise<PhotoAsset | null> {
  const allowed = await ensureMediaLibraryPermission();
  if (!allowed) {
    return null;
  }

  const result = await ImagePicker.launchImageLibraryAsync({
    mediaTypes: ['images'],
    allowsEditing: true,
    quality: 0.85,
  });

  if (result.canceled || !result.assets[0]?.uri) {
    return null;
  }

  return { uri: result.assets[0].uri, source: 'gallery' };
}

export async function capturePhotoWithCamera(): Promise<PhotoAsset | null> {
  if (Platform.OS === 'web') {
    Alert.alert(
      'Cámara no disponible en web',
      'Abre la app en Expo Go (Android o iOS) para capturar una fotografía con la cámara.',
    );
    return null;
  }

  const allowed = await ensureCameraPermission();
  if (!allowed) {
    return null;
  }

  const result = await ImagePicker.launchCameraAsync({
    mediaTypes: ['images'],
    allowsEditing: true,
    quality: 0.85,
  });

  if (result.canceled || !result.assets[0]?.uri) {
    return null;
  }

  return { uri: result.assets[0].uri, source: 'camera' };
}

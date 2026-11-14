import { useState } from 'react';
import { Alert, ScrollView, StyleSheet, Text, View } from 'react-native';
import { PhotoPreview } from '../components/PhotoPreview';
import { PrimaryButton } from '../components/PrimaryButton';
import { useAuth } from '../context/AuthContext';
import { capturePhotoWithCamera, pickPhotoFromGallery, type PhotoAsset } from '../services/photo';
import { colors, radius, spacing } from '../theme';

export function HomeScreen() {
  const { session, logOut } = useAuth();
  const [photo, setPhoto] = useState<PhotoAsset | null>(null);
  const [busy, setBusy] = useState(false);

  const email = session?.user.email ?? 'sesión activa';

  const handlePick = async () => {
    try {
      setBusy(true);
      const next = await pickPhotoFromGallery();
      if (next) {
        setPhoto(next);
      }
    } catch (error) {
      const message = error instanceof Error ? error.message : 'No se pudo abrir la galería.';
      Alert.alert('Galería', message);
    } finally {
      setBusy(false);
    }
  };

  const handleCapture = async () => {
    try {
      setBusy(true);
      const next = await capturePhotoWithCamera();
      if (next) {
        setPhoto(next);
      }
    } catch (error) {
      const message = error instanceof Error ? error.message : 'No se pudo abrir la cámara.';
      Alert.alert('Cámara', message);
    } finally {
      setBusy(false);
    }
  };

  const handleRemove = () => {
    if (!photo) {
      return;
    }
    Alert.alert('Eliminar fotografía', '¿Quitar la imagen de la vista previa?', [
      { text: 'Cancelar', style: 'cancel' },
      {
        text: 'Eliminar',
        style: 'destructive',
        onPress: () => setPhoto(null),
      },
    ]);
  };

  const handleLogout = async () => {
    try {
      await logOut();
    } catch (error) {
      const message = error instanceof Error ? error.message : 'No se pudo cerrar sesión.';
      Alert.alert('Sesión', message);
    }
  };

  return (
    <ScrollView style={styles.flex} contentContainerStyle={styles.content}>
      <View style={styles.header}>
        <View>
          <Text style={styles.kicker}>Pantalla principal</Text>
          <Text style={styles.title}>Gestión de fotografías</Text>
          <Text style={styles.email}>{email}</Text>
        </View>
        <View style={styles.logout}>
          <PrimaryButton label="Cerrar sesión" variant="danger" onPress={handleLogout} />
        </View>
      </View>

      <PhotoPreview photo={photo} />

      <View style={styles.actions}>
        <PrimaryButton
          label="Seleccionar de la galería"
          onPress={handlePick}
          loading={busy}
        />
        <PrimaryButton
          label="Capturar con la cámara"
          variant="secondary"
          onPress={handleCapture}
          disabled={busy}
        />
        <PrimaryButton
          label="Eliminar de la vista previa"
          variant="danger"
          onPress={handleRemove}
          disabled={!photo || busy}
        />
      </View>

      <View style={styles.hint}>
        <Text style={styles.hintText}>
          Puedes cambiar la fotografía actual eligiendo otra de la galería o tomando una nueva.
          La sesión permanece activa al cerrar y volver a abrir la aplicación.
        </Text>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  flex: {
    flex: 1,
    backgroundColor: colors.background,
  },
  content: {
    padding: spacing.lg,
    paddingBottom: spacing.xl,
    gap: spacing.lg,
  },
  header: {
    gap: spacing.md,
  },
  kicker: {
    color: colors.accent,
    fontWeight: '700',
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  title: {
    fontSize: 26,
    fontWeight: '800',
    color: colors.text,
  },
  email: {
    color: colors.muted,
    marginTop: 4,
  },
  logout: {
    alignSelf: 'flex-start',
  },
  actions: {
    gap: spacing.sm,
  },
  hint: {
    backgroundColor: colors.surface,
    borderRadius: radius.md,
    padding: spacing.md,
    borderWidth: 1,
    borderColor: colors.border,
  },
  hintText: {
    color: colors.muted,
    lineHeight: 20,
  },
});

import { Image, StyleSheet, Text, View } from 'react-native';
import type { PhotoAsset } from '../services/photo';
import { colors, radius, spacing } from '../theme';

type Props = {
  photo: PhotoAsset | null;
};

export function PhotoPreview({ photo }: Props) {
  if (!photo) {
    return (
      <View style={styles.placeholder}>
        <Text style={styles.placeholderTitle}>Sin fotografía</Text>
        <Text style={styles.placeholderText}>
          Selecciona una imagen de la galería o captura una con la cámara.
        </Text>
      </View>
    );
  }

  return (
    <View style={styles.frame}>
      <Image source={{ uri: photo.uri }} style={styles.image} accessibilityLabel="Fotografía actual" />
      <Text style={styles.caption}>
        Origen: {photo.source === 'camera' ? 'cámara' : 'galería'}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  placeholder: {
    minHeight: 280,
    borderRadius: radius.lg,
    borderWidth: 2,
    borderStyle: 'dashed',
    borderColor: colors.border,
    backgroundColor: colors.overlay,
    alignItems: 'center',
    justifyContent: 'center',
    padding: spacing.lg,
  },
  placeholderTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: colors.text,
    marginBottom: spacing.xs,
  },
  placeholderText: {
    textAlign: 'center',
    color: colors.muted,
    lineHeight: 20,
  },
  frame: {
    borderRadius: radius.lg,
    overflow: 'hidden',
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
  },
  image: {
    width: '100%',
    height: 320,
    backgroundColor: '#0A355A',
  },
  caption: {
    padding: spacing.sm,
    color: colors.muted,
    fontSize: 13,
    textAlign: 'center',
  },
});

import { useState } from 'react';
import {
  Alert,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import { PrimaryButton } from '../components/PrimaryButton';
import { useAuth } from '../context/AuthContext';
import { colors, radius, spacing } from '../theme';

export function LoginScreen() {
  const { signIn, signUp } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const validate = () => {
    if (!email.trim() || !password) {
      Alert.alert('Datos incompletos', 'Ingresa correo electrónico y contraseña.');
      return false;
    }
    if (password.length < 6) {
      Alert.alert('Contraseña corta', 'Usa al menos 6 caracteres.');
      return false;
    }
    return true;
  };

  const handleSignIn = async () => {
    if (!validate()) {
      return;
    }
    try {
      setIsSubmitting(true);
      await signIn(email, password);
    } catch (error) {
      const message = error instanceof Error ? error.message : 'No fue posible iniciar sesión.';
      Alert.alert('Error de autenticación', message);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSignUp = async () => {
    if (!validate()) {
      return;
    }
    try {
      setIsSubmitting(true);
      const extra = await signUp(email, password);
      if (extra) {
        Alert.alert('Registro', extra);
      }
    } catch (error) {
      const message = error instanceof Error ? error.message : 'No fue posible crear la cuenta.';
      Alert.alert('Error de registro', message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <KeyboardAvoidingView
      style={styles.flex}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <ScrollView contentContainerStyle={styles.content} keyboardShouldPersistTaps="handled">
        <View style={styles.hero}>
          <Text style={styles.kicker}>PhotoAuthApp</Text>
          <Text style={styles.title}>Autenticación y fotografías</Text>
          <Text style={styles.subtitle}>
            Inicia sesión con correo y contraseña para acceder a la cámara y a la galería.
          </Text>
        </View>

        <View style={styles.card}>
          <Text style={styles.label}>Correo electrónico</Text>
          <TextInput
            autoCapitalize="none"
            autoComplete="email"
            keyboardType="email-address"
            placeholder="correo@ejemplo.com"
            placeholderTextColor={colors.muted}
            style={styles.input}
            value={email}
            onChangeText={setEmail}
          />

          <Text style={styles.label}>Contraseña</Text>
          <TextInput
            autoCapitalize="none"
            autoComplete="password"
            placeholder="••••••••"
            placeholderTextColor={colors.muted}
            secureTextEntry
            style={styles.input}
            value={password}
            onChangeText={setPassword}
          />

          <PrimaryButton
            label="Iniciar sesión"
            onPress={handleSignIn}
            loading={isSubmitting}
          />
          <View style={styles.gap} />
          <PrimaryButton
            label="Crear cuenta"
            variant="secondary"
            onPress={handleSignUp}
            disabled={isSubmitting}
          />
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  flex: {
    flex: 1,
    backgroundColor: colors.background,
  },
  content: {
    flexGrow: 1,
    justifyContent: 'center',
    padding: spacing.lg,
  },
  hero: {
    marginBottom: spacing.lg,
  },
  kicker: {
    color: colors.accent,
    fontWeight: '700',
    letterSpacing: 1,
    textTransform: 'uppercase',
    marginBottom: spacing.xs,
  },
  title: {
    fontSize: 28,
    fontWeight: '800',
    color: colors.text,
    marginBottom: spacing.sm,
  },
  subtitle: {
    color: colors.muted,
    lineHeight: 22,
  },
  card: {
    backgroundColor: colors.surface,
    borderRadius: radius.lg,
    padding: spacing.lg,
    borderWidth: 1,
    borderColor: colors.border,
    gap: spacing.sm,
  },
  label: {
    fontWeight: '600',
    color: colors.text,
  },
  input: {
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radius.sm,
    paddingHorizontal: spacing.md,
    minHeight: 48,
    color: colors.text,
    backgroundColor: colors.background,
  },
  gap: {
    height: 4,
  },
});

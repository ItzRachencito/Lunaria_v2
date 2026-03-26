import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
  ActivityIndicator,
} from 'react-native';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';

import { useResetPasswordMutation } from '../../api/authApi';
import { AuthStackParamList } from '../../navigation/AuthNavigator';

type ResetPasswordNavigationProp = NativeStackNavigationProp<AuthStackParamList>;
type ResetPasswordRouteProp = RouteProp<AuthStackParamList, 'ResetPassword'>;

const ResetPasswordScreen = () => {
  const navigation = useNavigation<ResetPasswordNavigationProp>();
  const route = useRoute<ResetPasswordRouteProp>();
  const { email } = route.params || {};

  const [otp, setOtp] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [passwordReset, setPasswordReset] = useState(false);
  
  const [resetPassword, { isLoading }] = useResetPasswordMutation();

  const handleOtpChange = (value: string) => {
    // Only allow digits and max 6 characters
    const filtered = value.replace(/\D/g, '').slice(0, 6);
    setOtp(filtered);
  };

  const handleResetPassword = async () => {
    if (!otp.trim()) {
      Alert.alert('Error', 'Por favor ingresa el código OTP');
      return;
    }

    if (otp.length !== 6) {
      Alert.alert('Error', 'El código OTP debe tener 6 dígitos');
      return;
    }

    if (!newPassword) {
      Alert.alert('Error', 'Por favor ingresa la nueva contraseña');
      return;
    }

    if (newPassword.length < 6) {
      Alert.alert('Error', 'La contraseña debe tener al menos 6 caracteres');
      return;
    }

    if (newPassword !== confirmPassword) {
      Alert.alert('Error', 'Las contraseñas no coinciden');
      return;
    }

    try {
      const result = await resetPassword({ email, otp, newPassword }).unwrap();
      
      if (result.success) {
        Alert.alert('Éxito', result.message);
        setPasswordReset(true);
      } else {
        Alert.alert('Error', result.message);
      }
    } catch (error: any) {
      Alert.alert('Error', error?.data?.message || 'Error al restablecer la contraseña');
    }
  };

  if (passwordReset) {
    return (
      <View style={styles.container}>
        <View style={styles.formContainer}>
          <Text style={styles.icon}>🎉</Text>
          <Text style={styles.title}>¡Contraseña Restablecida!</Text>
          <Text style={styles.subtitle}>
            Tu contraseña ha sido actualizada exitosamente.
          </Text>

          <TouchableOpacity
            style={[styles.button, styles.primaryButton]}
            onPress={() => navigation.navigate('Login')}
          >
            <Text style={styles.buttonText}>Iniciar sesión</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.formContainer}>
        <Text style={styles.icon}>🔑</Text>
        <Text style={styles.title}>Nueva Contraseña</Text>
        <Text style={styles.subtitle}>
          Ingresa el código OTP que recibiste en tu correo y crea una nueva contraseña
        </Text>
        
        {email && (
          <Text style={styles.emailText}>
            Recuperando cuenta: {email}
          </Text>
        )}

        <TextInput
          style={[styles.input, styles.otpInput]}
          placeholder="123456"
          value={otp}
          onChangeText={handleOtpChange}
          keyboardType="number-pad"
          maxLength={6}
          textAlign="center"
        />
        <Text style={styles.otpHint}>Ingresa los 6 dígitos del código</Text>

        <TextInput
          style={styles.input}
          placeholder="Nueva contraseña (mínimo 6 caracteres)"
          value={newPassword}
          onChangeText={setNewPassword}
          secureTextEntry
        />

        <TextInput
          style={styles.input}
          placeholder="Confirmar contraseña"
          value={confirmPassword}
          onChangeText={setConfirmPassword}
          secureTextEntry
        />

        <TouchableOpacity
          style={[styles.button, styles.primaryButton, isLoading && styles.buttonDisabled]}
          onPress={handleResetPassword}
          disabled={isLoading}
        >
          {isLoading ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <Text style={styles.buttonText}>Restablecer Contraseña</Text>
          )}
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.linkButton}
          onPress={() => navigation.navigate('ForgotPassword')}
        >
          <Text style={styles.linkText}>← Solicitar nuevo código</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#2C3335',
    justifyContent: 'center',
    padding: 20,
  },
  formContainer: {
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 20,
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  icon: {
    fontSize: 48,
    textAlign: 'center',
    marginBottom: 10,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    color: '#333',
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 14,
    textAlign: 'center',
    color: '#666',
    marginBottom: 15,
    lineHeight: 20,
  },
  emailText: {
    fontSize: 12,
    color: '#666',
    textAlign: 'center',
    marginBottom: 15,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 12,
    marginBottom: 10,
    fontSize: 16,
  },
  otpInput: {
    fontSize: 24,
    letterSpacing: 8,
    marginBottom: 5,
  },
  otpHint: {
    fontSize: 12,
    color: '#999',
    textAlign: 'center',
    marginBottom: 15,
  },
  button: {
    borderRadius: 8,
    padding: 15,
    alignItems: 'center',
    marginBottom: 10,
  },
  primaryButton: {
    backgroundColor: '#007bff',
  },
  buttonDisabled: {
    opacity: 0.6,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  linkButton: {
    alignItems: 'center',
    marginTop: 10,
  },
  linkText: {
    color: '#007bff',
    fontSize: 16,
  },
});

export default ResetPasswordScreen;

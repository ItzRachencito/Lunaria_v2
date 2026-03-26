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
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';

import { useRequestPasswordResetMutation, useResendPasswordResetOtpMutation } from '../../api/authApi';
import { AuthStackParamList } from '../../navigation/AuthNavigator';

type ForgotPasswordNavigationProp = NativeStackNavigationProp<AuthStackParamList>;

const ForgotPasswordScreen = () => {
  const [email, setEmail] = useState('');
  const [emailSent, setEmailSent] = useState(false);
  
  const [requestReset, { isLoading: isRequesting }] = useRequestPasswordResetMutation();
  const [resendOtp, { isLoading: isResending }] = useResendPasswordResetOtpMutation();
  
  const navigation = useNavigation<ForgotPasswordNavigationProp>();

  const handleRequestOtp = async () => {
    if (!email.trim()) {
      Alert.alert('Error', 'Por favor ingresa tu correo electrónico');
      return;
    }

    try {
      const result = await requestReset(email).unwrap();
      
      if (result.success) {
        Alert.alert('Éxito', result.message);
        setEmailSent(true);
      } else {
        Alert.alert('Error', result.message);
      }
    } catch (error: any) {
      Alert.alert('Error', error?.data?.message || 'Error al solicitar el código');
    }
  };

  const handleResendOtp = async () => {
    try {
      const result = await resendOtp(email).unwrap();
      
      if (result.success) {
        Alert.alert('Éxito', result.message);
      } else {
        Alert.alert('Error', result.message);
      }
    } catch (error: any) {
      Alert.alert('Error', error?.data?.message || 'Error al reenviar el código');
    }
  };

  if (emailSent) {
    return (
      <View style={styles.container}>
        <View style={styles.formContainer}>
          <Text style={styles.icon}>📧</Text>
          <Text style={styles.title}>Revisa tu correo</Text>
          <Text style={styles.subtitle}>
            Hemos enviado un código OTP a{'\n'}
            <Text style={styles.emailText}>{email}</Text>
          </Text>

          <View style={styles.infoBox}>
            <Text style={styles.infoTitle}>¿No recibiste el código?</Text>
            <Text style={styles.infoText}>
              Revisa tu carpeta de spam o espera unos segundos antes de solicitar otro código.
            </Text>
          </View>

          <TouchableOpacity
            style={[styles.button, styles.primaryButton]}
            onPress={() => navigation.navigate('ResetPassword', { email })}
          >
            <Text style={styles.buttonText}>Ingresar código OTP</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.button, styles.secondaryButton]}
            onPress={handleResendOtp}
            disabled={isResending}
          >
            {isResending ? (
              <ActivityIndicator color="#666" />
            ) : (
              <Text style={styles.secondaryButtonText}>Reenviar código</Text>
            )}
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.linkButton}
            onPress={() => navigation.goBack()}
          >
            <Text style={styles.linkText}>← Volver al login</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.formContainer}>
        <Text style={styles.icon}>🔐</Text>
        <Text style={styles.title}>Recuperar Contraseña</Text>
        <Text style={styles.subtitle}>
          Ingresa tu correo electrónico y te enviaremos un código OTP para recuperar tu cuenta
        </Text>

        <TextInput
          style={styles.input}
          placeholder="tu-correo@lunaria.com"
          value={email}
          onChangeText={setEmail}
          keyboardType="email-address"
          autoCapitalize="none"
        />

        <TouchableOpacity
          style={[styles.button, styles.primaryButton, isRequesting && styles.buttonDisabled]}
          onPress={handleRequestOtp}
          disabled={isRequesting}
        >
          {isRequesting ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <Text style={styles.buttonText}>Enviar código OTP</Text>
          )}
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.linkButton}
          onPress={() => navigation.goBack()}
        >
          <Text style={styles.linkText}>← Volver al login</Text>
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
    marginBottom: 20,
    lineHeight: 20,
  },
  emailText: {
    fontWeight: 'bold',
    color: '#007bff',
  },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 12,
    marginBottom: 15,
    fontSize: 16,
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
  secondaryButton: {
    backgroundColor: '#f5f5f5',
    borderWidth: 1,
    borderColor: '#ddd',
  },
  buttonDisabled: {
    opacity: 0.6,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  secondaryButtonText: {
    color: '#666',
    fontSize: 16,
  },
  infoBox: {
    backgroundColor: '#e7f3ff',
    borderRadius: 8,
    padding: 15,
    marginBottom: 20,
  },
  infoTitle: {
    fontWeight: 'bold',
    color: '#007bff',
    marginBottom: 5,
  },
  infoText: {
    fontSize: 12,
    color: '#666',
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

export default ForgotPasswordScreen;

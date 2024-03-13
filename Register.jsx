import React, { useState } from 'react';
import { View, Image, useWindowDimensions, TextInput, TouchableOpacity, StyleSheet, Text, Alert } from 'react-native';
import axios from 'axios';
export default function Register({ navigation }) {
  const { width, height } = useWindowDimensions();
  const [idUsuario, setIdUsuario] = useState('');
  const [correo, setCorreo] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const handleRegister = async() => {
    // Check if inputs are not empty
    if (!idUsuario.trim() || !password.trim() || !confirmPassword.trim() || !correo.trim()) {
      Alert.alert('Error', 'Por favor, completa todos los campos');
      return;
    } else{
              // Check if passwords match
            if (password !== confirmPassword) {
              Alert.alert('Error', 'Las contraseñas no coinciden');
              return;
            } else{
              try {
                const response = await axios.post('http://192.168.1.44:4000/register', {
                  idUsuario: idUsuario,
                  password: password,
                  correo: correo, // Add email here if needed
                });
          
                
          
                Alert.alert('Success', 'Usuario registrado exitosamente');
                navigation.navigate('Inicial');
              } catch (error) {
                console.error('Error:', error);
                Alert.alert('Error', 'Ha ocurrido un error al registrar usuario');
              }
            }
    }
  };

  const goToLogin = () => {
    navigation.navigate('Login');
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const toggleConfirmPasswordVisibility = () => {
    setShowConfirmPassword(!showConfirmPassword);
  };

  return (
    <View style={styles.container}>
      <Image
        source={require('../assets/guerra.jpg')}
        style={{
          flex: 1,
          resizeMode: 'cover',
          width: width,
          height: height,
          position: 'absolute',
          top: 0,
          left: 0,
        }}
      />
      <View style={styles.overlayContainer}>
        <Text style={styles.title}>Registrarse</Text>
        <View style={styles.inputContainer}>

          <TextInput
            style={styles.input}
            placeholder="Id del usuario"
            onChangeText={setIdUsuario}
            value={idUsuario}
          />
          <TextInput
            style={styles.input}
            placeholder="Correo"
            onChangeText={setCorreo}
            value={correo}
          />
          <View style={styles.passwordContainer}>
            <TextInput
              style={styles.passwordInput}
              placeholder="Contraseña"
              secureTextEntry={!showPassword}
              onChangeText={setPassword}
              value={password}
            />
            <TouchableOpacity onPress={togglePasswordVisibility} style={styles.showPasswordButton}>
              <Text style={styles.showPasswordButtonText}>{showPassword ? 'Ocultar' : 'Mostrar'}</Text>
            </TouchableOpacity>
          </View>
          <View style={styles.passwordContainer}>
            <TextInput
              style={styles.passwordInput}
              placeholder="Repetir contraseña"
              secureTextEntry={!showConfirmPassword}
              onChangeText={setConfirmPassword}
              value={confirmPassword}
            />
            <TouchableOpacity onPress={toggleConfirmPasswordVisibility} style={styles.showPasswordButton}>
              <Text style={styles.showPasswordButtonText}>{showConfirmPassword ? 'Ocultar' : 'Mostrar'}</Text>
            </TouchableOpacity>
          </View>
        </View>
        <TouchableOpacity style={styles.button} onPress={handleRegister}>
          <Text style={styles.buttonText}>Registrarse</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={goToLogin}>
          <Text style={styles.loginText}>¿Ya tienes una cuenta? Inicia sesión aquí</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'row', // Set flexDirection to 'row' for horizontal layout
    justifyContent: 'center',
    alignItems: 'center',
  },
  overlayContainer: {
    maxWidth: 300,
    width: '100%',
    margin: 40,
    padding: 15,
    shadowColor: 'rgba(0, 0, 0, 0.2)',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.8,
    shadowRadius: 8,
    borderRadius: 10,
    backgroundColor: 'rgba(255, 255, 255, 0.8)',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    color: 'black',
    textAlign: 'center', // Align text to the center
  },
  inputContainer: {
    marginBottom: 10,
  },
  input: {
    height: 30, // Reduced height
    borderColor: 'gray',
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 10,
    marginBottom: 5, // Reduced margin bottom
    backgroundColor: 'white',
  },
  passwordContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 5, // Reduced margin bottom
  },
  passwordInput: {
    flex: 1,
    height: 30, // Reduced height
    borderColor: 'gray',
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 10,
    backgroundColor: 'white',
  },
  showPasswordButton: {
    paddingVertical: 5, // Reduced padding
    paddingHorizontal: 10, // Reduced padding
    borderRadius: 8,
    backgroundColor: '#4CAF50',
    marginLeft: 5, // Reduced margin left
  },
  showPasswordButtonText: {
    color: 'white',
    fontWeight: 'bold',
  },
  button: {
    backgroundColor: '#4CAF50',
    padding: 10,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 10,
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  loginText: {
    marginTop: 10,
    color: 'blue',
    textDecorationLine: 'underline',
    textAlign: 'center',
  },
});

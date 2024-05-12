import React, { useState } from 'react';
import { View, Image, useWindowDimensions, TextInput, TouchableOpacity, StyleSheet, Text, Alert } from 'react-native';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { IP } from '../config';
import CryptoJS from 'crypto-js';

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
                  const response = await axios.post(IP+'/register', {
                  idUsuario: idUsuario,
                  password: CryptoJS.SHA256(password).toString(CryptoJS.enc.Hex),
                  correo: correo, // Add email here if needed
                });
          
                const token = response.data.token;
                await AsyncStorage.setItem('token', token);
                console.log('TokenRegister:', token);
                Alert.alert('Success', 'Usuario registrado exitosamente');
                navigation.navigate('Inicial', { token: token });
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
          <View style={styles.passwordInputContainer}>
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
          <View style={styles.passwordInputContainer}>
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
        <Text style={styles.loginText}>¿Ya tienes una cuenta? Inicia sesión aquí</Text>
        <TouchableOpacity style={styles.button} onPress={goToLogin}>
          <Text style={styles.buttonText}>Iniciar Sesión</Text>
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
    top:10,
    bottom:20,
    width: '100%',
    margin: 40,
    padding: 15,
    shadowColor: 'rgba(0, 0, 0, 0.2)',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0,
    shadowRadius: 8,
    borderRadius: 10,
    backgroundColor: 'rgba(0, 0, 0, 0.4)', // Change the background color to a darker shade
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 5,
    textAlign: 'center', // Align text to the center
    color: 'white',
    textTransform: 'uppercase',
    // Adding text shadow to create black outline
    textShadowColor: 'black',
    textShadowOffset: {width: 2, height: 1},
    textShadowRadius: 3,
  },
  
  inputContainer: {
    flexDirection: 'column', // Set flexDirection to 'column' for vertical layout
    marginBottom: 15,
  },
  input: {
    height: 40,
    borderColor: 'black',
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 10,
    marginBottom: 2,
    backgroundColor: 'white',
  },
  passwordInputContainer: {
    flexDirection: 'row', // Set flexDirection to 'row' for horizontal layout
    alignItems: 'center', // Align items vertically in the center
  },
  passwordInput: {
    flex: 1,
    height: 40,
    borderColor: 'black',
    borderWidth: 1,
    borderRadius: 8,
    marginBottom: 2,
    paddingHorizontal: 10,
    marginRight: 10,
    backgroundColor: 'white',
    
  },
  showPasswordButton: {
    padding: 8,
    borderRadius: 8,
    backgroundColor: 'olive',
    justifyContent: 'center',
    alignItems: 'center',
    overflow: 'hidden',
    // Adding 3D effect
    shadowColor: '#000',
    shadowOffset: {
      width: 1,
      height: 3,
    },
    shadowOpacity: 0.5,
    shadowRadius: 4,
    elevation: 5,
    // Adding larger darker bottom part
    borderBottomColor: 'rgba(0,0,0,0.5)',
    borderBottomWidth: 5,
  },
  showPasswordButtonText: {
    color: 'white',
    fontSize: 12,
    fontWeight: 'bold',
    textTransform: 'uppercase',
    // Adding text shadow to create black outline
    textShadowColor: 'black',
    textShadowOffset: { width: 2, height: 1 },
    textShadowRadius: 2,
  },
  button: {
    backgroundColor: '#556b2f',
    paddingVertical: 11,
    paddingHorizontal: 40,
    borderRadius: 25,
    marginBottom: 0,
    width: 270, // Ensuring all buttons have the same width
    justifyContent: 'center',
    alignItems: 'center',
    overflow: 'hidden',
    // Adding 3D effect
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 3,
    },
    shadowOpacity: 0.5,
    shadowRadius: 4,
    elevation: 5,
    // Adding larger darker bottom part
    borderBottomColor: 'rgba(0,0,0,0.5)',
    borderBottomWidth: 5,
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
    textTransform: 'uppercase',
    // Adding text shadow to create black outline
    textShadowColor: 'black',
    textShadowOffset: { width: 2, height: 1 },
    textShadowRadius: 2,
  },
  loginText: {
    fontSize: 12,
    marginTop:4,
    fontWeight: 'bold',
    color: 'white',
    textAlign: 'center', // Align text to the center
  },
});


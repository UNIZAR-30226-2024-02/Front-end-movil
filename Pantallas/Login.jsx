import React, { useState, useEffect } from 'react';
import { View, Image, useWindowDimensions, TextInput, TouchableOpacity, StyleSheet, Text, Alert } from 'react-native';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { IP } from '../config';
import io from 'socket.io-client';
//import CryptoJS from 'crypto-js';

export default function App({ navigation }) {
  const { width, height } = useWindowDimensions();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [socket, setSocket] = useState('');

  useEffect(() => {
    setSocket(io(IP))
  }, [])

  const handleLogin = async() => {
    // Validate that both username and password are filled
    if (username && password) {
      // Handle login logic here
      // Assuming login is successful, navigate to the "Inicial" screen
      try {
          const response = await axios.post(IP+'/login', {
          id: username,
          password: password,
        });
  
        const token = response.data.token;
        await AsyncStorage.setItem('token', token);

        try{
          const partida =await axios.get(IP+'/partida/estoyEnPartida', {
            headers: {
              Authorization: token,
            },
          });
          console.log(partida.data.partida);
          if(partida.data){
            try{
              const partidaInfo =await axios.put(IP+'/partida/getPartida', { idPartida:partida.data.partida},{headers: {'Authorization': token}},);
              console.log(partidaInfo.data);
              Alert.alert('Partida en curso.');
              navigation.navigate('RiskMap', { token: token, partida: partidaInfo.data, socket: socket });
            }catch(error){
              console.error('Error:', error);
            }
          }else{
            Alert.alert('Éxito', 'Usuario logeado exitosamente');
            navigation.navigate('Inicial', { id: username, token: token });
          }
        }catch(error){
          console.error('Error:', error);
          Alert.alert('Error', 'Ha ocurrido un error al logear usuario');
        }
        // Store token in AsyncStorage
        
      } catch (error) {
        console.error('Error:', error);
        Alert.alert('Error', 'Ha ocurrido un error al logear usuario');
      }
    } else {
      // Display error message or handle empty fields
      Alert.alert('Error','Por favor, rellene los dos campos');
    }
  };

  const handleRegister = () => {
    navigation.navigate('Register');
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
        resizeMode="stretch"
      />
      <View style={styles.overlayContainer}>
        <Text style={styles.title}>Iniciar Sesión</Text>
        <View style={styles.inputContainer}>
          <TextInput
            style={styles.input}
            placeholder="Nombre de usuario"
            value={username}
            onChangeText={setUsername}
          />
          <View style={styles.passwordInputContainer}>
            <TextInput
              style={styles.passwordInput}
              placeholder="Contraseña"
              value={password}
              onChangeText={setPassword}
              secureTextEntry={!showPassword}
            />
            <TouchableOpacity
              style={styles.showPasswordButton}
              onPress={() => setShowPassword(!showPassword)}
            >
              <Text style={styles.showPasswordButtonText}>{showPassword ? 'Ocultar' : 'Mostrar'}</Text>
            </TouchableOpacity>
          </View>
        </View>
        <TouchableOpacity style={styles.button} onPress={handleLogin}>
          <Text style={styles.buttonText}>Iniciar Sesión</Text>
        </TouchableOpacity>
        <Text style={styles.registerText}>Si no tienes cuenta puedes registrarte aquí</Text>

        <TouchableOpacity style={styles.button} onPress={handleRegister}>
          <Text style={styles.buttonText}>Registrarse</Text>
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
    marginBottom: 10,
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
  registerText: {
    fontSize: 12,
    marginTop:4,
    fontWeight: 'bold',
    color: 'white',
    textAlign: 'center', // Align text to the center
  },
});

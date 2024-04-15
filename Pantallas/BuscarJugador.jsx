import React, { useState } from 'react';
import { View, Image, useWindowDimensions, TextInput, TouchableOpacity, StyleSheet, Text, Alert } from 'react-native';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function App({ navigation ,route }) {

  const { token } = route.params;
  console.log('Token:', token);
  const { width, height } = useWindowDimensions();
  const [username, setUsername] = useState('');

  const handleFriendShip = async() => {
    // Validate that both username and password are filled
    if (username) {
      // Handle login logic here
      // Assuming login is successful, navigate to the "Inicial" screen
      try {
        const response = await axios.post('http://192.168.79.96:4000/amistad', 
        {idDestino: username},
        { headers: { Authorization: token } }
      );

      } catch (error) {
        console.error('Error:', error);
        Alert.alert('Error', 'Ha ocurrido un error al realizar la peticon de amistad');
      }
    } else {
      // Display error message or handle empty fields
      alert('Porfavor, rellene el id del usuario para pedirle la amistad.');
    }
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
        <Text style={styles.title}>Enviar solicitud de amistad</Text>
        <View style={styles.inputContainer}>
          <TextInput
            style={styles.input}
            placeholder="ID del usuario a solicitar la amistad"
            value={username}
            onChangeText={setUsername}
          />
        </View>
        <TouchableOpacity style={styles.button} onPress={handleFriendShip}>
          <Text style={styles.buttonText}>Buscar amigo</Text>
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
    flexDirection: 'column', // Set flexDirection to 'column' for vertical layout
    marginBottom: 15,
  },
  input: {
    height: 40,
    borderColor: 'gray',
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
    borderColor: 'gray',
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 10,
    marginRight: 10,
    backgroundColor: 'white',
  },
  showPasswordButton: {
    backgroundColor: '#4CAF50',
    padding: 8,
    borderRadius: 8,
  },
  showPasswordButtonText: {
    color: 'white',
    fontSize: 12,
    fontWeight: 'bold',
  },
  button: {
    backgroundColor: '#4CAF50',
    padding: 10,
    borderRadius: 8,
    alignItems: 'center',
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  registerText: {
    marginTop: 10,
    color: 'blue',
    textDecorationLine: 'underline',
    textAlign: 'center', // Align text to the center
  },
});

import React, { useState } from 'react';
import { View, Image, useWindowDimensions, TextInput, TouchableOpacity, StyleSheet, Text, Alert } from 'react-native';
import axios from 'axios';
import { IP } from '../config';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { MaterialIcons } from '@expo/vector-icons';

export default function App({ navigation ,route }) {

  const {userid, token } = route.params;
  const { width, height } = useWindowDimensions();
  const [username, setUsername] = useState('');

  const goToInicial=()=>{
    navigation.navigate('Amistad', { userid : userid, token: token });
  };

  const handleFriendShip = async() => {
    // Validate that both username and password are filled
    if (username) {
      // Handle login logic here
      // Assuming login is successful, navigate to the "Inicial" screen
      try {
        const response = await axios.post(IP+'/amistad', 
        {idDestino: username},
        { headers: { Authorization: token } }
      );
        Alert.alert('La petición de amistad se ha realizado correctamente');
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
          resizeMode:"stretch"
        }}
      />
      <TouchableOpacity
        style={{ marginTop:-250,  marginLeft:-100,width: 50,
        height: 50,
        alignItems:'center',
        justifyContent: 'center',
        borderRadius: 25, // Half of the width and height to make it a circle
        backgroundColor: 'silver'}}
        onPress={goToInicial}
      >
        <MaterialIcons name="arrow-back" size={30} color="black" />
      </TouchableOpacity>

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
          <Text style={styles.buttonText}>ENVIAR</Text>
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
    backgroundColor: 'silver',
    borderWidth:2,
    borderColor:'#DB4437',
    color:'gray',
  },
  title: {
    color: 'white',
    fontSize: 24,
    fontWeight: 'bold',
    textTransform: 'uppercase',
    textShadowColor: 'black',
    textShadowOffset: { width: 2, height: 1 },
    textShadowRadius: 2,
    textAlign:'center',
    marginBottom:20,
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
  button: {
    backgroundColor: 'darkgreen',
    paddingVertical: 11,
    paddingHorizontal: 40,
    borderRadius: 12,
    marginBottom: 0,
    marginLeft: 55,
    alignItems: 'center',
    justifyContent: 'center',
    alignItems: 'center',
    overflow: 'hidden',
    width:150,
    height:70,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 3,
    },
    shadowOpacity: 0.5,
    shadowRadius: 4,
    elevation: 5,
    borderBottomColor: 'rgba(0,0,0,0.2)',
    borderBottomWidth: 5,
  },
  buttonText: {
    color: 'white',
    fontSize: 19,
    fontWeight: 'bold',
    textTransform: 'uppercase',
    textShadowColor: 'black',
    textShadowOffset: { width: 2, height: 1 },
    textShadowRadius: 2,
  },
});

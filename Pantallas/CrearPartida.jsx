import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, ImageBackground, Alert } from 'react-native';
import axios from 'axios';

export default function CrearPartida({navigation,route}) {
  // State variables to store game settings
  const [gameName, setGameName] = useState('');
  const [numPlayers, setNumPlayers] = useState('');
  const [password, setPassword] = useState('');


  const { token } = route.params;
  console.log('Token:', token);

  // Function to handle creating the game
  const handleCreateGame = async() => {
    // Validate required fields
    if (!gameName.trim() || !numPlayers.trim()) {
      Alert.alert('Error', 'Nombre de la partida y número de jugadores son obligatorios.');
      return;
    }
    else{
      try {

        const privacidad = password ? false : true;

        const response = await axios.post('http://192.168.43.182:4000/creaPartida',{headers : {'authorization': `${token}`}},{
          privacidad: privacidad,
          num: numPlayers,
          nombre: gameName,
          password: password,
        });
        
        // Handle game creation logic here
        console.log('Game Name:', gameName);
        console.log('Number of Players:', numPlayers);
        console.log('Password:', password);
        console.log('Privacidad:', privacidad);
        navigation.navigate('RiskMap');
        // Example: Send game data to backend API to create the game
  
        Alert.alert('Success', 'Partida creada exitosamente');
        navigation.navigate('RiskMap', { token: token });
      } catch (error) {
        console.error('Error:', error);
        Alert.alert('Error', 'Ha ocurrido un error al crear la partida');
      }
    }
  };

  // Function to handle changing the number of players
  const handleChangeNumPlayers = (value) => {
    const num = parseInt(value);
    if (num >= 2 && num <= 6) {
      setNumPlayers(num.toString());
    }
  };

  return (
    <ImageBackground source={require('../assets/guerra.jpg')} style={styles.backgroundImage}>
      <View style={styles.container}>
        <Text style={styles.title}>Crear Partida</Text>
        <TextInput
          style={styles.input}
          placeholder="Nombre de la partida *"
          value={gameName}
          onChangeText={setGameName}
          placeholderTextColor="rgba(0, 0, 0, 0.7)"
        />
        <View style={styles.inputContainer}>
          <TextInput
            style={[styles.input, styles.numPlayersInput]}
            placeholder="Jugadores *"
            keyboardType="numeric"
            value={numPlayers}
            onChangeText={handleChangeNumPlayers}
            placeholderTextColor="rgba(0, 0, 0, 0.7)"
          />
          <Text style={styles.selectedNumPlayers}>{numPlayers}</Text>
        </View>
        <TextInput
          style={styles.input}
          placeholder="Contraseña (opcional)"
          secureTextEntry={true}
          value={password}
          onChangeText={setPassword}
          placeholderTextColor="rgba(0, 0, 0, 0.7)"
        />
        <TouchableOpacity style={styles.button} onPress={handleCreateGame}>
          <Text style={styles.buttonText}>Crear Partida</Text>
        </TouchableOpacity>
      </View>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    color: 'black',
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  input: {
    width: '100%',
    height: 40,
    borderColor: 'white',
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 10,
    marginBottom: 10,
    color: 'black',
    backgroundColor: 'white',
    fontWeight: '600', // Adjust font weight here
  },
  numPlayersInput: {
    width: '22.5%', // Set width to 50% of the container
  },
  selectedNumPlayers: {
    fontSize: 16,
    fontWeight: 'bold',
    color: 'black',
    marginLeft: 10,
  },
  button: {
    backgroundColor: '#4CAF50',
    paddingVertical: 15,
    paddingHorizontal: 30,
    borderRadius: 8,
  },
  buttonText: {
    color: 'black',
    fontSize: 16,
    fontWeight: 'bold',
  },
  backgroundImage: {
    flex: 1,
    resizeMode: 'cover',
    justifyContent: 'center',
    alignItems: 'center',
  },
});
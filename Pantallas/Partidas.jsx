import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView, TouchableOpacity, TextInput, Button, StyleSheet, ImageBackground, ToastAndroid, Alert } from 'react-native';
import axios from 'axios';
import { IP } from '../config';
import { MaterialIcons } from '@expo/vector-icons';

const Partidas = ({ navigation, route }) => {

  const {userid, token } = route.params;
  const [partidas, setPartidasData] = useState([]);
  const [invitaciones, setInvitacionesData] = useState([]);



  const [selectedGame, setSelectedGame] = useState(null);
  const [joinGameId, setJoinGameId] = useState('');
  const [joinGamePassword, setJoinGamePassword] = useState('');
  const [createGameName, setCreateGameName] = useState('');
  const [createGamePassword, setCreateGamePassword] = useState('');
  const [createGamePlayers, setCreateGamePlayers] = useState('');
  const [inviteUsername, setInviteUsername] = useState('');
  const [inviteGameId, setInviteGameId] = useState('');
  const [inviteResult, setInviteResult] = useState('');

  const goToInicial = () => {
    navigation.navigate('Inicial', {userid : userid, token: token });
  };

  useEffect(() => {
    fetchPartidasData()
    fetchInvitations()
  }, [])

  const fetchPartidasData = async () => {
    try {
      const response = await axios.get(IP+'/partidas', { headers: { 'Authorization': token } });
      const partidasData = await Promise.all(response.data.map(async partida => {
        try {
          const partidaInfoResponse = await axios.get(`${IP}/partidas/partida/${partida._id}`, { headers: { 'Authorization': token } });
          return partidaInfoResponse.data;
        } catch (error) {
          console.error('Error fetching partida info:', error);
          return null; // Returning null for failed requests
        }
      }));
  
      // Filter out null values and flatten the array
      const flattenedPartidasData = partidasData.filter(partida => partida !== null).flat();
  
      setPartidasData(flattenedPartidasData);
    } catch (error) {
      console.error('Error fetching partida data:', error);
      Alert.alert('Error', 'Ha ocurrido un error al obtener las partidas. Por favor, inténtalo de nuevo más tarde.');
    }
  };
  

  const fetchInvitations = async () => {
    try {
      const response = await axios.get(IP+'/partidas/invitaciones', { headers: {'Authorization': `${token}` } });
      const invitacionesData = await Promise.all(response.data.Partidas.map(async partida => {
        try {
          if (partida != null) {
            const partidaInvitedInfoResponse = await axios.get(`${IP}/partidas/partida/${partida._id}`, { headers: { 'Authorization': token } });
            return partidaInvitedInfoResponse.data;
          }
          return null;
        } catch (error) {
          console.error('Error fetching partida info:', error);
          return null; // Returning null for failed requests
        }
      }));
  
      // Filter out null values and flatten the array
      const flattenedInvitacionesData = invitacionesData.filter(partida => partida !== null).flat();
  
      setInvitacionesData(flattenedInvitacionesData);
    } catch (error) {
      console.error('Error fetching invitations:', error);
      Alert.alert('Error', 'Ha ocurrido un error al obtener las invitaciones. Por favor, inténtalo de nuevo más tarde.');
    }
  };
  
  
  
  

  const handleCreateGame = async () => {
    if (!createGameName.trim() || !createGamePlayers.trim()) {
      Alert.alert('Error', 'Nombre de la partida y número de jugadores son obligatorios.');
      return;
    } else {
      try {
        const password = createGamePassword === '' ? null : createGamePassword;
        const response = await axios.post(IP+'/nuevaPartida', {
          nombre: createGameName,
          password: password,
          numJugadores: createGamePlayers,
        }, {
          headers: {
            'Authorization': token,
          }
        });

        if (response.status === 200) {
          console.log('Partida creada exitosamente');
          ToastAndroid.show('Partida creada exitosamente', ToastAndroid.SHORT)
          const id = response.data.idPartida

          navigation.navigate('Lobby', { userid, token }); // Navigate to Lobby component with partidaData and token
        } else {
          console.error('Error al crear la partida:', response.data.message);
          Alert.alert('Error', 'Ha ocurrido un error al crear la partida. Por favor, inténtalo de nuevo más tarde.');
        }
      } catch (error) {
        console.error('Error:', error);
        Alert.alert('Error', 'Ha ocurrido un error al crear la partida. Por favor, inténtalo de nuevo más tarde.');
      }
    }
  };

  const handleChangeNumPlayers = (value) => {
    const num = parseInt(value);
    if (num >= 2 && num <= 6) {
      setCreateGamePlayers(num.toString());
    }
  };

  const handleJoinGame = async () => {
    try {
      const response = await axios.put(`${IP}/nuevaPartida/join`, { idPartida: joinGameId, password: joinGamePassword }, {
        headers: {
          'Authorization': token,
        }
      });
      
      if (response.status === 200) {
        Alert.alert('Success', 'Unido correctamente');
        // Optionally, you can navigate to another screen or perform additional actions after successful joining
      } else {
        Alert.alert('Error', 'Error uniendo');
      }
    } catch (error) {
      console.error('Error:', error);
      Alert.alert('Error', 'Ha ocurrido un error al unirse a la partida. Por favor, inténtalo de nuevo más tarde.');
    }
  };

  
  const handleInvite = async () => {
    try {
      const response = await axios.put(`${IP}/nuevaPartida/invite`, { user: inviteUsername, idPartida: inviteGameId }, {
        headers: {
          'Authorization': token,
        }
      });
      
      if (response.status === 200) {
        Alert.alert('Success', 'Invitado correctamente');
        // Optionally, you can update the list of invited games after successful invitation
        // fetchInvitations();
      } else {
        Alert.alert('Error', 'Error invitando');
      }
    } catch (error) {
      console.error('Error:', error);
      Alert.alert('Error', 'Ha ocurrido un error al invitar al amigo. Por favor, inténtalo de nuevo más tarde.');
    }
  };

  const handlePartidaPress = (id) => {
    navigation.navigate('Partida', {userid: userid, id, token }); // Navigate to Partida component with id as a parameter
  };

  //-------------------------------------------------------------------------------------------------------------------------
  return (
    <ImageBackground source={require('../assets/guerra.jpg')} style={styles.backgroundImage} resizeMode="stretch">
       <TouchableOpacity
        style={{ marginTop:30, marginRight:600,width: 50,
        height: 50,
        alignItems:'center',
        justifyContent: 'center',
        borderRadius: 25, // Half of the width and height to make it a circle
        backgroundColor: 'silver'}}
        onPress={goToInicial}
      >
        <MaterialIcons name="arrow-back" size={30} color="black" />
      </TouchableOpacity>
      <View style={styles.container}>
        <ScrollView style={styles.leftSide}>
          <View>
            <Text style={[styles.title, styles.centeredTitle]}>Partidas Públicas</Text>
            <View style={styles.gamesList}>
              {partidas.map(game => (
                <TouchableOpacity 
                  key={game.nombre}
                  onPress={() => handlePartidaPress(game._id)}
                  style={[styles.gameRectangle, selectedGame && selectedGame._id === game._id && styles.selectedGameRectangle]}
                >
                  <Text style={styles.gameRectangleText}>{game.nombre} ({game.jugadores.length}/{game.maxJugadores})</Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>
          <View>
            <Text style={[styles.title, styles.centeredTitle]}>Invitaciones</Text>
            <View style={styles.gamesList}>
              {invitaciones.map(game => (
                <TouchableOpacity 
                  key={game.nombre}
                  onPress={() => handlePartidaPress(game._id)}
                  style={[styles.gameRectangle, selectedGame && selectedGame._id === game._id && styles.selectedGameRectangle]}
                >
                  <Text style={styles.gameRectangleText}>{game.nombre} ({game.jugadores.length}/{game.maxJugadores})</Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>
          
        </ScrollView>
        <ScrollView style={styles.rightSide}>
          <View style={styles.rightContent}>
            <Text style={[styles.title, styles.centeredTitle]}>Unirse a Partida</Text>
            <TextInput
              style={styles.input}
              placeholder="ID de la partida"
              value={joinGameId}
              onChangeText={setJoinGameId}
              placeholderTextColor="rgba(0, 0, 0, 0.7)"
            />
            <TextInput
              style={styles.input}
              placeholder="Contraseña"
              value={joinGamePassword}
              onChangeText={setJoinGamePassword}
              placeholderTextColor="rgba(0, 0, 0, 0.7)"
            />
            <TouchableOpacity style={styles.button} onPress={handleJoinGame}>
              <Text style={styles.buttonText}>Unirse</Text>
            </TouchableOpacity>
            <Text style={[styles.title, styles.centeredTitle]}>Crear Partida</Text>
            <TextInput
              style={styles.input}
              placeholder="Nombre de la partida *"
              value={createGameName}
              onChangeText={setCreateGameName}
              placeholderTextColor="rgba(0, 0, 0, 0.7)"
            />
            <View style={styles.inputContainer}>
              <TextInput
                style={[styles.input, styles.numPlayersInput]}
                placeholder="Jugadores *"
                keyboardType="numeric"
                onChangeText={handleChangeNumPlayers}
                placeholderTextColor="rgba(0, 0, 0, 0.7)"
              />
              <Text style={styles.selectedNumPlayers}>{createGamePlayers}</Text>
            </View>
            <TextInput
              style={styles.input}
              placeholder="Contraseña (opcional)"
              secureTextEntry={true}
              value={createGamePassword}
              onChangeText={setCreateGamePassword}
              placeholderTextColor="rgba(0, 0, 0, 0.7)"
            />
            <TouchableOpacity style={styles.button} onPress={handleCreateGame}>
              <Text style={styles.buttonText}>Crear Partida</Text>
            </TouchableOpacity>
            <Text style={[styles.title, styles.centeredTitle]}>Invitar a un amigo</Text>
            <TextInput
                style={styles.input}
                placeholder="Nombre de usuario"
                value={inviteUsername}
                onChangeText={setInviteUsername}
                placeholderTextColor="rgba(0, 0, 0, 0.7)"
            />
            <TextInput
                style={styles.input}
                placeholder="ID de la partida"
                value={inviteGameId}
                onChangeText={setInviteGameId}
                placeholderTextColor="rgba(0, 0, 0, 0.7)"
            />
            <TouchableOpacity style={styles.button} onPress={handleInvite}>
                <Text style={styles.buttonText}>Invitar</Text>
            </TouchableOpacity>
          </View>
          
          
        </ScrollView>
      </View>
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    top:20,
    flexDirection: 'row',
  },
  leftSide: {
    flex: 1,
    paddingRight: 10,
  },
  rightSide: {
    flex: 1,
    paddingLeft: 10,
  },
  rightContent: {
    paddingBottom: 20,
  },
  centeredTitle: {
    textAlign: 'center',
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 10,
    marginLeft:5,
    color: 'black',
    backgroundColor:'gray',
    width: 300, // Adjust this value to your desired width
    
  },
  gamesList: {
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 10,
  },
  gameRectangle: {
    width: 120,
    height: 60,
    backgroundColor: '#f0f0f0',
    justifyContent: 'center',
    alignItems: 'center',
    marginVertical: 5,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#ccc',
  },
  selectedGameRectangle: {
    backgroundColor: '#e0e0e0',
  },
  gameRectangleText: {
    fontSize: 14,
    fontWeight: 'bold',
  },
  input: {
    width: '70%',
    height: 40,
    borderColor: 'white',
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 10,
    marginBottom: 10,
    color: 'black',
    backgroundColor: 'white',
    fontWeight: '600', 
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  numPlayersInput: {
    width: '70%',
  },
  selectedNumPlayers: {
    fontSize: 16,
    fontWeight: 'bold',
    color: 'black',
    marginLeft: 10,
  },
  button: {
    width:170,
    backgroundColor: '#4CAF50',
    paddingVertical: 15,
    paddingHorizontal: 30,
    borderRadius: 8,
    marginBottom:30,
  },
  buttonText: {
    color: 'black',
    fontSize: 16,
    fontWeight: 'bold',
  },
  invitedGame: {
    backgroundColor: '#007bff',
    padding: 10,
    width:150,
    marginBottom: 5,
    borderRadius: 10,
  },
  invitedGameText: {
    color: '#fff',
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

export default Partidas;

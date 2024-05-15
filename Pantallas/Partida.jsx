import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Alert, TouchableOpacity, ImageBackground } from 'react-native';
import axios from 'axios';
import { IP } from '../config';
import { MaterialIcons } from '@expo/vector-icons';

const Partida = ({ navigation, route }) => {
  const { id, token } = route.params;
  const [partidaData, setPartidaData] = useState(null);

  useEffect(() => {
    fetchPartidaData();
  }, []);

  const goToInicial = () => {
    navigation.navigate('Partidas', {id:id, token: token });
  };

  const fetchPartidaData = async () => {
    try {
      const response = await axios.get(`${IP}/partidas/partida/${id}`, { headers: { 'Authorization': token } });
      setPartidaData(response.data);
    } catch (error) {
      console.error('Error fetching partida data:', error);
      Alert.alert('Error', 'Ha ocurrido un error al obtener los datos de la partida. Por favor, inténtalo de nuevo más tarde.');
    }
  };

  const handleJoinPartida = async () => {
    try {
      const response = await axios.put(`${IP}/nuevaPartida/join`, { idPartida: id, password: null }, {
        headers: {
          'Authorization': token,
        }
      });

      if (response.status === 200) {
        Alert.alert('Success', 'Unido correctamente');
        navigation.navigate('Lobby', { id, token }); // Navigate to Lobby component with partidaData and token
      } else {
        Alert.alert('Error', 'Error uniendo');
      }
    } catch (error) {
      console.error('Error:', error);
      Alert.alert('Error', 'Ha ocurrido un error al unirse a la partida. Por favor, inténtalo de nuevo más tarde.');
    }
  };

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
        {partidaData ? (
          <View>
            <Text style={styles.title}>Nombre de la partida: {partidaData.nombre}</Text>
            <Text style={styles.subTitle}>Nombre del chat: {partidaData.chat.nombreChat}</Text>
            <Text style={styles.subTitle}>Número máximo de jugadores: {partidaData.maxJugadores}</Text>
            <Text style={styles.subTitle}>Jugadores:</Text>
            <View style={styles.jugadoresContainer}>
              {partidaData.jugadores.map(jugador => (
                <Text key={jugador._id} style={styles.jugador}>-{jugador.usuario}</Text>
              ))}
            </View>
            {/* Render other details of the partida */}
            <TouchableOpacity style={styles.button} onPress={handleJoinPartida}>
              <Text style={styles.buttonText}>Unirse a Partida</Text>
            </TouchableOpacity>
          </View>
        ) : (
          <Text>Loading...</Text>
        )}
      </View>
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    fontSize: 24,
    marginBottom: 10,
    color: 'white',
    fontWeight: 'bold',
    textTransform: 'uppercase',
    textShadowColor: 'black',
    textShadowOffset: { width: 2, height: 1 },
    textShadowRadius: 2,
    textAlign:'center',
  },
  subTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 5,
    color: 'white',
    textTransform: 'uppercase',
    textShadowColor: 'black',
    textShadowOffset: { width: 2, height: 1 },
    textShadowRadius: 2,
  },
  jugadoresContainer: {
    marginTop: 5,
  },
  jugador: {
    fontSize: 16,
    marginBottom: 3,

    color: 'white',
    fontWeight: 'bold',
    textTransform: 'uppercase',
    textShadowColor: 'black',
    textShadowOffset: { width: 2, height: 1 },
    textShadowRadius: 2,
    textAlign:'center',
  },
  button: {
    backgroundColor: '#DB4437',
    paddingVertical: 15,
    paddingHorizontal: 30,
    borderRadius: 8,
    width:190,
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
    alignSelf: 'center',
  },
  buttonText: {
    color: 'white',
    fontSize: 14,
    fontWeight: 'bold',
    textTransform: 'uppercase',
    textShadowColor: 'black',
    textShadowOffset: { width: 2, height: 1 },
    textShadowRadius: 2,
  },
  backgroundImage: {
    flex: 1,
    resizeMode: 'cover',
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default Partida;

import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Alert, TouchableOpacity } from 'react-native';
import axios from 'axios';
import { IP } from '../config';

const Partida = ({ navigation, route }) => {
  const { id, token } = route.params;
  const [partidaData, setPartidaData] = useState(null);

  useEffect(() => {
    fetchPartidaData();
  }, []);

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
    <View style={styles.container}>
      {partidaData ? (
        <View>
          <Text style={styles.title}>Nombre de la partida: {partidaData.nombre}</Text>
          <Text style={styles.subTitle}>Nombre del chat: {partidaData.chat.nombreChat}</Text>
          <Text style={styles.subTitle}>Número máximo de jugadores: {partidaData.maxJugadores}</Text>
          <Text style={styles.subTitle}>Jugadores:</Text>
          <View style={styles.jugadoresContainer}>
            {partidaData.jugadores.map(jugador => (
              <Text key={jugador._id} style={styles.jugador}>{jugador.usuario}</Text>
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
    fontWeight: 'bold',
    marginBottom: 10,
  },
  subTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  jugadoresContainer: {
    marginTop: 5,
  },
  jugador: {
    fontSize: 16,
    marginBottom: 3,
  },
  button: {
    marginTop: 20,
    backgroundColor: '#4CAF50',
    paddingVertical: 15,
    paddingHorizontal: 30,
    borderRadius: 8,
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default Partida;

import React from 'react';
import { View, TouchableOpacity, Text, StyleSheet, ImageBackground } from 'react-native';
import { IP } from '../config';

export default function Inicial({ navigation,route }) {

  const { id,token } = route.params;
  console.log('Token:', token);
  const goToCrearPartida = () => {
    // Navigate to "Crear Partida" screen
    navigation.navigate('Lobby', { id:id,token: token });
  };

  const goToRanking = () => {
    // Navigate to "Ranking" screen
    navigation.navigate('Ranking', { token: token });
  };

  const goToTienda = () => {
    // Navigate to "Tienda" screen
    navigation.navigate('Tienda', { token: token });
  };

  const goToPerfil = () => {
    // Navigate to "Perfil" screen
    navigation.navigate('Perfil', { id:id,token: token });
  };

  const goToFindPlayer = () => {
    // Navigate to "Perfil" screen
    navigation.navigate('BuscarJugador', { token: token });
  };

  const goToFindSol= () => {
    // Navigate to "Perfil" screen
    navigation.navigate('MisSolicitudes', { token: token });
  };

  const goToMap = () => {
    // Navigate to "Perfil" screen
    navigation.navigate('RiskMap', { token: token });
  }

  return (
    <ImageBackground source={require('../assets/guerra.jpg')} style={styles.backgroundImage}>
      <View style={styles.container}>
        <TouchableOpacity style={styles.button} onPress={goToCrearPartida}>
          <Text style={styles.buttonText}>Lobby</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.button} onPress={goToRanking}>
          <Text style={styles.buttonText}>Ranking</Text>
        </TouchableOpacity>
        <TouchableOpacity style={[styles.button, styles.tiendaButton]} onPress={goToTienda}>
          <Text style={styles.buttonText}>Tienda</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.button} onPress={goToPerfil}>
          <Text style={styles.buttonText}>Perfil</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.button} onPress={goToFindPlayer}>
          <Text style={styles.buttonText}>Buscar Jugador</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.button} onPress={goToFindSol}>
          <Text style={styles.buttonText}>Buscar Solicitudes</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.button} onPress={goToMap}>
          <Text style={styles.buttonText}>MapaXD</Text>
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
  },
  backgroundImage: {
    flex: 1,
    resizeMode: 'cover',
    justifyContent: 'center',
  },
  button: {
    backgroundColor: '#4CAF50',
    paddingVertical: 8, // Reduced padding
    paddingHorizontal: 30,
    borderRadius: 8,
    marginBottom: 10, // Reduced margin bottom
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  tiendaButton: {
    marginTop: 1, // Increased margin top
  },
});

import React from 'react';
import { View, Button, StyleSheet, ImageBackground } from 'react-native';

export default function Inicial({ navigation }) {
  const goToCrearPartida = () => {
    // Navigate to "Crear Partida" screen
    navigation.navigate('CrearPartida');
  };

  const goToRanking = () => {
    // Navigate to "Ranking" screen
    navigation.navigate('Ranking');
  };

  const goToTienda = () => {
    // Navigate to "Tienda" screen
    navigation.navigate('Tienda');
  };

  const goToPerfil = () => {
    // Navigate to "Perfil" screen
    navigation.navigate('Perfil');
  };

  return (
    <ImageBackground source={require('../assets/guerra.jpg')} style={styles.backgroundImage}>
      <View style={styles.container}>
        <Button title="Crear Partida" onPress={goToCrearPartida} />
        <Button title="Ranking" onPress={goToRanking} />
        <Button title="Tienda" onPress={goToTienda} />
        <Button title="Perfil" onPress={goToPerfil} />
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
});

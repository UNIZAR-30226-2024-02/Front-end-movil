import React from 'react';
import { View, TouchableOpacity, Text, StyleSheet, ImageBackground } from 'react-native';
import { FontAwesome } from '@expo/vector-icons'; // Import FontAwesome from expo/vector-icons
import { IP } from '../config';

export default function Inicial({ navigation, route }) {
  const { id, token } = route.params;

  const goToFindPlayer = () => {
    // Navigate to "BuscarJugador" screen
    navigation.navigate('BuscarJugador', { token: token });
  };

  const goToFindSol = () => {
    // Navigate to "MisSolicitudes" screen
    navigation.navigate('MisSolicitudes', { token: token });
  };

  return (
    <ImageBackground source={require('../assets/guerra.jpg')} style={styles.backgroundImage} resizeMode="stretch">
      <View style={styles.container}>
        <View style={styles.row}>
          <TouchableOpacity style={styles.button} onPress={goToFindPlayer}>
            <FontAwesome name="user" size={30} color="white" style={styles.icon} />
            <Text style={styles.buttonText}>Buscar Jugador</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.button} onPress={goToFindSol}>
            <FontAwesome name="bell" size={24} color="white" style={styles.icon} />
            <Text style={styles.buttonText}>Buscar Solicitudes</Text>
          </TouchableOpacity>
        </View>
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
  row: {
    flexDirection: 'row', // Arrange children horizontally
    justifyContent: 'center', // Center children horizontally
    marginBottom: 20,
  },
  backgroundImage: {
    flex: 1,
    resizeMode: 'cover',
    justifyContent: 'center',
  },
  button: {
    backgroundColor: 'olive',
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    borderRadius: 12,
    marginBottom: 0,
    marginRight: 10,
    marginLeft: 50,
    marginRight: 50,
    width: 200,
    height: 80,
    justifyContent: 'center',
    alignItems: 'center',
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 3,
    },
    shadowOpacity: 0.5,
    shadowRadius: 4,
    elevation: 5,
    // Adding larger darker bottom part
    borderBottomColor: 'rgba(0,0,0,0.2)',
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
    marginLeft: 10, // Add some spacing between icon and text
  },
  icon: {
    marginRight: 10, // Add some spacing between icon and text
  },
});

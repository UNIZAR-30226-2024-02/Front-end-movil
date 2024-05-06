import React from 'react';
import { View, Text, TouchableOpacity,Image, StyleSheet, ImageBackground } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { IP } from '../config';

export default function Home() {
  const navigation = useNavigation();

  const goToLogin = () => {
    navigation.navigate('Login');
  };

  const goToRegister = () => {
    navigation.navigate('Register');
  };

  const goToSockets = () => {
    navigation.navigate('SocketsTest');
  };

  return (
    <ImageBackground source={require('../assets/guerra.jpg')} style={styles.backgroundImage} resizeMode="stretch">
      <View style={styles.container}>
        <View style={styles.titleContainer}>
          <Text style={styles.title}>EL RISKILLO</Text>
        </View>
        <View style={styles.imageContainer}>
          <Image source={require('../assets/LogoConTrasparencia.png')} style={styles.image} />
        </View>
        <View style={styles.buttonRow}>
          <TouchableOpacity style={styles.button} onPress={goToRegister}>
            <Text style={styles.buttonText}>Registrarse</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.button} onPress={goToLogin}>
            <Text style={styles.buttonText}>Iniciar Sesión</Text>
          </TouchableOpacity>
            

          <TouchableOpacity style={styles.button} onPress={goToSockets}>
            <Text style={styles.buttonText}>Test Sockets</Text>
          </TouchableOpacity>
        </View>
      </View>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  backgroundImage: {
    flex: 1,
    width: '100%',
    resizeMode: 'cover',
    justifyContent: 'flex-end',
    alignItems: 'center',
  },
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'flex-end',
  },
  titleContainer: {
    marginBottom: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: 'white',
    textTransform: 'uppercase',
    textShadowColor: 'black',
    textShadowOffset: { width: 2, height: 1 },
    textShadowRadius: 2,
  },
  imageContainer: {
    marginBottom: 20,
  },
  image: {
    width: 200,
    height: 200,
    resizeMode: 'cover',
  },
  buttonRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  button: {
    backgroundColor: '#DB4437',
    paddingVertical: 15,
    paddingHorizontal: 40,
    borderRadius: 25,
    width: 200,
    justifyContent: 'center',
    alignItems: 'center',
    overflow: 'hidden',
    // Adding 3D effect
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.5,
    shadowRadius: 4,
    elevation: 5,
    // Adding larger darker bottom part
    borderBottomColor: 'rgba(0,0,0,0.3)',
    borderBottomWidth: 5,
    marginRight: 10, // Agregar margen a la derecha
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
});

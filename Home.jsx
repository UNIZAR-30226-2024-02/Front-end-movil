import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ImageBackground } from 'react-native'; // Import ImageBackground
import { useNavigation } from '@react-navigation/native';

export default function Home() {
  const navigation = useNavigation();

  const goToLogin = () => {
    navigation.navigate('Login');
  };

  const goToRegister = () => {
    navigation.navigate('Register');
  };

  return (
    <ImageBackground source={require('../assets/guerra.jpg')} style={styles.backgroundImage} >
      <View style={styles.container}>
        <TouchableOpacity style={styles.button} onPress={goToLogin}>
          <Text style={styles.buttonText}>Login</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.button} onPress={goToRegister}>
          <Text style={styles.buttonText}>Register</Text>
        </TouchableOpacity>
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
    justifyContent: 'center',
  },
  button: {
    backgroundColor: '#4CAF50',
    paddingVertical: 15,
    paddingHorizontal: 30,
    borderRadius: 8,
    marginBottom: 20,
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

import React from 'react';
import { View, Text, StyleSheet, ScrollView, ImageBackground, TouchableOpacity } from 'react-native';

export default function Perfil({ navigation,route }) {

  const { token } = route.params;
  const goToMyData = () => {
    navigation.navigate('MyChats', { token: token });
  };

  const goToMySkins = () => {
    navigation.navigate('MySkins', { token: token });
  };

  const goToMyHistory = () => {
    navigation.navigate('MyHistory');
  };

  const goToMyFriends = () => {
    navigation.navigate('MisAmigos', { token: token });
  };

  return (
    <ImageBackground source={require('../assets/guerra.jpg')} style={styles.backgroundImage}>
      <ScrollView contentContainerStyle={styles.container}>
        <TouchableOpacity style={styles.button} onPress={goToMyData}>
          <Text style={styles.buttonText}>Mis Chats</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.button} onPress={goToMySkins}>
          <Text style={styles.buttonText}>Mis Skins</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.button} onPress={goToMyHistory}>
          <Text style={styles.buttonText}>Mi Historial</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.button} onPress={goToMyFriends}>
          <Text style={styles.buttonText}>Mis Amigos</Text>
        </TouchableOpacity>
      </ScrollView>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 20,
  },
  button: {
    backgroundColor: 'rgba(255, 255, 255, 0.8)',
    borderRadius: 10,
    padding: 20,
    marginBottom: 20,
    width: '90%',
  },
  buttonText: {
    fontSize: 20,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  backgroundImage: {
    flex: 1,
    resizeMode: 'cover',
    justifyContent: 'center',
  },
});

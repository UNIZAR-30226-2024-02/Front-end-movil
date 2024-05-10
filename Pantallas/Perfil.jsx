import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, ImageBackground, TouchableOpacity } from 'react-native';
import { FontAwesome } from '@expo/vector-icons'; // Import FontAwesome from expo/vector-icons
import axios from 'axios';
import { IP } from '../config';

export default function Perfil({ navigation,route }) {

  const { token } = route.params;
  const [perfil, setPerfil] = useState(null);

  const fetchData = async () => {
    try {
      const response = await axios.get(
        IP+'/perfil',
        { headers: { Authorization: token } }
      );
      console.log(response.data.nombre)
        setPerfil(response.data);
    } catch (error) {
      console.error('Error fetching skins:', error);
    }
  };


  useEffect(() => {
   
    fetchData();
  }, [token]);

  
  const goToMySkins = () => {
    navigation.navigate('MySkins', { token: token });
  };

  const goToMyHistory = () => {
    navigation.navigate('MyHistory', { token: token });
  };

  const goToMyFriends = () => {
    navigation.navigate('MisAmigos', { token: token });
  };

  return (
    <ImageBackground source={require('../assets/guerra.jpg')} style={styles.backgroundImage}  resizeMode="stretch">
      <Text style={styles.title}>Perfil de {perfil ? perfil.nombre : ''} </Text>
      
      <ScrollView contentContainerStyle={styles.container}>
        <TouchableOpacity style={styles.skinsbutton} onPress={goToMySkins}>
        <FontAwesome name="paint-brush" size={24} color="white" />
          <Text style={styles.buttonText}>Mis Skins</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.historialbutton} onPress={goToMyHistory}>
        <FontAwesome name="history" size={24} color="white" />
          <Text style={styles.buttonText}>Mi Historial</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.amigosbutton} onPress={goToMyFriends}>
        <FontAwesome name="users" size={24} color="white" />
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
  title: {
    fontWeight: 'bold',
    color: 'white',
    top:50,
    left:250,
    fontSize: 25,
    fontWeight: 'bold',
    textTransform: 'uppercase',
    // Adding text shadow to create black outline
    textShadowColor: 'black',
    textShadowOffset: { width: 2, height: 1 },
    textShadowRadius: 2,
  },
  skinImage: {
    width: '40%',
    aspectRatio: 1,
    borderRadius: 8,
  },
  skinsbutton: {
    backgroundColor: '#DB4437',
    paddingVertical: 11,
    paddingHorizontal: 40,
    borderRadius: 12,
    marginBottom: 0,
    marginRight: 10,
    position: 'absolute',
    top:200,
    left:50,
    justifyContent: 'center',
    alignItems: 'center',
    overflow: 'hidden',
    width:200,
    height:80,
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
  amigosbutton: {
    backgroundColor: '#DB4437',
    paddingVertical: 11,
    paddingHorizontal: 40,
    borderRadius: 12,
    marginBottom: 0,
    marginRight: 10,
    position: 'absolute',
    top:200,
    left:500,
    justifyContent: 'center',
    alignItems: 'center',
    overflow: 'hidden',
    width:200,
    height:80,
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
  historialbutton: {
    backgroundColor: '#DB4437',
    paddingVertical: 11,
    paddingHorizontal: 40,
    borderRadius: 12,
    marginBottom: 0,
    marginRight: 10,
    position: 'absolute',
    top:200,
    left:270,
    justifyContent: 'center',
    alignItems: 'center',
    overflow: 'hidden',
    width:200,
    height:80,
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
  },
  backgroundImage: {
    flex: 1,
    resizeMode: 'cover',
    justifyContent: 'center',
  },
});

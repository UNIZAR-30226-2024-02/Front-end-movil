import React from 'react';
import { View, TouchableOpacity, Text, StyleSheet, ImageBackground } from 'react-native';
import { FontAwesome } from '@expo/vector-icons'; // Import FontAwesome from expo/vector-icons
import { IP } from '../config';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function Inicial({ navigation, route }) {
  const { id, token } = route.params;

  const goToCrearPartida = () => {
    // Navigate to "Crear Partida" screen
    navigation.navigate('Partidas', { id: id, token: token });
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
    navigation.navigate('Perfil', { id: id, token: token });
  };


  const goToMap = async () => {
    // Navigate to "Perfil" screen
    let id ="663ba1f8598d1be7784223ed"
    try {
      const response = await axios.get(`${IP}/partidas/partida/${id}`, { headers: { 'Authorization': token } })
      let username = await AsyncStorage.getItem('username')
      socket.emit('joinChat', response.data.chat._id)
      socket.emit('joinGame', { gameId: response.data._id, user: username })
      let partidaData = response.data
      navigation.navigate('RiskMap', { token: token, partida: partidaData, whoami: username});
  } catch (error) {
      console.error('Error fetching partida data:', error)
      Alert.alert('Error', 'Ha ocurrido un error al obtener los datos de la partida. Por favor, inténtalo de nuevo más tarde.')
  }
  //
  //navigation.navigate('RiskMap', { token: token, partida: partidaData});
  }

  const goToChats = () => {
    // Navigate to "Chats" screen
    navigation.navigate('MyChats', { token: token });
  };

  const goToAmigos = () => {
    // Navigate to "Chats" screen
    navigation.navigate('MisAmigos', { token: token });
  };

  const goToAmistad = () => {
    // Navigate to "Chats" screen
    navigation.navigate('Amistad', { token: token });
  };


  return (
    <ImageBackground source={require('../assets/guerra.jpg')} style={styles.backgroundImage} resizeMode="stretch">
      <View style={styles.container}>
          <TouchableOpacity style={styles.Partidasbutton} onPress={goToCrearPartida}>
          <FontAwesome name="gamepad" size={24} color="white" />
            <Text style={styles.PartidasbuttonText}>Partidas</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.Rankingbutton} onPress={goToRanking}>
          <FontAwesome name="trophy" size={24} color="white" />
            <Text style={styles.RankingbuttonText}>Ranking</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.Perfilbutton} onPress={goToPerfil}>
          <FontAwesome name="user" size={24} color="white" />
            <Text style={styles.PerfilbuttonText}>Perfil</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.Mapabutton} onPress={goToMap}>
            <Text style={styles.AmistadbuttonText}>MapaXD</Text>
          </TouchableOpacity>
        <TouchableOpacity style={styles.Amistadbutton} onPress={goToAmistad}>
        <FontAwesome name="user-plus" size={24} color="white" />
            <Text style={styles.AmistadbuttonText}>Solicitudes</Text>
          </TouchableOpacity>
        {/* Chat button */}
        <TouchableOpacity style={styles.chatButton} onPress={goToChats}>
          <FontAwesome name="comments" size={24} color="white" />
          <Text style={styles.chatButtonText}>Chat</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.amigosButton} onPress={goToAmigos}>
          <FontAwesome name="users" size={24} color="white" />
          <Text style={styles.amigosButtonText}>Amigos</Text>
        </TouchableOpacity>
        {/* Tienda button */}
        <TouchableOpacity style={styles.tiendaButton} onPress={goToTienda}>
          <FontAwesome name="shopping-basket" size={24} color="white" />
          <Text style={styles.tiendaButtonText}>Tienda</Text>
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
  row: {
    flexDirection: 'row',
    marginBottom: 20,
  },
  backgroundImage: {
    flex: 1,
    resizeMode: 'cover',
    justifyContent: 'center',
  },
  Partidasbutton: {
    backgroundColor: '#DB4437',
    paddingVertical: 11,
    paddingHorizontal: 40,
    borderRadius: 12,
    marginBottom: 0,
    marginRight: 10,
    position: 'absolute',
    top:70,
    left:150,
    justifyContent: 'center',
    alignItems: 'center',
    overflow: 'hidden',
    width:160,
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
  PartidasbuttonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
    textTransform: 'uppercase',
    // Adding text shadow to create black outline
    textShadowColor: 'black',
    textShadowOffset: { width: 2, height: 1 },
    textShadowRadius: 2,
  },
  Rankingbutton: {
    backgroundColor: '#DB4437',
    paddingVertical: 11,
    paddingHorizontal: 40,
    borderRadius: 12,
    marginBottom: 0,
    width:160,
    height:80,
    position: 'absolute',
    top:180,
    left:150,
    marginRight: 10,
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
  RankingbuttonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
    textTransform: 'uppercase',
    // Adding text shadow to create black outline
    textShadowColor: 'black',
    textShadowOffset: { width: 2, height: 1 },
    textShadowRadius: 2,
  },
  Perfilbutton: {
    backgroundColor: '#DB4437',
    paddingVertical: 11,
    paddingHorizontal: 40,
    borderRadius: 12,
    marginBottom: 0,
    marginRight: 10,
    position: 'absolute',
    top:70,
    width:160,
    height:80,
    right:200,
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
  PerfilbuttonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
    textTransform: 'uppercase',
    // Adding text shadow to create black outline
    textShadowColor: 'black',
    textShadowOffset: { width: 2, height: 1 },
    textShadowRadius: 2,
  },
  Amistadbutton: {
    backgroundColor: '#DB4437',
    paddingVertical: 11,
    paddingHorizontal: 40,
    borderRadius: 12,
    marginBottom: 0,
    width:180,
    height:80,
    position:'absolute',
    top:180,
    right:180,
    marginRight: 10,
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
  Mapabutton: {
    backgroundColor: '#DB4437',
    paddingVertical: 11,
    paddingHorizontal: 40,
    borderRadius: 12,
    marginBottom: 0,
    position:'absolute',
    top:300,
    right:250,
    marginRight: 10,
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
  AmistadbuttonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
    textTransform: 'uppercase',
    // Adding text shadow to create black outline
    textShadowColor: 'black',
    textShadowOffset: { width: 2, height: 1 },
    textShadowRadius: 2,
  },
  // Chat button styles
  chatButton: {
    position: 'absolute',
    bottom: 30,
    right: 30,
    backgroundColor: '#007bff',
    borderRadius: 80,
    width: 80,
    height: 80,
    justifyContent: 'center',
    alignItems: 'center',
    
  },
  chatButtonText: {
    color: 'white',
    fontWeight: 'bold',
    marginLeft: 0,
    fontWeight: 'bold',
    textTransform: 'uppercase',
    // Adding text shadow to create black outline
    textShadowColor: 'black',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 1,
  },
  // amigos button styles
  amigosButton: {
    position: 'absolute',
    bottom: 30,
    left: 30,
    backgroundColor: '#007bff',
    borderRadius: 80,
    width: 80,
    height: 80,
    justifyContent: 'center',
    alignItems: 'center',
    
  },
  amigosButtonText: {
    color: 'white',
    fontWeight: 'bold',
    marginLeft: 0,
    textTransform: 'uppercase',
    // Adding text shadow to create black outline
    textShadowColor: 'black',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 1,
  },
  // Tienda button styles
  tiendaButton: {
    position: 'absolute',
    top: 100,
    right: 20,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#007bff',
    borderRadius: 25,
    paddingVertical: 8,
    paddingHorizontal: 10,
    // Adding 3D effect
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
  tiendaButtonText: {
    color: 'white',
    fontWeight: 'bold',
    marginLeft: 5,
    textTransform: 'uppercase',
    // Adding text shadow to create black outline
    textShadowColor: 'black',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 1,
  },
});

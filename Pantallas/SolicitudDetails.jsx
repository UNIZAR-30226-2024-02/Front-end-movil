import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity,ImageBackground, Alert } from 'react-native';
import axios from 'axios';
import { IP } from '../config';

export default function SolicitudDetails({ navigation,route }) {
  const {solicitante,token} = route.params;

  const handleConfirmaFriend = async () => {
    // Implementación para confirmar amistad
    try {
      const response = await axios.post(
        IP+'/amistad',
        { idDestino: solicitante },
        { headers: { Authorization: token } }
      );
      Alert.alert('Sucess.La petición se ha aceptado,ahora sois amigos.');
      console.log('Response:', response.data);
      navigation.navigate('MisSolicitudes', { token: token });
    } catch (error) {
      console.error('Error friend:', error);
    }
  };

  return (
    <ImageBackground source={require('../assets/guerra.jpg')} style={styles.background}>
      <View style={styles.container}>
        <View style={styles.content}>
          <View style={styles.detailsContainer}>
            <Text style={styles.playerName}>Solicitud de amistad de {solicitante}</Text>
            <Text style={styles.playerDescription}>{solicitante} te ha mandado una solicitud de amistad.¿Deseas aceptarla?</Text>
            <View style={styles.containerButton}>
              <TouchableOpacity style={styles.addButton} onPress={handleConfirmaFriend}>
                <Text style={styles.buttonText}>Confirmar Amistad</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </View>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 20,
    paddingVertical: 50,
    
  },
  content: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  detailsContainer: {
    flex: 1,
    marginLeft: 20,
  },
  playerName: {
    color: 'white',
    fontSize: 30,
    fontWeight: 'bold',
    textShadowColor: 'black',
    textShadowOffset: { width: 2, height: 1 },
    textShadowRadius: 2,
    textAlign:'center',
    
  },
  playerDescription: {
    top:30,
    fontSize: 18,
    textAlign: 'center',
    marginBottom: 20,
    paddingBottom: 130, 
    color: 'white',
    fontWeight: 'bold',
    textShadowColor: 'black',
    textShadowOffset: { width: 2, height: 1 },
    textShadowRadius: 2,
  },
  containerButton: {
    alignItems: 'center',
    marginBottom: 20, // Espacio adicional entre el contenido y el botón
    flexDirection: 'row',  // Alinea los elementos en fila
    justifyContent: 'center',
  },
  addButton: {
    backgroundColor: '#DB4437',
    paddingVertical: 11,
    paddingHorizontal: 40,
    borderRadius: 12,
    marginBottom: 0,
    marginRight: 10,
    alignItems: 'center',
    justifyContent: 'center',
    alignItems: 'center',
    overflow: 'hidden',
    width:250,
    height:80,
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
  },
  buttonText: {
    color: 'white',
    fontSize: 15,
    fontWeight: 'bold',
    textTransform: 'uppercase',
    // Adding text shadow to create black outline
    textShadowColor: 'black',
    textShadowOffset: { width: 2, height: 1 },
    textShadowRadius: 2,
  },
  friendMessage: {
    marginTop: 10,
    color: '#000000',
    textAlign: 'center',
    fontSize: 16,
    fontWeight: 'bold',
  },
  background: {
    flex: 1,
    resizeMode: 'cover',
    justifyContent: 'center',
  },
});
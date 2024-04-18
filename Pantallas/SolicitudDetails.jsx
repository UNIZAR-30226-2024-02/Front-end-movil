import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity,ImageBackground } from 'react-native';
import axios from 'axios';

export default function SolicitudDetails({ route }) {
  const {solicitante,token} = route.params;
  console.log('Token:', token); // Access token
  console.log('amigo:', solicitante)
  
  const handleConfirmaFriend = async () => {
    // Implementación para confirmar amistad
    try {
      const response = await axios.post(
        'http://192.168.32.96:4000/amistad',
        { idDestino: solicitante },
        { headers: { Authorization: token } }
      );
      console.log('Response:', response.data);
    } catch (error) {
      console.error('Error friend:', error);
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.content}>
        <View style={styles.detailsContainer}>
          <Text style={styles.playerName}>{solicitante}</Text>
          <Text style={styles.playerDescription}>a</Text>
          <View style={styles.containerButton}>
            <TouchableOpacity style={styles.addButton} onPress={handleConfirmaFriend}>
              <Text style={styles.buttonText}>Confirmar Amistad</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </View>
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
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 10,
    
  },
  playerDescription: {
    top:1,
    fontSize: 18,
    textAlign: 'center',
    marginBottom: 20,
    paddingBottom: 150, // Add paddingTop to give space for the skin name
  },
  containerButton: {
    alignItems: 'center',
    marginBottom: 20, // Espacio adicional entre el contenido y el botón
    flexDirection: 'row',  // Alinea los elementos en fila
    justifyContent: 'space-between',
  },
  addButton: {
    backgroundColor: '#27ae60',
    paddingVertical: 15,  // Reducido el padding vertical
    paddingHorizontal: 20,
    alignItems: 'center',
    borderRadius: 5,
  },
  buttonText: {
    color: '#fff',
    fontWeight: 'bold',
    textAlign: 'center',
    fontSize: 18,
  },
  friendMessage: {
    marginTop: 10,
    color: '#000000',
    textAlign: 'center',
    fontSize: 16,
    fontWeight: 'bold',
  },
});
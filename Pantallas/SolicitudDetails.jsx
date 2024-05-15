import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity,ImageBackground, Alert } from 'react-native';
import axios from 'axios';
import { IP } from '../config';
import { MaterialIcons } from '@expo/vector-icons';

export default function SolicitudDetails({ navigation,route }) {
  const {solicitante,token,id,vo} = route.params;

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
      navigation.navigate('Inicial', {id:id, token: token });
    } catch (error) {
      console.error('Error friend:', error);
    }
  };
  const goToInicial=()=>{
    if(vo=='a'){
      navigation.navigate('MisSolicitudes', { id: id, token: token,vo:vo });
    }
    else{
      navigation.navigate('Inicial',{id:id,token:token});
    }
    
  };
  return (
    <ImageBackground source={require('../assets/guerra.jpg')} style={styles.background}>
       <TouchableOpacity
        style={{ marginTop:30, marginLeft:30,width: 50,
        height: 50,
        alignItems:'center',
        justifyContent: 'center',
        borderRadius: 25, // Half of the width and height to make it a circle
        backgroundColor: 'silver'}}
        onPress={goToInicial}
      >
        <MaterialIcons name="arrow-back" size={30} color="black" />
      </TouchableOpacity>
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
    paddingHorizontal: 50,
    paddingVertical: 0,
    
  },
  content: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 0,
    backgroundColor: 'rgba(128, 128, 128, 0.6)', // Translucent white background
  },
  detailsContainer: {
    flex: 1,
    marginLeft: 20,
  },
  playerName: {
    top:20,
    color: 'white',
    fontSize: 25,
    fontWeight: 'bold',
    textShadowColor: 'black',
    textShadowOffset: { width: 2, height: 1 },
    textShadowRadius: 2,
    textAlign:'center',
    
  },
  playerDescription: {
    top:45,
    fontSize: 18,
    textAlign: 'center',
    marginBottom: 10,
    paddingBottom: 50, 
    color: 'white',
    fontWeight: 'bold',
    textShadowColor: 'black',
    textShadowOffset: { width: 2, height: 1 },
    textShadowRadius: 2,
  },
  containerButton: {
    alignItems: 'center',
    marginBottom: 0, // Espacio adicional entre el contenido y el botón
    flexDirection: 'row',  // Alinea los elementos en fila
    justifyContent: 'center',
  },
  addButton: {
    backgroundColor: 'darkgreen',
    paddingVertical: 15,
    paddingHorizontal: 40,
    borderRadius: 12,
    marginBottom: 30,
    marginRight: 10,
    alignItems: 'center',
    justifyContent: 'center',
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
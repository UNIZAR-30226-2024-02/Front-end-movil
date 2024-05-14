import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity,ImageBackground, Alert } from 'react-native';
import axios from 'axios';
import { IP } from '../config';
import { FontAwesome } from '@expo/vector-icons';
import TextInputModal from './TextInputModal';

export default function PlayerDetails({navigation, route }) {
  const {friend,token} = route.params;
  const [modalVisible, setModalVisible] = useState(false);
  console.log('Token:', token); // Access token
  console.log('amigo:', friend)
  const handleEliminateFriend = async() => {
    //havcer para eliminar amigo
    try {
      const response = await axios.delete(
        IP+'/amistad/'+friend, // Replace with your server's URL
        { headers: { Authorization: token } }
        
      );
      Alert.alert("Sucess.Eliminado de la lista de amigos");
      navigation.navigate('MisAmigos', { token: token });
      
    } catch (error) {
      console.error('Error friend:', error);
    }
    
  };

  const handleChat = async (chatName) => {
    if (chatName) {
      try {
        const response = await axios.post(
          IP + '/chats/crearChat',
          { nombreChat: chatName, usuarios: [friend] },
          { headers: { Authorization: token } }
        );
        Alert.alert("Éxito. Chat creado correctamente.");
      } catch (error) {
        console.error('Error al crear el chat:', error);
      }
    } else {
      console.log('Operación cancelada: No se ingresó un nombre de chat.');
      Alert.alert('Operación cancelada: No se ingresó un nombre de chat.');
    }
  };

  return (
    <ImageBackground source={require('../assets/guerra.jpg')} style={styles.background}>
      <View style={styles.container}>
        <View style={styles.content}>
          <View style={styles.detailsContainer}>
            <View style={styles.titleContainer}>
              <Text style={styles.playerName}>{friend}</Text>
            </View>
            <View style={styles.containerButton}>
              <TouchableOpacity style={styles.addButton} onPress={handleEliminateFriend}>
                <FontAwesome name="times" size={24} color="white" />
                <Text style={styles.buttonText}>Eliminar Amigo</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.addButton} onPress={() => setModalVisible(true)}>
                <FontAwesome name="comment" size={24} color="white" />
                <Text style={styles.buttonText}>Empezar Chat</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </View>
      <TextInputModal
        visible={modalVisible}
        onClose={() => setModalVisible(false)}
        onSubmit={handleChat}
      />
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: 'rgba(255, 255, 255, 0.5)', // Translucent white background
    padding: 20,
    borderRadius: 10,
    margin: 20,
    width:560,
    height:300,
    marginHorizontal: 70,
    
  },
  titleContainer: {
    top: 20,
    backgroundColor: 'rgba(173, 216, 230, 0.8)',
    padding: 10,
    borderRadius: 8,
    zIndex: 1,
    width:100,
    width: '70%',
    elevation: 3,
    height: 60,
  },
  content: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  detailsContainer: {
    flex: 1,
    marginLeft: 20,
    alignItems:'center',
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
  containerButton: {
    alignItems: 'center',       // Centra los elementos horizontalmente
    marginBottom: 20,           // Espacio adicional entre el contenido y el botón
    flexDirection: 'column',    // Alinea los elementos en columna
    justifyContent: 'space-between',
    marginTop: 40,
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
    width:300,
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
    fontSize: 14,
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
import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity,ImageBackground } from 'react-native';

export default function PlayerDetails({ route }) {
  const { playerName } = route.params;
  const [isFriend, setIsFriend] = useState(false);

  const handleAddFriend = () => {
    setIsFriend(true);
  };

  return (
    //poner el isFriend a true si ya es mi amigo, mirando en la BBDD
    <View style={styles.container}>
    <View style={styles.content}>
      <View style={styles.detailsContainer}>
        <Text style={styles.playerName}>{playerName}</Text>
        <Text style={styles.playerDescription}>agdakjhdnichsnidmosxkjdalsfnzhcgfidskmzm</Text>
        <View style={styles.containerButton}>
          <TouchableOpacity style={styles.addButton} onPress={handleAddFriend}>
            <Text style={styles.buttonText}>Agregar como amigo</Text>
          </TouchableOpacity>
          {isFriend && (
              <Text style={styles.friendMessage}>
                {`${playerName} ya es tu amigo.`}
              </Text>
            )}
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
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20, // Espacio adicional entre el contenido y el botón
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

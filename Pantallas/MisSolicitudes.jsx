import React, { useEffect, useState } from 'react';
import { View, ScrollView, Image, ImageBackground, TouchableOpacity, Text, StyleSheet } from 'react-native';
import axios from 'axios';
import { IP } from '../config';
import { useFocusEffect } from '@react-navigation/native'; // Import useFocusEffect hook

export default function FriendshipRequests({ navigation, route }){
  const { token } = route.params;
  const [requests, setRequests] = useState([]);
  console.log('Token:', token); // Access token

  const fetchData = async () => {
    try {
      const response = await axios.get(IP+'/amistad/listarSolicitudes', {
        headers: {
          Authorization: token,
        },
      });
      const responseData = response.data;
      setRequests(responseData.solicitudes);
      console.log(responseData.solicitudes);
    } catch (error) {
      console.error('Error fetching friendship:', error);
    }
  };

  useEffect(() => {
    fetchData();
  }, [token]);

  // Use useFocusEffect to refetch data when the screen comes into focus
  useFocusEffect(
    React.useCallback(() => {
      fetchData();
    }, [])
  );

  const handleSolicitudPress = (user) => {
    navigation.navigate('SolicitudDetails', { solicitante: user, token: token });
  };

  return (
    <ImageBackground source={require('../assets/guerra.jpg')} style={styles.background}>
      <Text style={styles.headerText}>Solicitudes</Text>
      <ScrollView contentContainerStyle={styles.container}>
        {requests.map((userId) => (
          <TouchableOpacity
            key={userId}
            style={styles.FriendItem}
            onPress={() => handleSolicitudPress(userId)}>
            <View style={styles.tableRow}>
              <Text style={styles.playerName}>{userId}</Text>
            </View>
          </TouchableOpacity>
        ))}
      </ScrollView>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  background: {
    flex: 1,
    resizeMode: 'cover',
    justifyContent: 'center',
  },
  container: {
    flexGrow: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 10,
  },
  FriendItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.5)',
    borderRadius: 8,
    width: '90%',
    elevation: 3,
    height: 60,
  },
  headerText: {
    color: 'white',
    fontSize: 30,
    fontWeight: 'bold',
    textTransform: 'uppercase',
    textShadowColor: 'black',
    textShadowOffset: { width: 2, height: 1 },
    textShadowRadius: 2,
    textAlign:'center',
    marginTop:30,
  },
  tableRow: {
    flex: 1,
    justifyContent: 'center',
    marginLeft: 10,
  },
  playerName: {
    color: 'white',
    fontSize: 20,
    fontWeight: 'bold',
    textShadowColor: 'black',
    textShadowOffset: { width: 2, height: 1 },
    textShadowRadius: 2,
  },
});

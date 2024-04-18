import React, { useEffect, useState } from 'react';
import { View, ScrollView, Image, ImageBackground, TouchableOpacity, Text, StyleSheet } from 'react-native';
import axios from 'axios';

export default function FriendshipRequests({ navigation,route }){
  const { token } = route.params;
  const [requests, setRequests] = useState([]);
  console.log('Token:', token); // Access token

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get('http://192.168.32.96:4000/amistad/listarSolicitudes', {
        headers: {
          Authorization: token,
        },
      });
      const responseData = response.data;
      setRequests(responseData.solicitudes);
      console.log(responseData.solicitudes)
      } catch (error) {
        console.error('Error fetching friendship:', error);
      }
    };

    fetchData();
  }, [token]);

  const handleSolicitudPress = (user) => {
    navigation.navigate('SolicitudDetails', { solicitante: user, token: token });
  };

  return (
    <ImageBackground source={require('../assets/guerra.jpg')} style={styles.background}>
      <ScrollView contentContainerStyle={styles.container}>
        <View style={[styles.table, { minWidth: '60%' }]}>
          <View style={styles.tableHeader}>
            <Text style={[styles.headerText]}>UserID</Text>
          </View>
          {requests.map((userId) => (
            <TouchableOpacity
            key={userId}
            onPress={() => handleSolicitudPress(userId)}>
            <View key={userId} style={styles.tableRow}>
              <Text style={styles.playerName}>{userId}</Text>
            </View>
          </TouchableOpacity>
          ))}
        </View>
      </ScrollView>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  background: {
    flex: 1,
    resizeMode: 'cover',
    justifyContent: 'center',
    alignItems: 'center',
  },
  container: {
    flexGrow: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 20,
  },
  table: {
    borderWidth: 1,
    borderColor: 'white',
    borderRadius: 8,
    overflow: 'hidden',
  },
  tableHeader: {
    backgroundColor: '#4CAF50',
    padding: 10,
  },
  headerText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: 'white',
    textAlign: 'center',
  },
  tableRow: {
    backgroundColor: '#ffffff',
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#4CAF50',
  },
  playerName: {
    fontSize: 16,
    textAlign: 'center',
  },
});
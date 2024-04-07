import React, { useEffect, useState } from 'react';
import { View, ScrollView, Image, ImageBackground, TouchableOpacity, Text, StyleSheet } from 'react-native';
import axios from 'axios';

export default function FriendshipRequests({ route }){
  const { token } = route.params;
  const [requests, setRequests] = useState([]);
  console.log('Token:', token); // Access token

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get('http://192.168.1.44:4000/amistad/listarSolicitudes', {
        headers: {
          Authorization: token,
        },
      });
      const responseData = response.data;
        if (Array.isArray(responseData)) {
          setRequests(responseData); // Set requests if it's an array
        } else {
            console.warn('Response data is not an array:', responseData.solicitudes);
            setRequests([]); // Set requests to an empty array if response data is not an array
        }
      } catch (error) {
        console.error('Error fetching friendship:', error);
      }
    };

    fetchData();
  }, [token]);

  return (
    <ImageBackground source={require('../assets/tienda.jpg')} style={styles.background}>
      <ScrollView contentContainerStyle={styles.container}>
        {requests.map((request) => (
          <TouchableOpacity
            key={request}
            style={styles.skinItem}
          >
            <Text>{request}</Text>
          </TouchableOpacity>
        ))}
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
  background: {
    flex: 1,
    resizeMode: 'cover',
    justifyContent: 'center',
  },
  skinItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
    backgroundColor: '#ffffff',
    borderRadius: 8,
    width: '90%',
    elevation: 3,
    backgroundColor: 'rgba(255, 255, 255, 0.5)',
  },
  skinImage: {
    width: 100,
    height: 100,
    borderRadius: 8,
    margin: 10,
  },
  skinDetails: {
    flex: 1,
    justifyContent: 'center',
    marginLeft: 10,
  },
  skinName: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  skinDescription: {
    fontSize: 16,
    marginBottom: 5,
  },
  skinPrice: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#4CAF50',
  },
});


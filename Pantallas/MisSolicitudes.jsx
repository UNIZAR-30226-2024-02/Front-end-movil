import React, { useEffect, useState } from 'react';
import { View, ScrollView, Image, ImageBackground, TouchableOpacity, Text, StyleSheet } from 'react-native';
import axios from 'axios';
import { IP } from '../config';
import { useFocusEffect } from '@react-navigation/native'; // Import useFocusEffect hook
import { FontAwesome } from '@expo/vector-icons'; // Import FontAwesome from expo/vector-icons
import { MaterialIcons } from '@expo/vector-icons';

export default function FriendshipRequests({ navigation, route }){
  const {userid, token,vo } = route.params;
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

  const goToInicial=()=>{
    navigation.navigate('Amistad', { userid : userid, token: token,vo:vo });
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
    navigation.navigate('SolicitudDetails', { solicitante: user, token: token,userid : userid,vo:vo});
  };

  return (
    <ImageBackground source={require('../assets/guerra.jpg')} style={styles.background} resizeMode="stretch">
    
      
     <Text style={styles.headerText}>Solicitudes</Text>
     <TouchableOpacity
        style={{ marginTop:-50, marginLeft:30,width: 50,
        height: 50,
        alignItems:'center',
        justifyContent: 'center',
        borderRadius: 25, // Half of the width and height to make it a circle
        backgroundColor: 'silver'}}
        onPress={goToInicial}
      >
        <MaterialIcons name="arrow-back" size={30} color="black" />
      </TouchableOpacity>
      <ScrollView contentContainerStyle={styles.container}>
        {requests.map((userId) => (
          <TouchableOpacity
            key={userId}
            style={styles.FriendItem}
            onPress={() => handleSolicitudPress(userId)}>
            <View style={styles.tableRow}>
            <FontAwesome name="user-plus" size={30} top={20} left={25} color="white" style={styles.userplus} />
              <Text style={styles.playerName}>Solicitud de amistad de {userId}</Text>
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
    backgroundColor: 'rgba(0, 128, 0, 0.5)', // Green with 50% opacity
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
    marginTop:40,
  },
  tableRow: {
    flex: 1,
    justifyContent: 'center',
    marginLeft: 10,
  },
  playerName: {
    color: 'white',
    fontSize: 30,
    fontWeight: 'bold',
    textShadowColor: 'black',
    bottom:15,
    marginLeft:90,
    textShadowOffset: { width: 2, height: 1 },
    textShadowRadius: 2,
  },
});

import React, { useEffect, useState } from 'react';
import { View, ScrollView, Image, ImageBackground, TouchableOpacity, Text, StyleSheet } from 'react-native';
import axios from 'axios';
import { IP } from '../config';
import { useFocusEffect } from '@react-navigation/native'; // Import useFocusEffect hook

export default function FriendshipRequests({ navigation,route }){
  const { token } = route.params;
  const [requests, setRequests] = useState([]);
  console.log('Token:', token); // Access token

  const fetchData = async () => {
    try {
      const response = await axios.get(IP+'/amistad/listarAmigos', {
        headers: {
          Authorization: token,
        },
      });
      const responseData = response.data;
      setRequests(responseData.friends);
      console.log(responseData.friends);
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

  const handleFriendPress = (user) => {
    const selectedFriend = requests.find((friend) => friend === user);
    navigation.navigate('FriendDetails', { friend: selectedFriend, token: token });
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
              onPress={() => handleFriendPress(userId)}>
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

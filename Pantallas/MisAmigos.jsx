import React, { useEffect, useState } from 'react';
import { View, ScrollView, ImageBackground, TextInput, TouchableOpacity, Text, StyleSheet } from 'react-native';
import axios from 'axios';
import { IP } from '../config';
import { useFocusEffect } from '@react-navigation/native'; // Import useFocusEffect hook


export default function FriendshipRequests({ navigation,route }){
  const { token } = route.params;
  const [requests, setRequests] = useState([]);
  console.log('Token:', token); // Access token
  const [searchQuery, setSearchQuery] = useState('');
  const [filtred, setFiltred] = useState([]);


  const fetchData = async () => {
    try {
      const response = await axios.get(IP+'/amistad/listarAmigos', {
        headers: {
          Authorization: token,
        },
      });
      const responseData = response.data;
      setRequests(responseData.friends);
      setFiltred(responseData.friends);
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

  const handleSearch = (query) => {
    setSearchQuery(query);
    if (query === '') {
      setFiltred(requests); // Mostrar todos los amigos cuando la búsqueda está vacía
    } else {
      const filtered = requests.filter(userId =>
        userId.includes(query)
      );
      setFiltred(filtered);
    }
  };

  const handleFriendPress = (user) => {
    const selectedFriend = requests.find((friend) => friend === user);
    navigation.navigate('FriendDetails', { friend: selectedFriend, token: token });
  };

  return (
    <ImageBackground source={require('../assets/guerra.jpg')} style={styles.background} resizeMode="stretch">
       <View style={styles.titleContainer}>
        <Text style={styles.title}>AMIGOS</Text>
      </View>
      <View style={styles.searchContainer}>
        <TextInput
          style={styles.searchInput}
          placeholder="Introduce el nombre del amigo a buscar"
          onChangeText={handleSearch}
          value={searchQuery}
          mode="outlined"
        />
      </View>
      <ScrollView contentContainerStyle={styles.container}>
        {filtred.map((userId) => (
          <TouchableOpacity
            key={userId}
            style={styles.FriendItem}
            onPress={() => handleFriendPress(userId)}
          >
            <View style={styles.FriendDetails}>
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
  titleContainer: {
    position: 'absolute',
    top: 20,
    left:290,
    backgroundColor: 'rgba(255, 255, 255, 0.8)',
    padding: 10,
    borderRadius: 5,
    zIndex: 1,
    width:100
  },
  title: {
    color: '#000', // Set color to black for visibility
    fontSize: 20,
    fontWeight: 'bold',
  },
  container: {
    flexGrow: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 10,
  },
  searchContainer: {
    marginTop: 90, 
    marginLeft: 15,
    marginRight: 15,
    marginBottom: 10, 
  },
  searchInput: {
    backgroundColor: '#ffffff',
    padding: 10,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: '#DB4437',
    borderRadius: 8,
    minWidth: '80%',
  },
  FriendDetails: {
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
});

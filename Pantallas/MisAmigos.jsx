import React, { useEffect, useState } from 'react';
import { View, ScrollView, ImageBackground, TextInput, TouchableOpacity, Text, StyleSheet } from 'react-native';
import axios from 'axios';
import { IP } from '../config';
import { useFocusEffect } from '@react-navigation/native'; // Import useFocusEffect hook

export default function FriendshipRequests({ navigation, route }) {
  const { token } = route.params;
  const [requests, setRequests] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [filtred, setFiltred] = useState([]);

  const fetchData = async () => {
    try {
      const response = await axios.get(IP + '/amistad/listarAmigos', {
        headers: {
          Authorization: token,
        },
      });
      const responseData = response.data;
      setRequests(responseData.friends);
      setFiltred(responseData.friends);
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
      <View style={styles.translucentBox}>
        <View style={styles.titleContainer}>
          <Text style={styles.title}>MIS AMIGOS</Text>
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
      </View>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  background: {
    flex: 1,
    resizeMode: 'cover',
    justifyContent: 'center',
  },
  translucentBox: {
    backgroundColor: 'rgba(255, 255, 255, 0.5)', // Translucent white background
    padding: 20,
    borderRadius: 10,
    margin: 20,
    width:560,
    height:300,
    marginHorizontal: 70, // Adjusted margin on both sides
  },
  titleContainer: {
    marginBottom: 20,
  },
  title: {
    color: '#000',
    fontSize: 20,
    fontWeight: 'bold',
    left:200,
  },
  container: {
    flexGrow: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 10,
  },
  searchContainer: {
    marginBottom: 20,
  },
  searchInput: {
    backgroundColor: '#ffffff',
    padding: 10,
    borderWidth: 1,
    borderColor: '#DB4437',
    borderRadius: 8,
    maxWidth: '60%',
    left:100,
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
    backgroundColor: 'rgba(173, 216, 230, 0.8)',
    borderRadius: 8,
    width: '70%',
    elevation: 3,
    height: 60,
  },
});

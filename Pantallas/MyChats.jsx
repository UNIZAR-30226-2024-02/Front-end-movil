import React, { useEffect, useState } from 'react';
import { View, ScrollView, Text, TextInput,TouchableOpacity, StyleSheet, ImageBackground } from 'react-native';
import axios from 'axios';
import { IP } from '../config';
import { useFocusEffect } from '@react-navigation/native'; // Import useFocusEffect hook

export default function FriendshipRequests({ navigation, route }) {
  const { id, token } = route.params;
  const [chats, setChats] = useState([]);
  const [filtred, setFiltred] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');

  const fetchChats = async () => {
    try {
      const response = await axios.get(IP+'/chats/listar', {
        headers: {
          Authorization: token,
        },
      });
      setChats(response.data.chats);
      setFiltred(response.data.chats);
      console.log(response.data.chats);
    } catch (error) {
      console.error('Error fetching chats:', error);
    }
  };

  useEffect(() => {
    fetchChats();
  }, [token]);

  // Use useFocusEffect to refetch data when the screen comes into focus
  useFocusEffect(
    React.useCallback(() => {
      fetchChats();
    }, [])
  );

  const handleSearch = (query) => {
    setSearchQuery(query);
    if (query === '') {
      setFiltred(chats); // Mostrar todos los amigos cuando la búsqueda está vacía
    } else {
      const filtered = chats.filter(chat =>
        chat.nombre.includes(query)
      );
      setFiltred(filtered);
    }
  };

  const handleChatPress = (c) => {
    // Navigate to chat details screen or implement your logic here
    navigation.navigate('Chat',{ chat:c, id:id, token: token });
  };

  return (
    <ImageBackground source={require('../assets/guerra.jpg')} style={styles.background} resizeMode="stretch">
      <View style={styles.titleContainer}>
        <Text style={styles.title}>CHATS</Text>
      </View>
      <View style={styles.searchContainer}>
        <TextInput
          style={styles.searchInput}
          placeholder="Introduce el nombre del chat a buscar"
          onChangeText={handleSearch}
          value={searchQuery}
          mode="outlined"
        />
      </View>
      <ScrollView contentContainerStyle={styles.container}>
          {filtred.map((chat) => (
            <TouchableOpacity
              key={chat.nombre}
              style={styles.ChatItem}
              onPress={() => handleChatPress(chat)}>
              <View style={styles.ChatDetails}>
                <Text style={styles.ChatName}>{chat.nombre}</Text>
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
    width:90
  },
  title: {
    color: '#000', // Set color to black for visibility
    fontSize: 20,
    fontWeight: 'bold',
  },
  searchContainer: {
    marginTop: 90, 
    marginLeft: 15,
    marginRight: 15,
    marginBottom: 10
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
  container: {
    flexGrow: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 10,
  },
  ChatDetails: {
    flex: 1,
    justifyContent: 'center',
    marginLeft: 10,
  },
  ChatName: {
    color: 'white',
    fontSize: 20,
    fontWeight: 'bold',
    textShadowColor: 'black',
    textShadowOffset: { width: 2, height: 1 },
    textShadowRadius: 2,
  },
  ChatItem: {
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

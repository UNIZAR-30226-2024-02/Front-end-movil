import React, { useEffect, useState } from 'react';
import { View, ScrollView, Text, TextInput,TouchableOpacity, StyleSheet, ImageBackground } from 'react-native';
import axios from 'axios';
import { IP } from '../config';
import { useFocusEffect } from '@react-navigation/native'; // Import useFocusEffect hook
import { io } from 'socket.io-client';

export default function FriendshipRequests({ navigation, route }) {
  const { id, token } = route.params;
  const [chats, setChats] = useState([]);
  const [filtred, setFiltred] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [socket, setSocket] = useState();

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
    setSocket(io(IP));
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
    if (socket) {
      console.log('Joining chat:', c);
      socket.emit('joinChat', c.oid);
      navigation.navigate('Chat',{ chat:c, id:id, token: token, socket: socket});
    }
    // Navigate to chat details screen or implement your logic here
    
  };

  return (
    <ImageBackground source={require('../assets/guerra.jpg')} style={styles.background} resizeMode="stretch">
      <View style={styles.translucentBox}>
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
    backgroundColor: 'rgba(173, 216, 230, 0.8)',
    borderRadius: 8,
    width: '70%',
    elevation: 3,
    height: 60,
  },
});

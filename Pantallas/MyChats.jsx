import React, { useEffect, useState } from 'react';
import { View, ScrollView, Text, TextInput,TouchableOpacity, StyleSheet, ImageBackground } from 'react-native';
import axios from 'axios';
import { IP } from '../config';
import { useFocusEffect } from '@react-navigation/native'; // Import useFocusEffect hook
import { io } from 'socket.io-client';
import { MaterialIcons } from '@expo/vector-icons';

export default function FriendshipRequests({ navigation, route }) {
  const { userid, token } = route.params;
  const [chats, setChats] = useState([]);
  const [filtred, setFiltred] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [socket, setSocket] = useState();

  const goToInicial=()=>{
    navigation.navigate('Inicial', { userid : userid, token: token });
  };

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
    console.log('ID:', userid);
      navigation.navigate('Chat',{ chat:c,userid : userid, token: token});
    // Navigate to chat details screen or implement your logic here
    
  };

  return (
    <ImageBackground source={require('../assets/guerra.jpg')} style={styles.background} resizeMode="stretch">
      <View style={styles.container}>
        <View style={styles.touchableColumn}>
          <TouchableOpacity
            style={styles.touchable}
            onPress={goToInicial}
          >
            <MaterialIcons name="arrow-back" size={30} color="black" />
          </TouchableOpacity>
        </View>
  
        <View style={styles.translucentColumn}>
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
            <ScrollView contentContainerStyle={styles.scrollViewContent}>
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
        </View>
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
  container: {
    flex: 1,
    flexDirection: 'row',
  },
  touchableColumn: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'flex-start',
  },
  touchable: {
    marginTop: -250,
    marginLeft: 40,
    width: 50,
    height: 50,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 25,
    backgroundColor: 'silver',
  },
  translucentColumn: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  translucentBox: {
    backgroundColor: 'rgba(255, 255, 255, 0.5)',
    padding: 20,
    borderRadius: 10,
    marginLeft: -300,
    width: 500,
    height: 300,
  },
  titleContainer: {
    marginBottom: 20,
  },
  title: {
    color: '#000',
    fontSize: 20,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  searchContainer: {
    marginBottom: 20,
    marginLeft:70,
    width:500,
  },
  searchInput: {
    backgroundColor: '#ffffff',
    padding: 10,
    borderWidth: 1,
    borderColor: '#DB4437',
    borderRadius: 8,
    maxWidth: '60%',
  },
  scrollViewContent: {
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

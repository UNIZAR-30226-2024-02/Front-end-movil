import React, { useEffect, useState } from 'react';
import { View, ScrollView, Text, TouchableOpacity, StyleSheet, ImageBackground } from 'react-native';
import axios from 'axios';
import { IP } from '../config';

export default function FriendshipRequests({ navigation, route }) {
  const { id,token } = route.params;
  const [chats, setChats] = useState([]);
  
  useEffect(() => {
    const fetchChats = async () => {
      try {
        const response = await axios.get(IP+'/chats/listar', {
          headers: {
            Authorization: token,
          },
        });
        setChats(response.data.chats);
        console.log(response.data.chats)
      } catch (error) {
        console.error('Error fetching chats:', error);
      }
    };

    fetchChats();
  }, [token]);

  const handleChatPress = (c) => {
    // Navigate to chat details screen or implement your logic here
    navigation.navigate('Chat',{ chat:c, id:id, token: token });
  };

  return (
    <ImageBackground source={require('../assets/guerra.jpg')} style={styles.background}>
      <ScrollView contentContainerStyle={styles.container}>
        <View style={[styles.table, { minWidth: '60%' }]}>
          <View style={styles.tableHeader}>
            <Text style={styles.headerText}>Chat ID</Text>
          </View>
          {chats.map((chat) => (
            <TouchableOpacity
              key={chat.nombre}
              onPress={() => handleChatPress(chat)}>
              <View style={styles.tableRow}>
                <Text style={styles.chatId}>{chat.nombre}</Text>
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
  chatId: {
    fontSize: 16,
    textAlign: 'center',
  },
});

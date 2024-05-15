

import React, { useState, useEffect, useRef } from 'react';
import { View, Text, TextInput, TouchableOpacity, ScrollView, StyleSheet, Modal,ImageBackground } from 'react-native';
import axios from 'axios';
import { IP } from '../config';

export default function ModalChat({ isVisible, whoami, socket, onClose, chat, id, token }) {
  const [message, setMessage] = useState('');
  const [_chat, setChat] = useState(chat);
  const [_socket, setSocket] = useState(socket);
  const [messages, setMessages] = useState([]);
  const [participantList, setParticipantList] = useState([]);
  const [showParticipantListModal, setShowParticipantListModal] = useState(false);
  const [count, setCount] = useState(0);
  const scrollViewRef = useRef();
  console.log('Chat',_chat)
  const fetchMessages = async () => {
    try {
        if(_chat===null) return;
      const response = await axios.post(
        IP+'/chats/obtenerMensajes',
        { OIDChat: _chat._id },
        { headers: { Authorization: token } }
      );
      setMessages(response.data.msgs);
      //console.log(response.data.msgs)
    } catch (error) {
        console.log('Error sending message:', error);
      //console.error('Error fetching messages:', error.response.data.error);
    }
  };

  useEffect(() => {
    if (_socket) {
        _socket.on('chatMessage', (mensaje, user, timestamp, chatId) => {
            console.log('chatMessage', mensaje, user, timestamp, chatId)
            fetchMessages();
        })
    }
    }, [_socket]);


  useEffect(() => {
    fetchMessages();
  }, []);



  const handleMessageSend = async () => {
    if (message.trim() !== '') {
      try {
        await axios.post(
          IP+'/chats/enviarMensaje',
          {
            OID: _chat._id,
            textoMensaje: message
          },
          { headers: { Authorization: token } }
        );
        socket.emit('sendChatMessage', { chatId: chat._id, message: message, user: whoami, timestamp: new Date().toISOString()});
        setMessage('');
        fetchMessages();
      } catch (error) {
        console.log('Error sending message:');
        console.error('Error sending message:', error.response.data.error);
      }
    }
  };

  
  const handleSalirListarP = () => {
    setShowParticipantListModal(false);
  };

 

  // Scroll to the bottom of the message list
  const scrollToBottom = () => {
    if(scrollViewRef.current)
        scrollViewRef.current.scrollToEnd({ animated: true });
  };

  const handleOptionsMenuPress = () => {
    onClose();
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  return (
    _chat ? <Modal animationType="slide" transparent={true} visible={isVisible} >
    <View style={styles.background}>
      <View style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.title}>Chat de la Partida</Text>
          <View style={styles.options}>
            <TouchableOpacity style={styles.optionsButton} onPress={handleOptionsMenuPress}>
              <Text style={styles.optionsText}>Cerrar</Text>
            </TouchableOpacity>
          </View>
        </View>
        
        <Modal
          visible={showParticipantListModal}
          transparent={true}
          animationType="fade"
          onRequestClose={handleSalirListarP}>
          <View style={styles.modalBackground}>
              <View style={styles.modalContent}>
              <Text style={styles.modalText}>Lista de Participantes</Text>
              <ScrollView>
                  {participantList.map((participant, index) => (
                  <Text key={index}>{participant}</Text>
                  // Replace 'name' with the key you want to display for each participant
                  ))}
              </ScrollView>
              </View>
          </View>
          </Modal>
        <ScrollView
          ref={scrollViewRef}
          style={styles.messageContainer}
          contentContainerStyle={styles.messageContent}
          onContentSizeChange={scrollToBottom}>
          {messages.map((msg, index) => (
            <View key={index} style={msg.idUsuario === whoami ? styles.userMessage : styles.otherMessage}>
              <Text>{msg.texto}</Text>
            </View>
          ))}
        </ScrollView>
        <View style={styles.inputContainer}>
          <TextInput
            style={styles.input}
            placeholder="Type a message..."
            value={message}
            onChangeText={setMessage}
          />
          <TouchableOpacity style={styles.sendButton} onPress={handleMessageSend}>
            <Text style={styles.sendButtonText}>Send</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
    </Modal>
    : null
  );
}

const styles = StyleSheet.create({
  background: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: 'white',
    marginTop: 30,
    marginBottom: 40,
    marginHorizontal: 20,
    borderRadius: 10,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
    backgroundColor: '#DB4437',
    borderRadius:5,
  },
  title: {
    fontSize: 24,
    marginBottom: 10,
    color: 'white',
    fontWeight: 'bold',
    textShadowColor: 'black',
    textShadowOffset: { width: 2, height: 1 },
    textShadowRadius: 2,
    textAlign:'center',
    left:10,
  },
  options: {
    flexDirection: 'row',
  },
  optionButton: {
    backgroundColor: '#4CAF50',
    padding: 10,
    borderRadius: 8,
    marginLeft: 10,
  },
  optionButtonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  messageContainer: {
    flex: 1,
    marginBottom: 20,
  },
  messageContent: {
    paddingBottom: 20,
  },
  userMessage: {
    backgroundColor: '#4CAF50',
    padding: 10,
    alignSelf: 'flex-end',
    borderRadius: 10,
    marginBottom: 5,
    maxWidth: '70%',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.3,
    shadowRadius: 1,
    elevation: 2,
  },
  otherMessage: {
    backgroundColor: '#fff',
    padding: 10,
    alignSelf: 'flex-start',
    borderRadius: 10,
    marginBottom: 5,
    maxWidth: '70%',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.3,
    shadowRadius: 1,
    elevation: 2,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  input: {
    flex: 1,
    borderWidth: 1,
    borderColor: '#DB4437',
    borderRadius: 8,
    padding: 10,
    marginRight: 10,
    backgroundColor: '#fff',
  },
  sendButton: {
    backgroundColor: '#DB4437',
    padding: 10,
    borderRadius: 8,
  },
  sendButtonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  modalBackground: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: 'white',
    padding: 20,
    borderRadius: 10,
    alignItems: 'center',
    borderWidth:2,
    borderColor: '#DB4437',
  },
  modalText: {
    fontSize: 16,
    marginBottom: 20,
    textAlign: 'center',
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
  },
  cancelButton: {
    backgroundColor: '#ccc',
    padding: 10,
    borderRadius: 5,
    marginRight: 10,
  },
  confirmButton: {
    backgroundColor: '#DB4437',
    padding: 10,
    borderRadius: 5,
    marginLeft: 10,
  },
  buttonText: {
    color: 'white',
    fontWeight: 'bold',
  },
  optionsButton: {
    paddingHorizontal: 30,
  },
  optionsText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fff', // Color de texto verde
  },
  optionsMenu: {
    position: 'absolute',
    top:25,
    right:20,
    backgroundColor: '#fff',
    borderRadius: 8,
    borderWidth:2,
    borderColor: '#DB4437',
    paddingVertical: 8,
    paddingHorizontal: 16,
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  optionItem: {
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
  },
  optionText: {
    fontSize: 16,
    marginBottom: 10,
    color: 'white',
    fontWeight: 'bold',
    textShadowColor: 'black',
    textShadowOffset: { width: 2, height: 1 },
    textShadowRadius: 2,
  },
});




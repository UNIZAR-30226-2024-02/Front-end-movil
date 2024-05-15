import React, { useState, useEffect,useRef } from 'react';
import { View, TouchableOpacity, ScrollView,Text, FlatList,StyleSheet, ImageBackground, Button } from 'react-native';
import { FontAwesome } from '@expo/vector-icons'; // Import FontAwesome from expo/vector-icons
import { IP } from '../config';
import { useFocusEffect } from '@react-navigation/native'; // Import useFocusEffect hook
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import io from 'socket.io-client';
import { MaterialIcons } from '@expo/vector-icons';

export default function Inicial({ navigation, route }) {
  const { userid, token } = route.params;
  const [showPopup, setShowPopup] = useState(false);
  const [notificaciones,setNotificacion]=useState([]);
  const [socket ,setSocket]=useState('');
  const [chats,setChats]=useState([]);
  const [newNot,setNewNotification]=useState(null);
  const [contador,setContador]=useState(0);
  console.log('Token', token)
  console.log('inicial', userid)
  const CargarChats = async () =>{
    const response= await axios.get(IP+'/chats/listar', { headers: {'Authorization':token } });
    setChats(response.data.chats);
  };

  useEffect(() => {
    console.log('Token', token)

    console.log('Initial notificaciones:', notificaciones);
    setSocket(io(IP))
    //console.log(socket)
    CargarChats();
    return () => io(IP).close();
  }, []);

  useEffect(() => {
    if (socket) {
      // Configuración de los listeners del socket
      const handleFriendRequest = (notificacion) => {
        notificaciones.push('Nueva solicitud de amistad: ' + notificacion);
        setContador(contador+1)
      };

      const handleChatMessage = (mensaje, user, timestamp, chatId) => {
        let shortMensaje = mensaje.length > 10 ? mensaje.substring(0, 10) + '...' : mensaje;
        notificaciones.push('Nuevo mensaje de ' + user + ' ' + shortMensaje);
        setContador(contador+1)
      };

      const handleGameInvitation = (gameId, user_from) => {
        notificaciones.push('Nueva invitación a partida de ' + user_from);
        setContador(contador+1)
      };

      socket.on('friendRequest', handleFriendRequest);
      socket.on('chatMessage', handleChatMessage);
      socket.on('gameInvitation', handleGameInvitation);

      // Unirse a los chats
      chats.forEach((chat) => {
        socket.emit('joinChat', chat.oid);
      });

      // Cleanup para quitar los listeners cuando el componente se desmonte
      return () => {
        socket.off('friendRequest', handleFriendRequest);
        socket.off('chatMessage', handleChatMessage);
        socket.off('gameInvitation', handleGameInvitation);
      };
    }
  }, [socket, chats]);


  const handleSolicitudPress = (user) => {
    navigation.navigate('SolicitudDetails', { solicitante: user, token: token, userid:userid });
  };

  const handlePartidaPress = (id) => {
    navigation.navigate('Partida', { userid:userid,token:token }); // Navigate to Partida component with id as a parameter
  };

  const goToCrearPartida = () => {
    // Navigate to "Crear Partida" screen
    navigation.navigate('Partidas', { userid: userid, token: token });
  };

  const goToNotificaciones = () => {
    setShowPopup(true);
  };

  const goToRanking = () => {
    // Navigate to "Ranking" screen
    navigation.navigate('Ranking', {userid : userid,token: token });
  };

  const goToTienda = () => {
    // Navigate to "Tienda" screen
    navigation.navigate('Tienda', {userid : userid,token: token });
  };

  const goToPerfil = () => {
    // Navigate to "Perfil" screen
    navigation.navigate('Perfil', {userid : userid, token: token });
  };

  const goToChats = () => {
    // Navigate to "Chats" screen
    navigation.navigate('MyChats', {userid : userid, token: token });
  };

  const goToAmigos = () => {
    // Navigate to "Chats" screen
    navigation.navigate('MisAmigos', {userid : userid,token: token,volver:'i'});
  };

  const goToAmistad = () => {
    // Navigate to "Chats" screen
    navigation.navigate('Amistad', {userid : userid, token: token });
  };

  const renderNotification = ({ item }) => (
    <View style={styles.row}>
      <Text>{item}</Text>
    </View>
  );

  return (
    <ImageBackground source={require('../assets/guerra.jpg')} style={styles.backgroundImage} resizeMode="stretch">
      <View style={styles.container}>
      <TouchableOpacity
        style={{ flexDirection: 'row', alignItems: 'center', marginBottom:250, marginRight:600,width: 50,
        height: 50,
        borderRadius: 25, // Half of the width and height to make it a circle
        backgroundColor: 'silver',
        justifyContent: 'center',
        alignItems: 'center'}}
        onPress={() => navigation.goBack()}
      >
        <MaterialIcons name="arrow-back" size={30} color="black" />
      </TouchableOpacity>
          <TouchableOpacity style={styles.Partidasbutton} onPress={goToCrearPartida}>
          <FontAwesome name="gamepad" size={24} color="white" />
            <Text style={styles.PartidasbuttonText}>Partidas</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.Rankingbutton} onPress={goToRanking}>
          <FontAwesome name="trophy" size={24} color="white" />
            <Text style={styles.RankingbuttonText}>Ranking</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.Perfilbutton} onPress={goToPerfil}>
          <FontAwesome name="user" size={24} color="white" />
            <Text style={styles.PerfilbuttonText}>Perfil</Text>
          </TouchableOpacity>
        <TouchableOpacity style={styles.Amistadbutton} onPress={goToAmistad}>
        <FontAwesome name="user-plus" size={24} color="white" />
            <Text style={styles.AmistadbuttonText}>Solicitudes</Text>
          </TouchableOpacity>
        {/* Chat button */}
        <TouchableOpacity style={styles.chatButton} onPress={goToChats}>
          <FontAwesome name="comments" size={24} color="white" />
          <Text style={styles.chatButtonText}>Chat</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.amigosButton} onPress={goToAmigos}>
          <FontAwesome name="users" size={24} color="white" />
          <Text style={styles.amigosButtonText}>Amigos</Text>
        </TouchableOpacity>
        {/* Tienda button */}
        <TouchableOpacity style={styles.tiendaButton} onPress={goToTienda}>
          <FontAwesome name="shopping-basket" size={24} color="white" />
          <Text style={styles.tiendaButtonText}>Tienda</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.notificacionesButton} onPress={goToNotificaciones}>
          <FontAwesome name="bell" size={24} color="white" />
          <Text style={styles.notificacionesButtonText}>Notificaciones</Text>
          {contador > 0 ? (
            <View style={styles.notificationIndicator} />
          ): ''}
        </TouchableOpacity>

        {showPopup && (
          <TouchableOpacity style={styles.popupBackdrop} onPress={() => setShowPopup(false)}>
            <View style={styles.popupContainer}>
              <FlatList
                data={notificaciones}
                renderItem={renderNotification}
                keyExtractor={(item, index) => index.toString()}
              />
            </View>
          </TouchableOpacity>
        )}
      </View>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  scrollViewContent: {
    alignItems: 'center',
    paddingHorizontal: 10, // Adjust as needed
    width: 350, // Adjust the width as per your requirement
    height: 300, // Adjust the height as per your requirement
  },
  
  notificationItem: {
    marginBottom: 10,
    backgroundColor: 'rgba(255, 255, 255, 0.8)',
    borderRadius: 12,
    padding: 10,
  },
  notificationIndicator: {
    position: 'absolute',
    top: 5,
    right: 5,
    backgroundColor: 'red',
    width: 10,
    height: 10,
    borderRadius: 5,
  },  
  notificationContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  notificationButton: {
    backgroundColor: 'rgba(255, 165, 0, 1)',
    borderRadius: 8,
    paddingVertical: 20,
    paddingHorizontal: 40,
  },
  notificationButtonText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize:20,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
  },
  backgroundImage: {
    flex: 1,
    resizeMode: 'cover',
    justifyContent: 'center',
  },
  Atrasbutton: {
    position: 'absolute',
    top:30,
    left:30,
    backgroundColor: '#007bff',
    borderRadius: 80,
    width: 80,
    height: 80,
    justifyContent: 'center',
    alignItems: 'center',
    
  },
  AtrasbuttonText: {
    color: 'white',
    fontWeight: 'bold',
    marginLeft: 0,
    fontWeight: 'bold',
    textTransform: 'uppercase',
    // Adding text shadow to create black outline
    textShadowColor: 'black',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 1,
  },

  Partidasbutton: {
    backgroundColor: '#DB4437',
    paddingVertical: 11,
    paddingHorizontal: 40,
    borderRadius: 12,
    marginBottom: 0,
    marginRight: 10,
    position: 'absolute',
    top:70,
    left:150,
    justifyContent: 'center',
    alignItems: 'center',
    overflow: 'hidden',
    width:160,
    height:80,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 3,
    },
    shadowOpacity: 0.5,
    shadowRadius: 4,
    elevation: 5,
    // Adding larger darker bottom part
    borderBottomColor: 'rgba(0,0,0,0.2)',
    borderBottomWidth: 5,
  },
  PartidasbuttonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
    textTransform: 'uppercase',
    textShadowColor: 'black',
    textShadowOffset: { width: 2, height: 1 },
    textShadowRadius: 2,
  },
  Rankingbutton: {
    backgroundColor: 'green',
    paddingVertical: 11,
    paddingHorizontal: 40,
    borderRadius: 12,
    marginBottom: 0,
    width:160,
    height:80,
    position: 'absolute',
    top:180,
    left:150,
    marginRight: 10,
    justifyContent: 'center',
    alignItems: 'center',
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 3,
    },
    amigosButton: {
      position: 'absolute',
      bottom: 30,
      right: 30,
      backgroundColor: '#007bff',
      borderRadius: 80,
      width: 80,
      height: 80,
      justifyContent: 'center',
      alignItems: 'center',
      // Adding shadow
      shadowColor: '#000',
      shadowOffset: {
        width: 0,
        height: 3,
      },
      shadowOpacity: 0.5,
      shadowRadius: 4,
      elevation: 5,
      // Adding larger darker bottom part
      borderBottomColor: 'rgba(0,0,0,0.2)',
      borderBottomWidth: 5,
    },
    amigosButtonText: {
      color: 'white',
      fontWeight: 'bold',
      marginLeft: 0,
      textTransform: 'uppercase',
      // Adding text shadow to create black outline
      textShadowColor: 'black',
      textShadowOffset: { width: 1, height: 1 },
      textShadowRadius: 1,
    },
    
    shadowOpacity: 0.5,
    shadowRadius: 4,
    elevation: 5,
    // Adding larger darker bottom part
    borderBottomColor: 'rgba(0,0,0,0.2)',
    borderBottomWidth: 5,
  },
  RankingbuttonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
    textTransform: 'uppercase',
    // Adding text shadow to create black outline
    textShadowColor: 'black',
    textShadowOffset: { width: 2, height: 1 },
    textShadowRadius: 2,
  },
  Perfilbutton: {
    backgroundColor: 'purple',
    paddingVertical: 11,
    paddingHorizontal: 40,
    borderRadius: 12,
    marginBottom: 0,
    marginRight: 10,
    position: 'absolute',
    top:70,
    width:160,
    height:80,
    right:200,
    justifyContent: 'center',
    alignItems: 'center',
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 3,
    },
    shadowOpacity: 0.5,
    shadowRadius: 4,
    elevation: 5,
    // Adding larger darker bottom part
    borderBottomColor: 'rgba(0,0,0,0.2)',
    borderBottomWidth: 5,
  },
  PerfilbuttonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
    textTransform: 'uppercase',
    // Adding text shadow to create black outline
    textShadowColor: 'black',
    textShadowOffset: { width: 2, height: 1 },
    textShadowRadius: 2,
  },
  Amistadbutton: {
    backgroundColor: 'gray',
    paddingVertical: 11,
    paddingHorizontal: 40,
    borderRadius: 12,
    marginBottom: 0,
    width:180,
    height:80,
    position:'absolute',
    top:180,
    right:180,
    marginRight: 10,
    justifyContent: 'center',
    alignItems: 'center',
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 3,
    },
    shadowOpacity: 0.5,
    shadowRadius: 4,
    elevation: 5,
    // Adding larger darker bottom part
    borderBottomColor: 'rgba(0,0,0,0.2)',
    borderBottomWidth: 5,
  },
  Mapabutton: {
    backgroundColor: '#DB4437',
    paddingVertical: 11,
    paddingHorizontal: 40,
    borderRadius: 12,
    marginBottom: 0,
    position:'absolute',
    top:300,
    right:250,
    marginRight: 10,
    justifyContent: 'center',
    alignItems: 'center',
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 3,
    },
    shadowOpacity: 0.5,
    shadowRadius: 4,
    elevation: 5,
    // Adding larger darker bottom part
    borderBottomColor: 'rgba(0,0,0,0.2)',
    borderBottomWidth: 5,
  },
  AmistadbuttonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
    textTransform: 'uppercase',
    // Adding text shadow to create black outline
    textShadowColor: 'black',
    textShadowOffset: { width: 2, height: 1 },
    textShadowRadius: 2,
  },
  // Chat button styles
  chatButton: {
    position: 'absolute',
    bottom: 10,
    right: 500,
    backgroundColor: '#007bff',
    borderRadius: 80,
    width: 80,
    height: 80,
    justifyContent: 'center',
    alignItems: 'center',
    
  },
  chatButtonText: {
    color: 'white',
    fontWeight: 'bold',
    marginLeft: 0,
    fontWeight: 'bold',
    textTransform: 'uppercase',
    // Adding text shadow to create black outline
    textShadowColor: 'black',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 1,
  },
  // amigos button styles
  amigosButton: {
    position: 'absolute',
    bottom: 30,
    left: 30,
    backgroundColor: 'silver',
    borderRadius: 80,
    width: 80,
    height: 80,
    justifyContent: 'center',
    alignItems: 'center',
    
  },
  amigosButtonText: {
    color: 'white',
    fontWeight: 'bold',
    marginLeft: 0,
    textTransform: 'uppercase',
    // Adding text shadow to create black outline
    textShadowColor: 'black',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 1,
  },
  // Tienda button styles
  tiendaButton: {
    position: 'absolute',
    top: 100,
    right: 20,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'green',
    borderRadius: 25,
    paddingVertical: 8,
    paddingHorizontal: 10,
    // Adding 3D effect
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 3,
    },
    shadowOpacity: 0.5,
    shadowRadius: 4,
    elevation: 5,
    // Adding larger darker bottom part
    borderBottomColor: 'rgba(0,0,0,0.2)',
    borderBottomWidth: 5,
  },
  tiendaButtonText: {
    color: 'white',
    fontWeight: 'bold',
    marginLeft: 5,
    textTransform: 'uppercase',
    // Adding text shadow to create black outline
    textShadowColor: 'black',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 1,
  },
  notificacionesButton: {
    position: 'absolute',
    bottom: 10,
    left: 550,
    backgroundColor: '#556b2f',
    borderRadius: 40,
    width: 150,
    height: 80,
    justifyContent: 'center',
    alignItems: 'center',
    // Adding shadow
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 3,
    },
    shadowOpacity: 0.5,
    shadowRadius: 4,
    elevation: 5,
    // Adding larger darker bottom part
    borderBottomColor: 'rgba(0,0,0,0.2)',
    borderBottomWidth: 5,
  },
  notificacionesButtonText: {
    color: 'white',
    fontWeight: 'bold',
    marginLeft: 0,
    textTransform: 'uppercase',
    // Adding text shadow to create black outline
    textShadowColor: 'black',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 1,
  },
  popupBackdrop: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(255, 255, 255, 0.5)', // translucent white background
    justifyContent: 'center',
    alignItems: 'center',
  },
  popupContainer: {
    backgroundColor: 'white',
    padding: 20,
    borderRadius: 10,
    height:300,
    width:400,
    flex: 1,
  },
  popupText: {
    fontSize: 18,
    marginBottom: 10,
  },
  
  
});

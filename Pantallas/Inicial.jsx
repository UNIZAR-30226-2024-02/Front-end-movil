import React, { useState, useEffect } from 'react';
import { View, TouchableOpacity, ScrollView,Text, StyleSheet, ImageBackground } from 'react-native';
import { FontAwesome } from '@expo/vector-icons'; // Import FontAwesome from expo/vector-icons
import { IP } from '../config';
import { useFocusEffect } from '@react-navigation/native'; // Import useFocusEffect hook
import axios from 'axios';


export default function Inicial({ navigation, route }) {
  const { id, token } = route.params;
  const [showPopup, setShowPopup] = useState(false);
  const [friendrequests, setFriendRequests] = useState([]);
  const [invitaciones, setInvitacionesData] = useState([]);


  const fetchData = async () => {
    try {
      const response = await axios.get(IP+'/amistad/listarSolicitudes', {
        headers: {
          Authorization: token,
        },
      });
      const responseData = response.data;
      setFriendRequests(responseData.solicitudes);
    } catch (error) {
      console.error('Error fetching friendship:', error);
    }
  };

  const fetchInvitations = async () => {
    try {
      const response = await axios.get(IP+'/partidas/invitaciones', { headers: {'Authorization': `${token}` } });
      const invitacionesData = await Promise.all(response.data.Partidas.map(async partida => {
        try {
          if (partida != null) {
            const partidaInvitedInfoResponse = await axios.get(`${IP}/partidas/partida/${partida._id}`, { headers: { 'Authorization': token } });
            return partidaInvitedInfoResponse.data;
          }
          return null;
        } catch (error) {
          console.error('Error fetching partida info:', error);
          return null; // Returning null for failed requests
        }
      }));
  
      // Filter out null values and flatten the array
      const flattenedInvitacionesData = invitacionesData.filter(partida => partida !== null).flat();
  
      setInvitacionesData(flattenedInvitacionesData);
    } catch (error) {
      console.error('Error fetching invitations:', error);
      Alert.alert('Error', 'Ha ocurrido un error al obtener las invitaciones. Por favor, inténtalo de nuevo más tarde.');
    }
  };

  useEffect(() => {
    fetchData();
    fetchInvitations();
  }, [token]);

  // Use useFocusEffect to refetch data when the screen comes into focus
  useFocusEffect(
    React.useCallback(() => {
      fetchData();
    }, [])
  );

  const handleSolicitudPress = (user) => {
    navigation.navigate('SolicitudDetails', { solicitante: user, token: token });
  };

  const handlePartidaPress = (id) => {
    navigation.navigate('Partida', { id,token }); // Navigate to Partida component with id as a parameter
  };

  const goToCrearPartida = () => {
    // Navigate to "Crear Partida" screen
    navigation.navigate('Lobby', { id: id, token: token });
  };

  const goToNotificaciones = () => {
    setShowPopup(true);
  };
  
  const goToRanking = () => {
    // Navigate to "Ranking" screen
    navigation.navigate('Ranking', { token: token });
  };

  const goToTienda = () => {
    // Navigate to "Tienda" screen
    navigation.navigate('Tienda', { token: token });
  };

  const goToPerfil = () => {
    // Navigate to "Perfil" screen
    navigation.navigate('Perfil', { id: id, token: token });
  };


  const goToMap = () => {
    // Navigate to "Perfil" screen
    navigation.navigate('RiskMap', { token: token });
  }

  const goToChats = () => {
    // Navigate to "Chats" screen
    navigation.navigate('MyChats', { token: token });
  };

  const goToAmigos = () => {
    // Navigate to "Chats" screen
    navigation.navigate('MisAmigos', { token: token });
  };

  const goToAmistad = () => {
    // Navigate to "Chats" screen
    navigation.navigate('Amistad', { token: token });
  };


  return (
    <ImageBackground source={require('../assets/guerra.jpg')} style={styles.backgroundImage} resizeMode="stretch">
      <View style={styles.container}>
          <TouchableOpacity style={styles.Lobbybutton} onPress={goToCrearPartida}>
          <FontAwesome name="gamepad" size={24} color="white" />
            <Text style={styles.LobbybuttonText}>Partidas</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.Rankingbutton} onPress={goToRanking}>
          <FontAwesome name="trophy" size={24} color="white" />
            <Text style={styles.RankingbuttonText}>Ranking</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.Perfilbutton} onPress={goToPerfil}>
          <FontAwesome name="user" size={24} color="white" />
            <Text style={styles.PerfilbuttonText}>Perfil</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.Mapabutton} onPress={goToMap}>
            <Text style={styles.AmistadbuttonText}>MapaXD</Text>
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
          {(friendrequests.length > 0 || invitaciones.length > 0) && (
            <View style={styles.notificationIndicator} />
          )}
        </TouchableOpacity>

        {showPopup && (
          <TouchableOpacity style={styles.popupBackdrop} onPress={() => setShowPopup(false)}>
            <View style={styles.popupContainer}>
            <ScrollView contentContainerStyle={styles.scrollViewContent}>
              {friendrequests.map((userId) => (
                <TouchableOpacity
                  key={userId}
                  style={styles.notificationButton}
                  onPress={() => handleSolicitudPress(userId)}>
                  <View style={styles.notificationContent}>
                    <Text style={styles.notificationButtonText}>Solicitud de amistad de {userId}</Text>
                  </View>
                </TouchableOpacity>
              ))}
              {invitaciones.map((userId) => (
                <TouchableOpacity
                  key={userId}
                  style={styles.notificationButton}
                  onPress={() => handlePartidaPress(userId)}>
                  <View style={styles.notificationContent}>
                    <Text style={styles.notificationButtonText}>Invitacion a partida de {userId}</Text>
                  </View>
                </TouchableOpacity>
              ))}
            </ScrollView>

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
    marginBottom: 20,
  },
  backgroundImage: {
    flex: 1,
    resizeMode: 'cover',
    justifyContent: 'center',
  },
  Lobbybutton: {
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
  LobbybuttonText: {
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
  },
  popupText: {
    fontSize: 18,
    marginBottom: 10,
  },
  
  
});

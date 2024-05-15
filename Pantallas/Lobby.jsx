import React, { useState, useEffect } from 'react';
import { View, Text, Image, TextInput, StyleSheet, ToastAndroid, Alert, TouchableOpacity, ImageBackground} from 'react-native';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import axios from 'axios';
import { IP } from '../config';
import io from 'socket.io-client';
import { images } from '../assets/Skins_image'
import AsyncStorage from '@react-native-async-storage/async-storage';
import ModalChat from './ModalChat';

const Lobby = ({ navigation, route }) => { // Partida and session token are passed as props
    const { userid, id, token } = route.params
    const [socket, setSocket] = useState('')
    const [partidaData, setPartidaData] = useState(null)
    const [username, setUsername] = useState('')
    const [jugadores, setJugadores] = useState(null)
    const [invitado, setInvitado] = useState('')
    const [mensaje, setMensaje] = useState('')
    const [chatVisible, setChatVisible] = useState(false)
    const [chat, setChat] = useState(null) // TODO: implementar chat, es trivial
    const [gameStarted, setGameStarted] = useState(null);
    const [userExited, setUserExited] = useState(null);
    const [userJoined, setUserJoined] = useState(null);
    const [chatMessage, setChatMessage] = useState(null);

    useEffect(() => {
        setSocket(io(IP))
    }, [])

    useEffect(() => {
        if (partidaData) {
            fetchJugadores()
        }
    }, [partidaData])

    useEffect(() => {
        if (socket) {
            if (!partidaData) {
                fetchPartidaData()
            }

            // TODO: Socket del chat, si se implementa en esta pantalla
            // lo he dejado preparado para que cuando se implemente sea simplemente des-comentar esto
            /* socket.on('chatMessage', (mensaje, user, timestamp, chatId) => {
                console.log('chatMessage', mensaje, user, timestamp, chatId)
                setChatMessage({ mensaje, user, timestamp, chatId })
            }) */

            socket.on('userJoined', (user) => {
                console.log('userJoined', user)
                ToastAndroid.show(`${user} se ha unido a la partida`, ToastAndroid.SHORT)
                /*this.userService.getUserSkin(user).subscribe(response => {
                this.users[user] = response.path
                this.partida.jugadores.push({ usuario: user, territorios: [], cartas: [], abandonado: false, _id: '', skinFichas: '', color: ''})
                })// Para las skins*/
                setUserJoined(user)
            })

            socket.on('userDisconnected', (user) => {
                console.log('userDisconnected', user)
                ToastAndroid.show(`${user} ha abandonado la partida`, ToastAndroid.SHORT)
                setUserExited(user)
            })
            socket.on('gameStarted', (gameId) => {
                console.log('gameStarted', gameId)
                setGameStarted(gameId); // Store the gameId in state
            })
        }
    }, [socket])

    // gestión del ilegítimo estado de israel
    useEffect(() => {
        if (gameStarted && partidaData) {
            // If a game has started and partidaData is not null, navigate to RiskMap
            navigation.navigate('RiskMap', { token: token, partida: partidaData, socket: socket})
        }
    }, [gameStarted, partidaData])

    useEffect(() => {
        if (userExited && partidaData && jugadores) { 
            ToastAndroid.show(`${userExited} ha abandonado la partida`, ToastAndroid.SHORT)
            for(let i = 0; i < jugadores.length; i++) {
                if (jugadores[i][0] === userExited) {
                    jugadores.splice(i, 1)
                    break
                }
            }
            setUserExited(null);
        }
    }, [userExited, partidaData, jugadores])

    useEffect(() => {
        if(userJoined && jugadores){
            ToastAndroid.show(`${userJoined} se ha unido a la partida`, ToastAndroid.SHORT)
            jugadores.push([userJoined, ''])
            setUserJoined(null);
        }
    }, [userJoined, jugadores])

    /*useEffect(() => {
        if(chatMessage && partidaData && chat){
            chat.mensajes.push({texto: chatMessage.mensaje, idUsuario: chatMessage.user, timestamp: chatMessage.timestamp})
            setChatMessage(null)
        }
    }, [chatMessage, partidaData, chat])*/

    const fetchPartidaData = async () => {
        try {
            const response = await axios.get(`${IP}/partidas/partida/${id}`, { headers: { 'Authorization': token } })
            const storedUsername = await AsyncStorage.getItem('username');
            setUsername(storedUsername);
            socket.emit('joinChat', response.data.chat._id);
            console.log('Joining chat:', response.data._id)
            socket.emit('joinGame', { gameId: response.data._id, user: storedUsername });
            setPartidaData(response.data)
            this.partida = response.data;
        } catch (error) {
            console.error('Error fetching partida data:', error)
            Alert.alert('Error', 'Ha ocurrido un error al obtener los datos de la partida. Por favor, inténtalo de nuevo más tarde.')
        }
    };

    const fetchJugadores = async () => {
        try {
            const userRequests = partidaData.jugadores.map(async (jugador) => 
                axios.get(`${IP}/misSkins/obtenerAvatar/${jugador.usuario}`, { headers: { 'Authorization': token } })
            )
            let newJugadores = [];
            axios.all(userRequests)
            .then(responses => {
                responses.forEach((response, index) => {
                    newJugadores.push([partidaData.jugadores[index].usuario, response.data.path])
                })
                setJugadores(newJugadores)
            })
            .catch(error => {
                console.error(error)
            });
        } catch (error) {
            console.error('Error fetching partida data:', error)
            Alert.alert('Error', 'Ha ocurrido un error al obtener los datos de la partida. Por favor, inténtalo de nuevo más tarde.')
        }
    }

    const empezarPartida = () => {
        console.log(this.partidaId)
        axios.put(`${IP}/partida/iniciarPartida`, { idPartida: id }, { headers: { 'Authorization': token } })
        .then(response => {
            if (response.status === 200) {
                
                socket.emit('gameStarted', id)
                console.log(id)
                console.log(token)
                console.log(partidaData)
                navigation.navigate('RiskMap', { token: token, partida: partidaData, socket: socket }) //Envio token y partida a mapa
            } else {
                console.error('Error al empezar la partida:', response.data.message);
                Alert.alert('Error', 'Ha ocurrido un error al empezar la partida. Por favor, inténtalo de nuevo más tarde.');
            }
        })
        .catch(error => {
            console.error(error)
        })
    }

    const confirmSalirPartida = () => {
        Alert.alert(
            "Confirmación",
            "¿Estás seguro de que deseas abandonar la partida?",
            [
                { text: "Cancel" },
                { text: "OK", onPress: () => salirPartida() }
            ]
        )
    }

    const salirPartida = () => {
        axios.put(`${IP}/partida/salirPartida`, { idPartida: id }, { headers: { 'Authorization': token } })
        .then(response => {
            if (response.status === 200) {
                socket.emit('disconnectGame', { gameId: id, user: username })
                navigation.navigate('Partidas', {userid: userid, token: token });
            } else {
                console.error('Error al salir de la partida:', response.data.message);
                Alert.alert('Error', 'Ha ocurrido un error al salir de la partida. Por favor, inténtalo de nuevo más tarde.');
            }
        })
        .catch(error => {
            console.error(error)
        })
    }

    const invitar = () => {
        axios.put(`${IP}/nuevaPartida/invite`, { user: invitado, idPartida: id }, { headers: { 'Authorization': token } })
        .then(response => {
            if (response.status === 200) {
                ToastAndroid.show('Invitación enviada con éxito al jugador ' + invitado, ToastAndroid.SHORT)
                socket.emit('inviteGame', { gameId: id, user_dest: invitado, user_from: username})
            } else {
                console.error('Error al invitar a la partida:', response.data.message);
                Alert.alert('Error', 'Ha ocurrido un error al invitar a la partida. Por favor, inténtalo de nuevo más tarde.');
            }
        })
        .catch(error => {
            console.error(error)
        })
    }

    const enviarMensaje = () => {
        axios.post(`${IP}/chats/enviarMensaje`, { OID: partidaData.chat._id, textoMensaje: mensaje }, { headers: { 'Authorization': token } })
        .then(response => {
            if (response.status === 200) {
                partidaData.chat.mensajes.push({texto: mensaje, idUsuario: username , timestamp: new Date().toISOString()})
                socket.emit('sendChatMessage', { chatId: partidaData.chat._id, message: mensaje, user: username, timestamp: new Date().toISOString()})
            } else {
                console.error('Error al enviar mensaje al chat:', response.data.message)
                Alert.alert('Error', 'Ha ocurrido un error al enviar mensaje al chat. Por favor, inténtalo de nuevo más tarde.')
            }
        })
        .catch(error => {
            console.error(error)
        })
    }
    return (
        partidaData === null ? <Text>Loading...</Text> :
        <ImageBackground source={require('../assets/guerra.jpg')} style={styles.backgroundImage} resizeMode="stretch">
          <View style={styles.container}>
            <View style={styles.leftColumn}>
              <Text style={styles.titleInvitar}>Invitar a un jugador</Text>
              <TextInput
                style={styles.inputInvitar}
                placeholder="Nombre del jugador"
                value={invitado}
                onChangeText={setInvitado}
              />
              <TouchableOpacity style={styles.normalButton} onPress={invitar}>
                <Text style={styles.buttonText}>Invitar</Text>
              </TouchableOpacity>
            </View>
            <View style={styles.middleColumn}>
              <View style={styles.titleContainer}>
                <Text style={styles.title}>{partidaData && partidaData.nombre}</Text>
                <Text style={styles.subTitle}>Max Jugadores: {partidaData && partidaData.maxJugadores}</Text>
              </View>
              <View style={styles.jugadoresContainer}>
                {jugadores ? (jugadores.map(jugador => (
                  <View key={jugador[0]}>
                    <Text key={jugador[0]} style={styles.jugador}>{jugador[0]}</Text>
                  </View>
                ))) : (<Text>Loading...</Text>)}
              </View>
              <View style={styles.buttonContainer}>
                <TouchableOpacity style={styles.empezarButton} onPress={empezarPartida}>
                  <Text style={styles.buttonText}>Empezar</Text>
                </TouchableOpacity>
                <View style={{ margin: 10 }} />
                <TouchableOpacity style={styles.salirButton} onPress={confirmSalirPartida}>
                  <Text style={styles.buttonText}>Abandonar</Text>
                </TouchableOpacity>
              </View>
            </View>
            <View style={styles.rightColumn}>
              <TouchableOpacity style={styles.chatButton} onPress={()=>setChatVisible(true)}>
                <FontAwesome name="comments" size={24} color="white" />
                <Text style={styles.chatButtonText}>Chat</Text>
              </TouchableOpacity>
            </View>
          </View>
          <ModalChat socket={socket} whoami={username} chat={partidaData ? partidaData.chat : null} onClose={()=>setChatVisible(false)} token={token} isVisible={chatVisible} />
        </ImageBackground>
      );
      
      
    }
    
    const styles = StyleSheet.create({
        container: {
          flex: 1,
          justifyContent: 'center',
          alignItems: 'center',
          backgroundColor: 'rgba(128, 128, 128, 0.5)', // Semi-transparent gray
        },
        middleColumn:{
            bottom:150,
        },
        leftColumn:{
            top:100,
            right:230,
        },
        rightColumn:{
            top:100,
            left:0,
        },
        backgroundImage: {
          flex: 1,
          width: '100%',
          height: '100%',
        },
        titleContainer: {
          alignItems: 'center',
          marginBottom: 20,
        },
        title: {
          fontSize: 30,
          fontWeight: 'bold',
        },
        titleInvitar: {
          fontSize: 22,
          fontWeight: 'bold',

        },
        invitarContainer: {
          position: 'absolute',
          bottom: 20,
          right: 20,
          backgroundColor: 'rgba(255, 255, 255, 0.8)', // Adjust opacity if needed
          padding: 20,
          borderRadius: 10,
          alignItems: 'center',
        },
        subTitle: {
          fontSize: 18,
          fontWeight: 'bold',
          marginBottom: 5,
        },
        jugadoresContainer: {
          marginTop: 5,
          marginLeft:100,
        },
        jugador: {
          fontSize: 16,
          marginBottom: 3,
        },
        buttonContainer: {
          flexDirection: 'row',
          justifyContent: 'center',
          marginTop:10,
        },
        empezarButton: {
          backgroundColor: 'green',
          padding: 10,
          borderRadius: 5,
          marginLeft: 10,
        },
        salirButton: {
          backgroundColor: 'red',
          padding: 10,
          borderRadius: 5,
          marginRight: 10,
        },
        buttonLeftContainer: {
          flexDirection: 'row',
          justifyContent: 'left',
        },
        normalButton: {
          backgroundColor: 'blue',
          padding: 10,
          borderRadius: 5,
          marginRight: 10,
          width:100,
        },
        chatButton: {
          position: 'absolute',
          bottom: 200,
          right: -300,
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
        messageContainer: {
          backgroundColor: '#f0f0f0', // light gray background
          padding: 10,
          marginBottom: 10,
          borderRadius: 5,
          alignSelf: 'flex-start', // align to the left
        },
        messageText: {
          fontSize: 16,
        },
        input: {
          width: '80%',
          borderWidth: 1,
          borderColor: '#ccc',
          padding: 10,
          marginBottom: 10,
          borderRadius: 5,
        },
        inputInvitar: {
          width: '80%',
          borderWidth: 1,
          borderColor: '#ccc',
          padding: 10,
          backgroundColor:'white',
          marginBottom: 30,
          marginRight:50,
          borderRadius: 5,
          marginTop:10,
        },
      });
      


    export default Lobby;
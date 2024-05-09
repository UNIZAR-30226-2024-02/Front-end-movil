import React, { useState, useEffect } from 'react';
import { View, Text, Image, TextInput, StyleSheet, ToastAndroid, Alert, TouchableOpacity } from 'react-native';
import axios from 'axios';
import { IP } from '../config';
import io from 'socket.io-client';
import { images } from '../assets/Skins_image'
import AsyncStorage from '@react-native-async-storage/async-storage';

const Lobby = ({ navigation, route }) => { // Partida and session token are passed as props
    const { id, token } = route.params
    const [socket, setSocket] = useState('')
    const [partidaData, setPartidaData] = useState(null)
    const [username, setUsername] = useState('')
    const [jugadores, setJugadores] = useState(null)
    const [invitado, setInvitado] = useState('')
    const [mensaje, setMensaje] = useState('')
    // const [chat, setChat] = useState(null) // TODO: implementar chat, es trivial 
    //gestión del estado (no el de israel)
    const [gameStarted, setGameStarted] = useState(null);
    const [userExited, setUserExited] = useState(null);
    const [userJoined, setUserJoined] = useState(null);
    const [chatMessage, setChatMessage] = useState(null);

    useEffect(() => {
        setSocket(io(IP))
    }, [])

    useEffect(() => {
        if (partidaData) {
            fetchJugadores();
        }
    }, [partidaData]);

    useEffect(() => {
        if (socket) {
            fetchPartidaData()

            // TODO: Socket del chat, si se implementa en esta pantalla
            // lo he dejado preparado para que cuando se implemente sea simplemente des-comentar esto
           /* socket.on('chatMessage', (mensaje, user, timestamp, chatId) => {
                console.log('chatMessage', mensaje, user, timestamp, chatId)
                setChatMessage({ mensaje, user, timestamp, chatId })
            }) */

            socket.on('userJoined', (user) => {
                console.log('userJoined', user)

                /*this.userService.getUserSkin(user).subscribe(response => {
                this.users[user] = response.path
                this.partida.jugadores.push({ usuario: user, territorios: [], cartas: [], abandonado: false, _id: '', skinFichas: '', color: ''})
                })// Para las skins*/
                // use setjugadores for the new user with an empty image path
                setUserJoined(user);
            })
        
            socket.on('userDisconnected', (user) => {
                console.log('userDisconnected', user)
                setUserExited(user);
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
            navigation.navigate('RiskMap', { token: token, partida: partidaData })
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
                navigation.navigate('RiskMap', { token: token, partida: partidaData }) //Envio token y partida a mapa
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
                navigation.navigate('Partidas', { token: token });
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
        <View>
        {partidaData ? (
            <View>
                <Text style={styles.title}>{partidaData.nombre}</Text>
                <Text style={styles.subTitle}>Max Jugadores: {partidaData.maxJugadores}</Text>
                <View style={styles.jugadoresContainer}>
                    {jugadores ? (jugadores.map(jugador => (
                        <View key={jugador[0]}>
                            <Text key={jugador[0]} style={styles.jugador}>{jugador[0]}</Text>
                            {
                                //<Image source={{ uri: jugador[1] }} style={{ width: 50, height: 50 }} /> TODO: implementar skins
                            }
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
                <View>
                    <Text style={styles.title}>Invitar a un jugador</Text>
                    <TextInput
                        style={styles.input}
                        placeholder="Nombre del jugador"
                        value={invitado}
                        onChangeText={setInvitado}
                    />
                    <View style={styles.buttonLeftContainer}>
                        <TouchableOpacity style={styles.normalButton} onPress={invitar}>
                            <Text style={styles.buttonText}>Invitar</Text>
                        </TouchableOpacity>
                    </View>
                </View>
                <View>
                    <Text style={styles.title}>Chat de la partida</Text>
                    {partidaData.chat.mensajes.map((mensaje, index) => ( // TODO: pensar qué hacer con el chat
                        <View key={index} style={styles.messageContainer}>
                            <Text style={styles.messageText}>{mensaje.idUsuario}:</Text>
                            <Text style={styles.messageText}>{mensaje.texto}</Text>
                            <Text style={styles.messageText}>{mensaje.timestamp}:</Text>
                        </View>
                    ))}
                    <TextInput
                        style={styles.input}
                        placeholder="Escribe un mensaje..."
                        value={mensaje}
                        onChangeText={setMensaje}
                    />
                    <View style={styles.buttonLeftContainer}>
                        <TouchableOpacity style={styles.normalButton} onPress={enviarMensaje}>
                            <Text style={styles.buttonText}>Enviar</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </View>
        ) : (
            <Text>Loading...</Text>
        )}
        </View>
  );
}

const styles = StyleSheet.create({
    container: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
    },
    title: {
      fontSize: 24,
      fontWeight: 'bold',
      marginBottom: 10,
    },
    subTitle: {
      fontSize: 18,
      fontWeight: 'bold',
      marginBottom: 5,
    },
    jugadoresContainer: {
      marginTop: 5,
    },
    jugador: {
      fontSize: 16,
      marginBottom: 3,
    },
    button: {
      marginTop: 20,
      backgroundColor: '#4CAF50',
      paddingVertical: 15,
      paddingHorizontal: 30,
      borderRadius: 8,
    },
    buttonText: {
      color: 'white',
      fontSize: 16,
      fontWeight: 'bold',
    },
    buttonContainer: {
      flexDirection: 'row',
      justifyContent: 'center',
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
});

export default Lobby;
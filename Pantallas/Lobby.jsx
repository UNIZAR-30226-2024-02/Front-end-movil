import React, { useState, useEffect } from 'react';
import { View, Text, Image, TextInput, StyleSheet, Alert, TouchableOpacity } from 'react-native';
import axios from 'axios';
import { IP } from '../config';
import io from 'socket.io-client';
import { images } from '../assets/Skins_image'

const Lobby = ({ navigation, route }) => { // Partida and session token are passed as props
    const { id, token } = route.params
    const socket = io(IP); // Update the URL with your server URL
    const [partidaData, setPartidaData] = useState(null);
    const [jugadores, setJugadores] = useState(null)
    const [invitado, setInvitado] = useState('');
    const [mensaje, setMensaje] = useState('');

    useEffect(() => {
        fetchPartidaData()
    }, [])

    useEffect(() => {
        if (partidaData) {
            fetchJugadores();
        }
    }, [partidaData]);

    const fetchPartidaData = async () => {
        try {
            const response = await axios.get(`${IP}/partidas/partida/${id}`, { headers: { 'Authorization': token } })
            // TODO: emitir a los sockets de la partida y el chat
            //this.socket.emit('joinChat', this.chat._id);
            //this.socket.emit('joinGame', { gameId: this.partida._id, user: this.userService.getUsername() });
            setPartidaData(response.data)
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
                socket.emit('gameStarted', id);
                console.log(id)
                console.log(token)
                navigation.navigate('RiskMap', { token: token, partida: partidaData });//Envio token y partida a mapa
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
                //this.socket.emit('disconnectGame', { gameId: id, user:  }) TODO
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
                Alert.alert('Invitación enviada con éxito al jugador ' + invitado);
                //this.socket.emit('inviteGame', { gameId: id, user_dest: invitado, user_from: this.userService.getUsername()}) TODO
            } else {
                console.error('Error al invitar a la partida:', response.data.message);
                Alert.alert('Error', 'Ha ocurrido un error al invitar a la partida. Por favor, inténtalo de nuevo más tarde.');
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
                                //<Image source={{ uri: jugador[1] }} style={{ width: 50, height: 50 }} />
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
                    {partidaData.chat.mensajes.map((mensaje, index) => ( // TODO: pensar qué hacer con el chat y TODO: implementar enviar mensaje
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
                        <TouchableOpacity style={styles.normalButton}>
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
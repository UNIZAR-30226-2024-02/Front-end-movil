import React, { useRef, useState } from 'react';
import { View, ScrollView, Image, StyleSheet, TouchableOpacity, Text as Text1, ToastAndroid, Alert, Modal, Pressable } from 'react-native';
import axios from 'axios';
import { IP } from '../config';
import Svg, { Defs, G, Path, Circle, Use, Text as Text2 , TSpan } from "react-native-svg"
import Risk from '../assets/Risk_game_board.svg'
import { useEffect } from 'react';
import { ReactNativeZoomableView } from '@openspacelabs/react-native-zoomable-view';
import io from 'socket.io-client';
import  FontAwesome  from '@fortawesome/react-native-fontawesome';
import AsyncStorage from '@react-native-async-storage/async-storage'
import { useNavigation } from '@react-navigation/native';
import ModalChat from './ModalChat';

import Dialog from "react-native-dialog";

export default function RiskMap({ naviagation, route }) {
  //const [socket, setSocket] = useState('')
  const navigation = useNavigation();
  const [whoami, setWhoami] = useState(null);
  const [chatVisible, setChatVisible] = useState(false);
  const { token, partida, socket } = route.params;
  
  const [thisPartida, setThisPartida] = useState(null);
  //const [partida, setPartida] = useState(null);
  const [mapa, setMapa] = useState(null);

  const [usoCartas, setUsoCartas] = useState(false);

  const [modalVisible, setModalVisible] = useState(false);
  const [abandonarVisible, setAbandonarVisible] = useState(false);

  const [state, setState] = useState({
    message: '',
  });

  const [numterritoriosTropas, setnumterritoriosTropas] = useState(0);
  const [visible, setVisible] = useState(false);
  const [dialogState, setDialogState] = useState({visible: false, title: '', type: ''});

  const [isOk, setOkState] = useState("No");
  const [isPaused, setIsPaused] = useState(false);
  const [ganador, setGanador] = useState(null);
  let eloGanado = 0; let puntosGanados = 0;

  const [newClicked, setNewClicked] = useState(false);
  const [territorioName, setTerritorioName] = useState('');
  const [seleccionadoAtaque, setAtaqueReady] = useState(false);
  
  useEffect(() => {
    //setSocket(io(IP))
   
    //COMENTADO PARA PRUEBAS SIN VENIR DEL LOBBY
    //console.log(partida)
    //setIdPartida(partida._id);
    setThisPartida(partida);
    onLoad();
    //return () => socket.disconnect();
  }, []);

  useEffect(() => {
    if (socket) {
      socket.on('cambioEstado', async () => {
          onLoad()
            //await new Promise(resolve => setTimeout(resolve, 1000)) // espero un rato

          //limpiarTropas() // TODO

          //Pinto el mapa
          //distribuirPiezas() // TODO
      });
      socket.on('partidaPausada', async () => {
        let paused = isPaused; let txt = ''; if(isPaused) txt = 'resumida'; else txt = 'pausada';
        setIsPaused(!isPaused);
        Alert.alert('Partida ' + txt);
        
      });

      socket.on('gameOver',(posibleGanador) => {
        /*if(posibleGanador === whoami){
          Alert.alert('¡Has ganado la partida!');
          eloGanado+=200; puntosGanados+=200;
        }*/
        setGanador(posibleGanador);
      });

      socket.on('ataqueRecibido', (userOrigen, userDestino, dadosAtacante, dadosDefensor, 
        tropasPerdidasAtacante, tropasPerdidasDefensor, conquistado,
        territorioOrigen, territorioDestino, eloAtacante, 
        eloDefensor, dineroAtacante, dineroDefensor) => {
          console.log("Ataque recibido")
          Alert.alert(
            "Ataque recibido",
            `Origen: ${userOrigen}\n` +
            `Destino: ${userDestino}\n` +
            `Dados Atacante: ${dadosAtacante}\n` +
            `Dados Defensor: ${dadosDefensor}\n` +
            `Tropas Perdidas Atacante: ${tropasPerdidasAtacante}\n` +
            `Tropas Perdidas Defensor: ${tropasPerdidasDefensor}\n` +
            `Conquistado: ${conquistado ? 'Sí' : 'No'}\n` +
            `Territorio Origen: ${territorioOrigen}\n` +
            `Territorio Destino: ${territorioDestino}\n` +
            `Elo Atacante: ${eloAtacante}\n` +
            `Elo Defensor: ${eloDefensor}\n` +
            `Dinero Atacante: ${dineroAtacante}\n` +
            `Dinero Defensor: ${dineroDefensor}`
        );
            
      });


    } 
  }, [socket])


useEffect(() => {
    if (ganador !== null) {
        Alert.alert(
            `El ganador es ${ganador}`,
            ganador === whoami ? '¡Has ganado la partida!' : '',
            [
                {
                    text: 'OK',
                    onPress: () => navigation.navigate('Partidas', { token: token })
                }
            ]
        );
        if(ganador === whoami){
            eloGanado+=200; puntosGanados+=200;
        }
    }
}, [ganador]);

  /*
  *
  *  Esto el svg, en react native no puedes meter directamente un svg, por lo que se tiene que hacer un componente que lo renderize
  *  Lo meto aqui para que el acceso a los datos sea mas facil.
  * 
  *  Los territorios no he logrado identificarlos de ninguna otra manera mas que por el nombre y a pelo como esta aqui
  *  Es un coñazo, pero es lo que hay
  * 
  */


  //Esta fundion sirve para buscar el numero de tropas en un territorio y represetarlo en el svg
  const findTropas = (key) => {
    if (thisPartida) {
      const territorios = thisPartida.mapa.flatMap(continent => continent.territorios);
      if (territorios) {
        const territorio = territorios.find(territorio => territorio.nombre === key)
        if (territorio) {
          return territorio.tropas
        }
      }
    }
  }

  const findColor = (key) => {
    if (thisPartida) {
      const user = thisPartida.jugadores.find(jugador => jugador.territorios.includes(key))

      if (user) {
        return makeRGB(user.color)
      }
    }
    else
      return "#000";
  }

  const makeRGB = (color) => {
    switch (color) {
      case "verde":
        return "#0f0"
      case "rojo":
        return "#f00"
      case "azul":
        return "#0ff" // Cian, con el azul se ve mal el número de tropas
      case "amarillo":
        return "#ff0"
      case "rosa":
        return "#f0f"
      case "morado":
        return "#808"
      default:
        return "#000"
    }
  }

  const MapSVGComponent = (props) => (
    false ? <Risk/> :
      <Svg
    xmlns="http://www.w3.org/2000/svg"
    xmlnsXlink="http://www.w3.org/1999/xlink"
    viewBox="182 114 720 405"
    {...props}
  >
    <Defs>
      <G id="a" fill="#fff" strokeLinejoin="round">
        <Path
        id="b"
        //ALASKA
          fill="#cc9" 
          d="M254 242c-1-1 0 0-1-2 0-2-1-2-2-3 0 0-1 0-1-2 1-1 1-1 1-2l-3-3v-2c0-1 0-2-1-2-2-1-3 1-4-1 0-2 0-1-2-1-1 0-2 0-2-1-1-1-1-2-2-2s-2 0-3-1c0-1-1-2-2-2s-1 0-2 1c-2 0 2 1-1 2s-4 1-5 0c0 0-3 1-2 0 0-2 0-2 1-3 1 0 2 0 2-1-1 0-1-1-3 0-3 0-4 0-5 1s-1 2-1 3c0 0 1 0-2 1-3 2-1 0-4 2-3 3-2 3-4 4-3 0-1 0-3 2-2 1-1 2-3 2s-1 3-3 1-3-1-1-2c1-1 1-1 2-1s1 0 2-1c1-2 1-2 2-3 2 0 2 2 3 0 0-3 0-3 1-4s3-2 1-3c-2 0-2 0-3 1-2 0-2 1-4 1-1-1-2-1-2-1v-3s1-1-1-1c-2-1-2 1-2-1 0-1 1-1 0-2s-1-1-2-1c-1 1-3 2-2 0s2-2 3-3c0-1 1-3 1-4 1-1-1-1 1-2 1-1 1-1 3-1s1 0 2 1c2 0 2 1 3 0l2-2 1-1c0-1 1-2-1-1-1 0-1 0-2 1-2 0-2 1-3 0-1-2-1-3-1-3v-1c0-2-1-5 2-6s5 0 6 0c0 1-1 1 0 2 2 0 2 0 3-1 0-1 1-1 0-2-1 0-1 0-2-1v-3l-2-2c0-1-2-3 0-4 3 0 5-1 5-1s2-3 4-2c2 0 4 0 6-2 2-1 4 0 4 0l3 1s2 3 4 2 2 2 5 2c3 1 5 1 8 2 0 0 1 0 1 1-1 1-2 31-2 31l8 1v2c1 1 1 2 2 4 2 2 1 8 1 8l2 3s1 1 2 1v4c0 2-2 1-2 1-1 1-2 3-2 4s-2 1-2 1Z"
          onPress={stateMachine.bind(this, 0, "ALASKA")}/>
        <Circle
          fill={findColor("ALASKA")}
          cx="223" cy="210" r="10"
        />
        <Text2
          x="223" y="210" text-anchor="middle" fill="black">{findTropas("ALASKA")}
        </Text2>
        <Path
        //ALBERTA
          fill="#cc6"
          d="M253 214v2c1 1 1 2 2 4 2 2 1 8 1 8l2 3s1 1 2 1v4c0 2-2 1-2 1-1 1-2 3-2 4s-2 1-2 1c1 1 2 1 2 3 1 3 1 2 1 3 1 1 2 1 2 3 1 2 1 1 2 3 1 3 0 4 0 6 1 3 2 2 3 3v1h48l4-48-63-2Z"
            onPress={stateMachine.bind(this, 1, "ALBERTA")}
        />
        <Circle
          fill={findColor("ALBERTA")}
          cx="280" cy="250" r="10"
        />
        <Text2
          x="280" y="250" text-anchor="middle" fill="black">{findTropas("ALBERTA")}
        </Text2>
        <Path
        //AMERICA CENTRAL
          fill="#ff3"
          d="M264 319s0 3 1 3h8l4 2s1 2 2 2h10c0 1 3 4 4 4s1 0 2 1c0 0 1 1 2 1h5v4c0 1-1 2-1 4-1 1-2 3-2 3 0 1 2 3 2 3-1 2-1 5 0 6v2l2 3s2 3 5 2c3 0 1 0 4-1 2-1 1 1 3-1 1-3 0-3 1-3 2-1 1-1 3-1 1 1 0 1 2 1s3-3 2 0v4c-1 1 0 0-1 2l-2 2c-1 0-1 0-1 1 0 2 0 2-1 3-1 0-2 0-2 1 0 2 0 2 1 3 1 0 2 0 2 1 1 2 1 3 1 3 0 1 0 3-1 3s-2 0-2 2c0 1 1 3 0 3 0 0-2-1-2 0v3l-1 1v2c0 1-1 2 0 2 2 0 2 1 3 0h2c0-1 1-2 2-2l2 1s1 1 1 2c-1 1 0 1 0 2 0 2 0 3-1 3v2c-1 0 0 0-1 1v1c-1 0 0 0-1-1 0 0 0-1-1-2s-1-1-2-1c-2-1-2-2-3-1-1 0 0 1-1 0-2-1-2-1-3-2v-1c-1-1-2 0-2-2 0-1 1-1 0-2 0-1-1-1-1-2v-4l-1-2v-2l-1-1-1-1c0-1-1-3-1-4-1-1-2-2-6-4-4-1-4-2-7-2-4-1-5-2-5-3 0-2 0-2-1-3-1 0-2 0-1-1 0-1 1-1 1-2 1-1 1-2 1-3 0 0 0-1-1-1-1-1-4-3-4-3s1-1-2 0c-4 0-4 2-5 1s1-5 0-6c-2-1-1 0-2-1-1-2 0-3-1-5 0-1 0 1-1-4-1-4 1-3-1-6-2-2-5-2-5-4v-6Z"
          onPress={stateMachine.bind(this, 2, "AMERICA CENTRAL")}
        />
        <Circle
          fill={findColor("AMERICA CENTRAL")}
          cx="286" cy="355" r="10"
        />
        <Text2
          x="286" y="355" text-anchor="middle" fill="black">{findTropas("AMERICA CENTRAL")}
        </Text2>
        <Path
        //ESTADOS UNIDOS DEL ESTE
          fill="#cc3"
          d="M326 264h6c1 0 0 5 0 5s4-2 6-1c3 1 5-3 6-1 0 3 1 4 2 5 0 1 1 2 2 5s1 5 0 7c0 1-2 3-1 4 2 0 3 2 4 3s5-3 5-4-1-2 0-2c1-1 3 0 3-1 1-1 2-2 3-2s4-1 4-1l2-1s10-1 11-2c2-1 2 0 2 0s-1-4 0-5c0 0 1 0 2-1 0-1 1-1 2 0 1 0 5 2 4 4 0 2-1 5 0 5 2 1 3 0 3 1s1 2 1 2c1 1 3 0 3 0 0-1-1 1-2 2 0 1-1 2-1 2-3 1-3 4-4 3 0-1-1-1-1-3 1-2 2-1 2-3-1-1 0-2-1-2s0 0-2 1c-1 0-1-1-3 1-1 2-1 1-2 2-1 0-1 1-1 2l-2 2v2c0 1 1 3 1 3l-1 2c-1 1-1-1-5 3-3 4-2 4-4 5s-2 1-2 2c0 0-2 1-1 2s0 1 1 2c1 0 2-1 2 1s-1 3-3 4c-2 2-5 6-7 6-3 1-4 2-4 3s0 3-1 3c-2 0-1 0-1 3s0 4 1 5 1 1 1 3v4s1 0-1 1-4 2-4 0c-1-2-3-1-3-3 0-1 1-5 1-5s-2 0-2-1c-1-1-1-4-2-4 0-1-1-1-2-1-1 1-3 2-4 1 0 0 1 1-2 0-4-1-6-2-7-2h-6s-6 1-7 1-6 2-7 3c-2 1-2 3-3 3l-2 1s-2 2-2 3-1 3-2 3c0 1-1 0 0 2 0 0-2-2-2-3 0 0 1-2 2-3 0-2 1-3 1-4v-4s-2-4-1-5c0-1-2-1-2-1v-3h3c1-1 2-1 2-1l1-6c0-1 1-4 1-5s4-2 4-2c1 0 2 1 2 0 1-2 0-5 1-6 0-1 0-1 1-1 0-1 11-1 11-1 1-1 0-37 1-37Z"
          onPress={stateMachine.bind(this, 3, "ESTADOS UNIDOS ESTE")}
        />
        <Circle
          fill={findColor("ESTADOS UNIDOS ESTE")}
          cx="335" cy="326" r="10"
        />
        <Text2
          x="335" y="326" text-anchor="middle" fill="black">{findTropas("ESTADOS UNIDOS ESTE")}
        </Text2>
        <Path
        //GROENLANDIA
          fill="#cc0"
          d="M434 219s0 4-1 6c0 2-1 1-1 3-1 2 0 3-1 5-1 1-1-1-1 2 0 4 0 5-1 5-1 1 0 2-1 2-2 0-2 1-3 0 0-2 1-2-1-2-1-1-2 1-3-1 0-1 1-2 0-2-2-1 1 3-3-2s-4-8-4-8-1-1-1-2 1-4 0-5c-1-2-2-5-1-6s3 0 3-2 0-2 1-3c0-1 0-1-1-2-1 0 0 1-2 0-1 0-1-1-2-1 0 0 1 1-1 0s-3-1-1-2c2 0 3-1 4 0 0 0 1 1 0-1 0-1-4-2-4-4v-2c0-1 0-2-1-3s-1-1-1-2c0-2 0-2-1-3s-1 0-2-1c-1-2-1-2-2-2s-1 0-2-1-1-2-2-2c-2 1-3 1-3 2-1 0 0 1-2 1h-4s-1-2-3-1c-2 0-2 1-2 0-1-1-2-1-2-2 0 0-2 0 0-1 1-2 0-2 2-2h3c1-1 2-1 1-1 0 0 0-1-1-1-2 0-3 0-3-1s-1-2 0-2c2 0 3 1 4 0s1-1 2-1c1 1 3 1 3 0s2-1 1-1c-2-1-3-1-2-2 0 0 1 0 1-1-1-1-2-2 0-2 3 0 4 1 4 0 1-2-1-3 1-3 3 0 5-1 5-2s0-1 2-1c2 1 2 2 3 0 1-1 0-1 2-1 2 1 2 1 3 0 1 0-1-1 2 0 2 0 1 1 2-1 0-2-2-2 0-2 3-1 3 0 4-2 1-1 0-1 2-1 2-1 2 0 1-2-1-1-3-2 0-2 2 0 4 0 4-1 0 0 0 1 1 0 2 0 2 0 3-2 0-1 0-1 1 0 1 0 0 1 2 0s1-1 3-1h5c2 0 1 1 2 1h3c2 0 2 0 3 1 1 0 1 1 3 1s3-1 3 0c1 2 0 2 2 2 3 1 4 0 2 1-1 1-4 1-3 2s0 1-2 1c-2 1-6 1-3 2 3 0 5-1 6 0 0 1-1 1 2 1s2-1 4-1c3 1 3 2 3 0 1-2-1-3 2-2s2 1 4 0 2-3 3-1c0 2 0 3-1 4-2 0-2-1-2 1-1 2-1 2-2 3s-2 0-2 2c1 2 1 2 0 3 0 2-1 3 0 4s1 0 2 1c1 2 1 2 0 3 0 2-1 1-1 3 0 3 0 4 1 3 0 0 1-2 1 0 0 1 0 2-1 3-2 1-2 0-2 1s1 2 0 3 0 2-2 1c-1-2-2-3-3-2s-2 0-1 1c1 2 2 1 2 2 0 0 0 1 1 2 0 0 0 1 1 1 1-1 1 0 1 1v2l1 1c-1 1-1 1-2 1-1 1-1 2-1 2-1 0-2 0-2-1s0-3-1-3c-1-1-2-3-2-1v3c-1 0-2-1-1 1l2 1s2 1 1 2c0 0 0 1-2 1-1 0-1-2-2 0l-3 3-1-1s-1-2-1-1 0 1-1 3-1 3-2 3-2-1-2 0c-1 1 0 1-1 2s-2 1-3 1c0 0 1-2-1 0-1 2 0 2-2 3h-8c-1 1-1 2-1 2Z"
          onPress={stateMachine.bind(this, 4, "GROENLANDIA")}
        />
        <Circle
          fill={findColor("GROENLANDIA")}
          cx="430" cy="200" r="10"
        />
        <Text2
          x="430" y="200" text-anchor="middle" fill="black">{findTropas("GROENLANDIA")}
        </Text2>
        <Path
        //TERRITORIOS DEL NOROESTE
          fill="#996"
          d="M334 217c1-3 9-11 9-11s3 0 5-1c1-1-2-4-2-4l1-2 2 1s1 2 3 2 1-2 2-3c2 0 3-4 3-4s3 2 6-1 1-2 0-3c-1-2 1-3 1-3h-2s1-1 0-4c-2-2-2 2-4 3-1 1-1 2-5 1-3-1 0-2 0-4 0-1-4 1-5-1s-2 1-1-1c0-2-1-5-2-6s3-7 3-7 3 1 3-1c0-3 2-3 2-4s-4 0-4 0l-1 2s-4-3-4 0c0 4-1 4-3 8s-1 7-1 7 2 0 2 2c-1 3-5 2-5 2l-1-4h-2s-1 4 0 6c0 1-8 0-10-2s-5 2-7 3-4 0-6-1c-2 0-1 3-6 3-4-1-2-7-3-4-1 2-6-2-8-4s-7-2-7-2v-2h-6s-3 2-5 1c-2 0-1 2-1 2s-3 1-6 1c-3-1-3 1-4 2-2 1-7-2-10-3s-5 1-8 0c0 0-2 32-2 33 1 0 83 3 87 2 4 0 2 1 2 1Z"
          onPress={stateMachine.bind(this, 5, "TERRITORIOS DEL NOROESTE")}
        />
        <Circle
          fill={findColor("TERRITORIOS DEL NOROESTE")}
          cx="300" cy="205" r="10"
        />
        <Text2
          x="300" y="205" text-anchor="middle" fill="black">{findTropas("TERRITORIOS DEL NOROESTE")}
        </Text2>
        <Path
        //ONTARIO
          fill="#ff6"
          d="M333 219c-1 3-2 9-2 9l2 2s2 2 3 4c2 2 3 5 6 5 3-1 4 2 4 2l2-1s2-2 3-1c0 1 2 2 2 2s2-2 4-2 0 2 0 2l-4 2s1 2 2 2 2 4 1 5c-2 1 0 3 0 3l1 2 2 1v3c-1 2-1 19-1 19s1-2 2-2c0 0 2 1 2 2 1 0 1-2 1-2 1-1 1 0 2 0 1 1 0 0 1 0 2 0 2 3 2 4l-2 1s-3 1-4 1-2 1-3 2c0 1-2 0-3 1-1 0 0 1 0 2s-4 5-5 4-2-3-4-3c-1-1 1-3 1-4 1-2 1-4 0-7s-2-4-2-5c-1-1-2-2-2-5-1-2-3 2-6 1-2-1-6 1-6 1s1-5 0-5h-20v-3c0-2 4-45 4-45h18l-1 3Z"
          onPress={stateMachine.bind(this, 6, "ONTARIO")}
        />
        <Circle
          fill={findColor("ONTARIO")}
          cx="320" cy="245" r="10"
        />
        <Text2
            x="320" y="245" text-anchor="middle" fill="black">{findTropas("ONTARIO")}
          </Text2>
        <Path
        //QUEBEC
          fill="#990"
          d="M359 259s1-4 2-5 2-6 2-7c-1-1-2-1-1-3 1-1 0-4 2-3 2 0 4 0 4-1v-2c0-2 1-2 2-2 0 0 1 0 0-2v-3c-1-2-1-1-1-3-1-1-1-4 0-4 2 0 0-2 1-3 2 0 4 0 3-2 0-2-3-6-1-6s4 1 4 1h7s-1 2 1 3c2 0 2 1 3 1 0 1 1 2 1 2v2c0 1 1 2 0 2 0 1-1 1-1 2s1 3 1 3 1 1 2 1c1-1 1-2 2-2 2-1 2 1 3-1s1-2 1-3c0 0 2-2 3-1 1 0-1 5 0 6 1 2 3 0 3 0v3c1 0 0 1 0 2 1 1 1 1 1 2s1 1 1 1 1-1 2 0c0 2 0 3 1 3s2 2 2 2l1 2 3-2 2 1s-4 2-3 4c1 1 5-3 5 0 0 2-1 5-2 5s-2 1-2 1c0 1-2 2-3 2-1 1 0 2-2 2h-4s0 1-1 2v2c-1 0 2 0-2 1s-5 1-5 1h-3s0-1-2-1-3 2-3 2h-2l-2 2s-1 0-1 2c0 1 2 3 3 2 0-1 2-5 4-5s4 1 4 4c-1 3-1 2-1 3 1 2 2 3 1 4 0 1-1 1 1 2 1 1 2 3 3 1 0-2 1-3 2-2 0 0 2-1 1 2-1 2-1 2-2 3s-1-1-3 2c0 0-2 1-3 0 0 0-1-1-1-2s-1 0-3-1c-1 0 0-3 0-5 1-2-3-4-4-4-1-1-2-1-2 0-1 1-2 1-2 1-1 1 0 5 0 5s0-1-2 0c-1 1-11 2-11 2 0-1 0-4-2-4-1 0 0 1-1 0-1 0-1-1-2 0 0 0 0 2-1 2 0-1-2-2-2-2-1 0-2 2-2 2s0-17 1-19Z"
            onPress={stateMachine.bind(this, 7, "QUEBEC")}
        />
        <Circle
          fill={findColor("QUEBEC")}
          cx="370" cy="250" r="10"
        />
        <Text2
          x="370" y="250" text-anchor="middle" fill="black">{findTropas("QUEBEC")}
        </Text2>
        <Path
        //ESTADOS UNIDOS DEL OESTE
          fill="#993"
          d="M326 264c-1 0 0 36-1 37 0 0-11 0-11 1-1 0-1 0-1 1-1 1 0 4-1 6 0 1-1 0-2 0 0 0-4 1-4 2s-1 4-1 5l-1 6s-1 0-2 1h-3v3s2 0 2 1c-1 1 1 5 1 5h-5c-1 0-2-1-2-1-1-1-1-1-2-1s-4-3-4-4h-10c-1 0-2-2-2-2l-4-2h-8c-1 0-1-3-1-3-1-2-1-2-1-4s-3-5-4-7c-2-2-2-8-2-9 1-1 0-6 1-9 1-2 1-5 2-8 0-2-1-2 1-5 1-4 1-2 2-5 0-3 1-1 1-4 0-2 1-4 0-5 0 0-1 1 0 1s58 1 62 0Z"
            onPress={stateMachine.bind(this, 8, "ESTADOS UNIDOS OESTE")}
        />
        <Circle
          fill={findColor("ESTADOS UNIDOS OESTE")}
          cx="280" cy="300" r="10"
        />
        <Text2
          x="280" y="300" text-anchor="middle" fill="black">{findTropas("ESTADOS UNIDOS OESTE")}
        </Text2>
        <Path
        //ARGENTINA
          fill="#c03"
          d="M396 495c0 2 0 3-1 3 0 0-1 1-2 3 0 2-3 3-3 3s-2 1-2 2 5 1 5 1c0 1-1 5 0 5 0 1 4-1 4 0 1 1 0 5 0 5s3 2 4 2c-2 0-5 2-4 3 0 0 1 1 0 1-2 0-2 0-3 1h-3c-2 0-2 1-3 1h-2c-1 0-1 0-1 1v1c1 0 3 1 3 1v2c0 1 0 1 1 1v1s-1 2-2 3c0 0-1 1-3 1h-2c-1 1-1 1-3 1h-3c-1 1-2 1-2 1l1 1c0 1 1 1 0 2 0 2-1 2-2 3v1h-3s0-1-1 1c0 1 1 2 1 2s-1 2-1 3 1 2 0 2v1c-1 1 0 1-1 2l-1 1c-1 1-2 1-2 1v2s-1 0 0 1 1 0 1 2c-1 1 0 1 0 1s1-1 1 3c0 3-1 4-1 4s-1 0 0 1v3c-1 1-1 0-2 2s0 4 1 5c0 1 1 1 1 2s-1 1 0 2c0 1 2 2 2 3v2c1 0 1 1 1 1v5c1-1 0-1 1-2h3l1-1c1 1 1 0 2 2 0 1 0 1 1 1 1 1 2 1 3 1s1-1 2 0c0 1 1 1 0 2h-3l-2 1c-1 0-1 1-2 1s0 1-2 0h-2c-1-1-2-1-2-2v-1l-3-2h-4l-1-1h-2v-2h-2v-1s-1 0-2-1c0 0-1 0-2-1l-1-1-2-2c-1 0-1 0-1-1 0 0-1 0-1-1-1-1 0-1-1-2s-1 0-2-1c0-1 1-2 0-3v-1c-1 0-1 0-1-1s0-2-1-2c0-1-1-1-1-2v-3c0-2 0-2-1-3l-1-1c0-2-1-2-1-3 1-1 1-1 1-2l1-1v-2c0-1-1 0 0-3s1-3 1-4c0 0 1-1 0-2v-2c0-1 1-1 0-2v-1s1 0 0 0c-1-1-1-1-1-2v-10c1-1 1-1 1-2s1-2 0-3v-2c0-1 1-1 1-2v-1c0-1-1 0 0-2 0-3 1-5 1-6v-2c-1 0-1-3-1-4v-2c1-1 1-1 1-2-1 0 0 0 0-1v-4c1-2 1-1 1-3 0-1-2-3-1-4 0-2 1-1 1-3-1-2-1-4 0-5v-6c1-3-1-5-1-5s2-2 3-2 1 2 0 3c0 1 1 2 2 3l3 3c0 1 1 2 2 3 0 1 0 2 1 3 2 1 2 0 3-1v-4c0-2 2 0 2 0s1 2 2 2c0 1 2 1 2 0 1-1 2-1 2-1 1 0 2 1 3 1 2 0 2 0 4 1 1 1 0 2 1 3 2 1 2 0 3 0 0 1 0 2 1 3 2 1 5 0 7 0 1 1 0 2 0 3s0 3-1 3c-1 1-2 2-1 4 0 1 3 0 4-1 2 0 2 0 4-2 1-1 5-3 5-3Z"
            onPress={stateMachine.bind(this, 9, "ARGENTINA")}
        />
        <Circle
          fill={findColor("ARGENTINA")}
          cx="350" cy="540" r="10"
        />
        <Text2
            x="350" y="540" text-anchor="middle" fill="black">{findTropas("ARGENTINA")}
          </Text2>
        <Path
        //BRASIL
        name="Brasil"
          fill="#c36"
          d="m404 403-5 5c-1 1-1 3-2 3s-9 1-9 1 1 2 0 2h-12l-1-5s-2 1-2-1v-4s-3 1-4 2c-2 0-3 3-5 2-1 0-2-2-2 0 0 1 0 5-1 6-1 0-1-1-2 0s-4 2-4 1c-1-1-2-1-2-1-1-1-2-1-2-1-1 0-1-1-2 0l-3 3c0 1-1 3-1 4s2 1 2 3c0 1-1 2-2 2-1 1-6 2-6 2s-4 0-4 1 0 4-1 5-3 1-3 2c-1 1-3 1-2 3 1 1 2 2 3 2s3 0 3 1 3 1 5 2c1 1 5-1 4 1 0 2-4 3-4 4s0 4 3 4c2 0 5-2 7-2s3 0 4-1c0 0 1-2 2-2s3 1 4 2c1 2 1 3 2 3 2 0 1 1 2 1 2 1 3 0 4 1s1 3 2 3c2 0 4-1 5 0 0 1 1 3 2 4v2c0 1 2 1 3 2s1 1 2 3c0 2 1 2 2 3 0 2 2 5 1 6 0 1-1 3 1 4 1 0 2 1 3 2 1 2 1 1 2 2 1 0 1 2 1 5 1 2 4 3 4 5s0 3-1 3c0 0-1 1-2 3 0 2-3 3-3 3s-2 1-2 2 5 1 5 1c0 1-1 5 0 5 0 1 4-1 4 0 1 1 0 5 0 5s3 2 4 2c1-1 0-1 0-1 1-1 1-1 1-2 1-1 1-1 1-2 0 0 0-1 1-1 0-1 1-1 1-2v-2c0-1 2-2 3-2 2-1 1-2 2-3 0-2-1-1-1-2v-3c0-2 0-1 1-1 0-1 0-4 2-7 1-3 12-4 13-4 0 0 3-1 4-2l2-2c1 0 1-1 1-2s0-1 1-1c1-1 0-1 1-2s0-2 0-3c1 0 2-1 3-1s0-2 1-2c1-1 0-4 0-5 0-2 0-2 1-3 0-1-1-3-1-3l1-2s-1-2 0-3c0-1 1-1 2-2 2-1 1-4 1-4v-1s2-1 4-1 2-3 3-4c2-2 1-3 1-5 0 1 0 0-1-2v-3c0-2-1-2-2-3s-3-1-3-1l-3-3c-1 0-4-2-6-2-2-1-2-1-3-2s-1 0-2 0c0 0-1 1-2 0h-2c-1 0-2-1-3-1 0-1 0-1-1-2h-3c0-1-1-1-2-1h-2c-1 0-3-1-3-1-1 0-3 1-4 1s-2-2-3-2c-2-1 1 0 3-3 1-2-1-3-2-4 0-1 0-2-1-4l-1-3Z"
          onPress={stateMachine.bind(this, 10, "BRASIL")}
        />
        <Circle
          fill={findColor("BRASIL")}
          cx="400" cy="450" r="10"
        />
        <Text2
            x="400" y="450" text-anchor="middle" fill="black">{findTropas("BRASIL")}
          </Text2>
        <Path
        //Venezuela
          fill="#f06"
          d="M317 414c2-1 1-3 1-4v-3c0-1 0-2 1-3 2-1 2-3 2-3l1-1v-2l1-2s1-1 1-2v-4l3-1s0 1 1 0c1 0 2-1 2-1l3-1 2-2 2-1h1c1 0 3-1 3-1l1-1c1 0 1-1 2-1l4-1s1 1 1 3c0 1 0 2 1 1h2c1 0 1-2 2-1s1 1 2 1h2l5 2h2c1-1 4-1 4-1s1 1 2 1c0 1 3 2 4 4 1 1 3 2 3 3 0 0 1 1 2 1 0 0 0 1 1 1h2v1c1 1 2 0 2 1 1 1 0 2 1 2h1l2-1s0-1 1 0 1 1 2 1 0 1 2 1c2 1 4 1 5 1 0 0 0-2 2 0 2 1 3 2 3 2l-5 5c-1 1-1 3-2 3s-9 1-9 1 1 2 0 2h-12l-1-5s-2 1-2-1v-4s-3 1-4 2c-2 0-3 3-5 2-1 0-2-2-2 0 0 1 0 5-1 6-1 0-1-1-2 0s-4 2-4 1c-1-1-2-1-2-1-1-1-2-1-2-1-1 0-1-1-2 0l-3 3c0 1-1 3-1 4s2 1 2 3c0 1-1 2-2 2-1 1-6 2-6 2s0-2-1-2c0-1-1-1-2-1-1-1-2-2-3-2h-4c0-1-1-2-3-2-1 0-2 1-3 0-1-2-3-4-4-5 0 0-3 0-2-1Z"
            onPress={stateMachine.bind(this, 11, "VENEZUELA")}
        />
        <Circle
          fill={findColor("VENEZUELA")}
          cx="345" cy="405" r="10"
        />
        <Text2
            x="345" y="405" text-anchor="middle" fill="black">{findTropas("VENEZUELA")}
          </Text2>
        <Path
        //PERU
          fill="red"
          d="M347 472c1 0 1 2 0 3 0 1 1 2 2 3l3 3c0 1 1 2 2 3 0 1 0 2 1 3 2 1 2 0 3-1v-4c0-2 2 0 2 0s1 2 2 2c0 1 2 1 2 0 1-1 2-1 2-1 1 0 2 1 3 1 2 0 2 0 4 1 1 1 0 2 1 3 2 1 2 0 3 0 0 1 0 2 1 3 2 1 5 0 7 0 1 1 0 2 0 3s0 3-1 3c-1 1-2 2-1 4 0 1 3 0 4-1 2 0 2 0 4-2 1-1 5-3 5-3 0-2-3-3-4-5 0-3 0-5-1-5-1-1-1 0-2-2-1-1-2-2-3-2-2-1-1-3-1-4 1-1-1-4-1-6-1-1-2-1-2-3-1-2-1-2-2-3s-3-1-3-2v-2c-1-1-2-3-2-4-1-1-3 0-5 0-1 0-1-2-2-3s-2 0-4-1c-1 0 0-1-2-1-1 0-1-1-2-3-1-1-3-2-4-2s-2 2-2 2c-1 1-2 1-4 1s-5 2-7 2c-3 0-3-3-3-4s4-2 4-4c1-2-3 0-4-1-2-1-5-1-5-2s-2-1-3-1-2-1-3-2c-1-2 1-2 2-3 0-1 2-1 3-2s1-4 1-5 4-1 4-1 0-2-1-2c0-1-1-1-2-1-1-1-2-2-3-2h-4c0-1-1-2-3-2-1 0-2 1-3 0-1-2-3-4-4-5 0 0-3 0-2-1-2 2-2 4-3 6 0 2-1 3-2 5 0 2 1 1 2 3 0 2-1 1-1 3v5s1 2 1 3c1 0 3 3 3 3s-1 1 0 3c0 2 1 2 2 3 0 1 2 3 3 3 1 1 2 3 3 3 2 1 1 3 1 4-1 1 1 3 1 4 1 1 1 0 2 1 0 1 2 2 2 2 1 1 2 1 2 1l2 2c1 0 2 0 3 1 1 0 2 3 3 3 0 0 2 1 3 2 1 0 2-2 3-2Z"
            onPress={stateMachine.bind(this, 12, "PERU")}
        />
        <Circle
          fill={findColor("PERU")}
          cx="345" cy="465" r="10"
        />
        <Text2
            x="345" y="465" text-anchor="middle" fill="black">{findTropas("PERU")}
          </Text2>
        <Path
        //GRAN BRETANA
          fill="#33f"
          d="M466 294h-2c-1 0-1 0-2 1-1 0-2 0-3 1-1 0-2 1-2 1l-1 1h-3c-1 0 0-1-1-2 0 0-4 1-2 0 1-1 2 0 1-1s-2-1-1-1h2c0-1-1 0 0-1 1-2 1-2 2-3 1 0 0-2 1-1h2v-1h-3l-2-2c-1 0-2 1-1 0l1-2s-2-1-1-2c0 0 1 0 1-1s-2-1 0-2l2-2c1-1 1-1 2 0 0 0 0 1 1 0l2-2s-1 0 1-1 0-2 3-1h3c1 0 1-2 1 0 1 1 0 1 2 2 1 0 2 0 2 1l-1 1c1 1 1 1 1 2s0 1-1 2c-1 0-1-1-2 1-1 1-2 0-2 0h-1c0 1 0 2-1 1s-3-1-3-1v1c0 1 1 3 1 3s1 2 1 3c-1 1-3 1-1 1 2 1 1 0 1 1s0 2 1 2 2 1 2 1Zm12-11v-4c0-1-1-2-1-2 0-1-1-2-1-2-1-1-1-1-2-1l-1 1c-1 0-1 0-1-1-1 0-1-1-1-2s0 0 1-1l1-1v-3h-2v-1c-1-1-1 0-2 0-1-1 0-1 0-1 0-1 0-1-1-2 0-1 0 0-1 0l-1-1v-1l-1-1c0-1 1-1 1-1l2-2-1-1v-1h-3c-1-1 0-1 1-2 0 0 0-1 1-2 1 0 1 0 2-1 1 0 1 0 1-1s1-2 1-2c0-1 1-2 1-3s2 1 5 0 3 0 3 0 1 3-1 4c-3 1-1 5-1 5s1-1 2-1h1c1 0 1 0 2-1s1 1 1 1c0 1 1 3 1 3s-1 1-1 2v1h-1c-1 1 0 1 0 2-1 0-1 0-2 1v1c-1 1-1 1-2 1-1 1 0 1 0 2s1-1 3-1h2c1 0 1 0 1 1 1 0 0 1 1 1 0 1 0 1 1 1v3s1 3 2 4c2 1 1 1 2 1 0 1 2 4 2 4 0 1 0 1 1 3 0 1 0 1-1 2v3l2-1c2-1 1 0 2-1h2c1 0 1 1 2 2s0 1 1 1c0 1 0 1-1 2v1c-1 1 0 1-1 2h-2c-1 0 0 1-1 1v3s1 0 1 1c1 0 1 0 0 1 0 1-1 1-2 1-1 1-1 0-2 0s-1 0-3 1c-1 1-1 0-2 0h-2c-2 0-2 0-3 1s-1 0-1 0c-1 0-1-1-1-1-1-1-1-1-2 0 0 0-1 2-2 2-1 1-1 0-2 0h-1l-2 2c-1 1-1 0-2 1-1 0-1 0-1-1v-1c1 0 2-2 2-2l2-2c2 0 1 0 1-1 1-2 1-2 2-2 0 0 1-1 0-2-1 0-2 0-3-1-1 0-2 0-2-1l2-2c0-1 0-1 1-1l1-1c1 0 1 0 1-1v-2s1-1 0-2h-1l-1-1v-3s1 0 2 1c1 0 2 2 2 2s1 0 0 0Z"
            onPress={stateMachine.bind(this, 13, "GRAN BRETANA")}
        />
        <Circle
          fill={findColor("GRAN BRETANA")}
          cx="455" cy="310" r="10"
        />
        <Text2
            x="455" y="310" text-anchor="middle" fill="black">{findTropas("GRAN BRETANA")}
          </Text2>
        <Path
        //ISLANDIA
          fill="#36c"
          d="M474 212s2 2 2 1c1-1-1-2 1-1 1 1 1 1 2 1 0 1 3-1 2 1s-2 2-1 2 0 0 1 1 1 2 2 1l1-4s4 0 4 1c-1 2-1 2 0 1 2-1 1-3 3-2 1 1 1 2 2 1 0-1-1-2 0-2 2 0 2 2 3 0s0-3 1-2c1 0 1 0 2-1 1 0 1-1 2 0 1 0 1 1 1 1h2c1 1 0-1 0 1 1 2 1 3 2 3 0-1 1-1 1 0 0 2-2 2 0 2 1 0 2 0 2 1s1 2 1 2v1c0 1-1 1 0 2v1c-1 1-2 1-3 1 0 0-1 1-1 2 0 0 1 0-1 1-1 2 0 2-1 2s-2 1-2 1h-3l-1-1s0-1-1-1v2c-1 0-2-2-2-1s1 3 1 3 0 1-1 1c0 1 0 1-2 2-2 0-2 0-3 1-1 0-1 1-2 0-2-1-7-3-7-3-1 0-2 1-3 0-2 0-3 1-3 0-1-1-1 1 0-1 0-2 2-3 2-3v-1s0-1-1-1l-1-1c0-1 0-1-1-1s-2 1-3 0-1-1-1-2c1 0 1-1 2-1s1 1 2 0c0-2 1-2 1-2s-1-1-2-1c-1 1 0 2-1 0s-2-2-2-2-1 0 0-1l2-2c0-1-1-2 0-3s1 0 1 0h1Z"
            onPress={stateMachine.bind(this, 14, "ISLANDIA")}
        />
        <Circle
          fill={findColor("ISLANDIA")}
          cx="480" cy="210" r="10"
        />
        <Text2
            x="480" y="210"  text-anchor="middle" fill="none" >{findTropas("ISLANDIA")}
          </Text2>
        <Path
        //EUROPA NORTE
          fill="#33c"
          d="M563 263h1c1 1 1 2 2 3l3 1h3v1s0 3 1 4v9c0 1 2 3 2 3l1 1c0 1-1 2-1 2v2c0 1-1 1-1 1-1 1-1 2-1 2 0 1-1 1-1 1-2 2-2 5-5 5-1 0-2 1-3 1v2l3 2-1 1-1 1c-1 0-1 1-1 1 0 1-1 1-2 2s-2 4-2 4v3s1 1 1 2-1 2-1 2h-9v-4l-1-1c0-1 0-2 1-2v-2c1-1 0-2-1-2l-2-1s0 1-1 1c-1 1-1 1-2 1s-5 1-5 1v2s-2 2-2 3c-1 0-2 1-3 1h-2c-1 0-1 0-2 1-1 0-2 1-3 1s-2-2-2-3h-1s-1 1-2 1c-1 1-1 1-2 1s-1-1-1-1-1 0-1-1c-1 0-1-1-1-2 0 0-1 0-1-1v-1l-1-1c-1 0-1-1-2-3l-2-2-1-3-1-1c0-1 1-3 2-3 0 0 1 0 1-2v-2c1 0 2 0 2-1 1-1 0-2 0-2 0-1-1-1 1-1 2-1 3 0 3-1 1-1 1-1 1-2s1-1 1-2c1-1 0-1 1-2 0 0 0-4 1-4 0 0 0 1 1 0 0-1 0-2 1-3 0-1 0-1 1-1 1-1 1 0 1-1 1-1-1-1 1-2l2-1c0-1 1-1 1-2v-6c1-1 1-1 0-1s-1 1-1 0v-2c-1-1-1-2-1-2s-1 0 0-1c0-1 1-2 1-2l1-1c1 0 1 1 1 0 1-1 0-1 1-1h2l-1 1v1s1 1 1 2c1 2 1 2 1 3l-1 3s0 1 1 2 1 1 2 1h7l1-1h5c0-1 0 0 1-1 1 0 2-1 2-1h2c1 0 2-1 3 0h2c1 0 1 1 2 0Z"
            onPress={stateMachine.bind(this, 15, "EUROPA NORTE")}
        />
        <Circle
          fill={findColor("EUROPA NORTE")}
          cx="540" cy="290" r="10"
        />
        <Text2
            x="540" y="290"  text-anchor="middle" fill="none" >{findTropas("EUROPA NORTE")}
          </Text2>
        <Path
        //ESCANDINAVIA
          fill="#3cf"
          d="M579 237c-1-1-2-1-2-2-1 0-1-1-2-1h-2c-1 0-2-1-3-1-1 1 0 1-1 1-1 1-3 1-4 1h-2c-2 0-3 1-3 0-1-2-1-1-1-3 0-1 1-2 1-3s0-2 1-3c0-1 1-2 1-2 1-1 1-2 1-2v-4h-2c-1-1-1-1-2 0s-2 1-2 2v3c-1 1-1 1-1 2v1c-1 1-1 1-2 1-1 1-2 0-2 2v2c1 1 1 1 1 2s1 1 1 3v2s1 1 1 2c-1 1-1 3-1 3-1 1-1 2-2 2 0 1 0 1-1 2s-1 1-2 1c-1 1-1 2-1 2v2s1 2 0 2c-1 1-2 1-2 2-1 1 0 2-1 3s-1 1-2 1c-2 0-2 0-3-1 0-1-1-2-2-2h-1s0-1-1-1c0 0-1 1-1 0v-6l-2-3 1-1-1-2h-1s-1 0-1 1v1c-1 1-2 2-3 2-1 1-2 1-2 1s0 1-1 0c-1 0 0 0-1-1s-1-2-1-3l-1-1-1-1c-1 0-1-1-1-2v-3c1-2 0-3 0-3l-1-1v-1c-1-1-2-2-2-3 1-1 0-2 2-3 1 0 1 2 1-1 0-2-1-1 1-3l1-2s1 0 2 1c0 2 0 3 1 2 0-1 1-2 1-3l2-2s-2-2 0-2 2 1 2 0c1-1 1-1 2-1 1-1 1 0 2-1 0-2 0-2 1-2 1-1 1-1 1-3 0-1 0-1 1-3 2-2 2-2 2-3 1-2 1-2 1-3 1 0 2 0 2-1 1 0 1-1 1-1l1-2s-2-1 0-1c1-1 1-1 3-2h2s1 2 1 0c0-1 0-1 1-2s1 0 2 0h1s1 1 2 0c0-1-2-2 0-3s3 0 3-1c1 0 0-1 1-1 1-1 1 0 2-1 2 0 2-1 2-1h2c0 1-1 1 1 1s5-2 6-1c1 0 0 2 1 2s2-1 3-1c0 1 0 1 1 1 0 0 1 4 0 5 0 0 1 4 0 4-1 1-1 6-1 9s1 7 1 9 1 5 1 5v2c0 2 1 3 1 3h1c0 1 0 2-1 2v3c-1 1-1 1-1 2v3c0 1 1 3 0 3Z"
            onPress={stateMachine.bind(this, 16, "ESCANDINAVIA")}
        />
        <Circle
          fill={findColor("ESCANDINAVIA")}
          cx="530" cy="230" r="10"
        />
        <Text2
            x="530" y="230"  text-anchor="middle" fill="none" >{findTropas("ESCANDINAVIA")}
          </Text2>
        <Path
        //EUROPA SUR
          fill="#39f"
          d="M567 303v-1l1-1s2 0 3 1v3c1 1 1 1 2 1h2s0 1 1 2c0 1 0 2 1 2v4c0 1-1 1-1 1v2l1 1v4c0 1 1 1 1 2-1 0 2 2 2 2l-1 1c1 1 1 2 1 2 0 1 0 1-1 1 0 1-1 1-1 2s1 1 1 2c-1 1-1 1-1 2-1 0-1 1-1 2-1 1 0 1-1 1-1 1-1 1-1 2v1c-1 1-1 1-1 2-1 0-1 0-2 1v1c-1 1-1 0-1 1-1 1 0 1 0 2s1 1 0 2l-2 2s0-1-1 1c0 1 1 1 0 1-1 1-1 1-2 1h-3c0 1-1 1 0 2l1 1 1 1c1 1 1 1 1 2v1s1 2 0 2c0 0-1 0-1 1v1c1 1 0 1 1 2l1 1c1 1 2 1 1 1 0 1-1 1-2 1 0 0-1 0-1-1l-1-1h-1c0 1 2 1 0 1-3 0-2 1-3 0s0-1-1-1h-1c-1-1-1-1-1-2s1-1 0-3v-2c-1-1 0-1 0-2s-1-1-1-1v-2c-1-1-1-1-1-2 0-2 0-2-1-2 0 0 0 1-1 0s0-1-1-2c-1 0-1 1-1 0-1-2-1-1-1-3v-2c0-1 1-1 0-2l-1-1c-1 0-1 1-2-1-1-1-1-2-2-2s-1 1-1 0c-1-1 0-1-1-1-1-1 0-1-1-1-2 0-2-1-3-1-1 1-1 1-1 2v1c0 1 0 2 1 2 0 0 0-1 0 0 0 2 0 3 2 2 1-1 2-1 2-1v2c1 1 0 2 1 3 1 0 1 0 2 1h1c0 1 0 2 1 3 0 1 1 0 1 1-1 1-1 2-1 2-1 0-2 1-3 0 0-1-1-1-1-1s1-1-1-1c-1 0-1 1-2 1s-1-1-1 0l2 2s1 0 1 1c-1 1 0 1-1 2 0 1 0 1-1 2v2c-1 1-1 2-2 2s-1 0-1 1c-1 1-1 1-1 2h-3c0 1 1 1-1 1l-1-1h-2v-2c-1 1-1 2-2 1 0-2 0-2-1-2v-1c-1-1-1-1 0-2s1-1 2-1h1c1 0 1 1 1 1 1 0 3-1 3 0v1c1-2 1-2 2-3 0-1 1-2 2-2v-2c-1-1-2 0-2-2s1-2 0-3c0-1 0 0-1-1-1 0-1-1-1-1-1-1-2-1-3-2 0 0 0 1-1-1-1-1-1-1-2-1 0 0 0 1-1 0 0-1 0-1-1-1 0-1 0 0-1-1-1 0-1 0-1-1v-2c-1-1-2-1-2-1h-4s3 0 1-2c-2-1-2-3-2-3 1 0 2-1 2-2s1-2 0-2c0-1-2-2-2-2l-1-1c0-1 1-2 1-2s1 1 1-1v-3c0-1-1-2 0-2 1-1 1-2 2-2 0-1 0-1 1-1s1 0 2-1c1 0 2-1 2-1h1c0 1 1 3 2 3s2-1 3-1c1-1 1-1 2-1h2c1 0 2-1 3-1 0-1 2-3 2-3v-2s4-1 5-1 1 0 2-1c1 0 1-1 1-1l2 1c1 0 2 1 1 2v2c-1 0-1 1-1 2l1 1v4h9s1-1 1-2-1-2-1-2v-3s1-3 2-4 2-1 2-2c0 0 0-1 1-1l1-1 1-1Z"
            onPress={stateMachine.bind(this, 17, "EUROPA SUR")}
        />
        <Circle
          fill={findColor("EUROPA SUR")}
          cx="550" cy="350" r="10"
        />
        <Text2
            x="550" y="350"  text-anchor="middle" fill="none" >{findTropas("EUROPA SUR")}
          </Text2>
        <Path
        //RUSIA
          fill="#36f"
          d="M580 188c-1 0-2-1-2-1s1 4 0 5c0 0 1 4 0 4-1 1-1 6-1 9s1 7 1 9 1 5 1 5v2c0 2 1 3 1 3h1c0 1 0 2-1 2v3c-1 1-1 1-1 2v3c0 1 1 3 0 3-1-1 1 0 1 0 1 1-1 1-2 2h-3c-1 0-1-1-2 0h-6c-1 1-1 2-1 3s1 0 1 2c0 1 1 1 1 1 0 1 1 1 1 1s2 1 2 2v3c0 1-1 1-2 0-2 0-1 0-2-2 0-2 0-1-1-1-1-1-1 0-1 1l-2 2v3c0 1-1 1-1 2-1 0 0 1 0 2 1 1 1 2 1 2 1 0 1 1 1 2l-1 1h1s1 1 1 2l1 1 3 1h3v1s0 3 1 4v9c0 1 2 3 2 3l1 1c0 1-1 2-1 2v2c0 1-1 1-1 1-1 1-1 2-1 2 0 1-1 1-1 1-1 0-3 4-3 4 0 1-2 1-2 1-1 0-2 1-3 1v2l3 2v-1l1-1s2 0 3 1v3c1 1 1 1 2 1h2s0 1 1 2c0 1 0 2 1 2v4c0 1-1 1-1 1v2l1 1v4c0 1 1 1 1 2-1 0 2 2 2 2l1-1s1 0 2-1v-1s0-2 1-3h2c2-1 1 0 2 0h2c1 1 1 1 1 2v3c1 0 1 1 1 1 0 1 1 1 2 2 1 0 0 0 2 1 1 1 0-1 1-2 0-1 1-1 1-1 1 0 1-1 2-1v-1c1-1 0-2 0-2 0-1-1 0-1 0-1 0-2-1-2-2-1 0-1-1-1-1s1-1 2-1c1-1 1-1 2-1h2c0-1 1-1 2-1h4s0-1 1-1c0-1 1 0 1 0v1l-2 2c-1 1-1 0-2 1-2 0-1 0-1 1s-1 1-1 1v2h1v2c0 1 1 0 2 0 0 1-1 1-1 2s2 2 2 2c1 1 1 1 1 2 1 1 1 0 1 0 1-1 1-1 2-1h1v2l1 1c1 1 1 2 2 2s0 0 1 1c0 0 1 1 2 1l1 1c1 0 1 0 1 3s1 0 1 0 0 1-1 2c0 0-1 0-1 1-1 0-1 1-1 1 0 1 0 1 2 2 1 1 1-1 1-1h4s0-1 1-1h2c1-1 1-1 2-1 0-1 1-1 2-1h1c3 0 1 0 1-1s1-1 1-1h1c1-1 1-1 1-2l-1-1s-1-1-1-2 0-1 1-1v-6c0-1 1 0 1-1 1 0 0-2 0-2h-2c-1 0-1 0-2-2-1-1 0-1 0-2-1 0-1 0-1-2 0-1-1-3-1-3h-1l-1-1v-2c1-1 0-2 0-2l-1 1s1-3 2-4v-2c0-1 1 0 2-1 1 0 1-1 1-1s1-1 0-3v-3c0-1-1-1-1-1l-1-1s-1 0-2-1v-4s-1-2-2-3v-3c0-1 0-1 1-2 0-1 1-2 2-2s0-2 0-2 1-3 2-3l3-1c3 0 1 0 2-1s2-1 2-1h2c1 0 3-1 3-1l2-1c1-1 2-1 2-1l1 1h1s2 1 3 1h2c1 0 1 0 2-2 1-1 1-1 1-3 0-1 3-1 4-1l2-2c1 0 0-1 0-3v-3c-1-1-1-2-1-3 0 0 1-1 2-3 1-1 0-2 0-3s-2-1-2-1l-3-2-1-1s-1-1 0-3c0-2 1-2 1-3 1-2 1-3 1-4s-2-1-2-1v-9c0-1 0-4-1-4 0-1 1-3 1-3s-1-2-1-3c-1-1 1-4 1-4l2-5 1-2v-4c1-1 1-4 1-4s-1-7-2-7c0-1-1-1-1-2-1-1-2 0-3 0s-2-1-3-1h-3c-1-1-2 0-3 1 0 1 0 1-1 3-1 1-2 0-3 1-1 0-1-1-2-1-1-1-2 0-3 0s-1 0-3-1c-1-1-1-1-3 1s-2 1-3 1-2 1-2 1l-3 3s-3 1-4 2 0 1-2 2c-1 1-1 0-1-1s0-1 1-2c0-2 0-1-1-1s-1-1-2-2c0-1 0-1-1-2-1 0-2 1-3 1h-2c-1 0 0 1 0 2l1 1v4c0 1 1 1 1 1 1 1 1 1 1 2s-1 0-2 0-2 1-3 2h-2c-1 0-1 1-2 2-2 2-2 1-3 1s-1-1-2-1c-2-1-1 0-2 0s0 1 1 2c0 1 1 2 1 2s0 1-2 2c-1 2-1 0-2 0h-2c-1 0 0 0 0-1v-2c0-1-1-1-1-1v-2c-1 0-1-1-2-1h-2s0-1-1-1l-2-2c-1 0 0-1 0-1 0-1 2-1 3-1s4 1 6 1h4c1 0 3-1 5-1 1 0 2-1 3-2v-2c0-1-1-1-1-2-1-1-1-1-4-3-4-3-4-1-5-1s-1-1-2-1h-8c-1 0-1-1-2-1h-2c-1-1-1-1-2-1-1-1 0 0-1 0Z"
            onPress={stateMachine.bind(this, 18, "RUSIA")}
        />
        <Circle
          fill={findColor("RUSIA")}
          cx="595" cy="270" r="10"
        />
        <Text2
            x="595" y="270"  text-anchor="middle" fill="none" >{findTropas("RUSIA")}
          </Text2>
        <Path
        //EUROPA OCCIDENTAL
          fill="#39c"
          d="M521 317c-1 0-1 0-1 1-1 0-1 1-2 2-1 0 0 1 0 2v3c0 2-1 1-1 1s-1 1-1 2l1 1s2 1 2 2c1 0 0 1 0 2s-1 2-2 2c0 0 0 2 2 3 2 2 1 2 1 2h-2v1c-1 1-1 1-2 1-1 1 0 1-1 1h-1c0-1 0-1-1-1s-1 0-1-1c1-1 1-1 0-1s-1 1-2 0h-2l-2 3v2s-1 0-1 1 1 1 0 2c-1 0-1 1-1 1-1 0-1 0-1 1-1 0-1 0-1 1v1c0 1 1 1 1 1v2l-1 1v2c1 1 1 2 1 2l1 1s0 1 1 2c0 1 1 1 0 2s-3 1-4 3-1 4-2 5 0 1-1 1-2-2-3 0c0 1-1 2-2 2s-1-1-1 1v2s0 1-1 1h-2c-1 0-1 0-1-1-1 0-1-1-1-1-1-1-1-1-2-1s-1 0-1-1c-1-1-1-1-2-1 0 0 0 1-1 0s-1-2-2-2l-1 1s0 1-1 0h-3c-1 0-1 1-2 0-1 0-2 0-2-1s1-1 0-2c0 0 0-1-1-1 0-1 0-1-1-1h-2c0-1-1 0 0-1v-2c1-1 1-1 1-3 1-1 1-1 1-3 1-1 1-1 1-2s0-1 1-2v-2c0-1 1-1 0-1 0-1-2-2-2-3-1 0-1 0-1-1 0-2-1-1-1-2v-2c0-1-1-1-1-2 0 0 0-1 1-1 0-1 1 0 2-1s1-1 1-2 1-1 1-1h1c1 1 1 1 1 2 0 0-1 0 1 1h5c1 0 1-1 1-1h3c1 0 1 1 1 0 1 0 1 1 2 0 0 0 1 0 1-1 1-1 0-1 1-2s2-1 3-1-1-2-2-2c0 0-1 1-1 0 0 0 0-1 1-2 0-1 1-1 1-1s0-1-1-2c0 0 2-1 1-2-1 0-2-1-2-1-1 0-1 1-2 0v-3c-1 0-1 0-2-1s0-1-1-2-2-1-3-1-1 1-1 0c0-2 0-2 1-3 1 0 3-1 4-1s0-1 2 0h2c1 0 2 1 2 1s1-2 1-3c1 0 1 0 1-1s1-1 2-2c1 0 2 1 2 1s-2 1 0 1c1-1-1-3 2-2 3 0 4 2 4 0s0-2 1-3c0-1 0-1 1-2 2 0 1-2 3-3h2c1 0 1 0 2-1l1 1 1 3 2 2c1 2 1 3 2 3l1 1v1c0 1 1 1 1 1 0 1 0 2 1 2 0 1 1 1 1 1l1 1Z"
            onPress={stateMachine.bind(this, 19, "EUROPA OCCIDENTAL")}
        />
        <Circle
          fill={findColor("EUROPA OCCIDENTAL")}
          cx="480" cy="360" r="10"
        />
        <Text2
            x="480" y="360"  text-anchor="middle" fill="none" >{findTropas("EUROPA OCCIDENTAL")}
          </Text2>
        <Path
        //CONGO
          fill="#f93"
          d="M595 514c-1 1-1 0-2-3 0-3-1-10-1-11 1-1 3 1 4 0v-7c0-2 2-1 4-1 1-1 2-2 2-4 1-1 1-1 2-1s1-2 1-3c1-1 2-2 2-4 0-1-2-2-4-3-2 0-2 1-5 1-3-1-4-1-5-1s-1-2-2-2c-1-1-2 2-2 2s-1-1-3-4c-1-3-3-4-3-4-1 0-1-3-1-4s-2-1-3-2c0-1 0-2-1-2s-2 0-2-3c0 0-1-3-1-4 0 0-3 3-3 4 0 0 1 2-2 3-2 1-3 1-5 2-1 0-2 2-2 2-1 1-3 1-3 1-1 1-2 1-3 2 0 1-1-1-1 2v4s2-2 2 1c-1 4-2 5-1 6 0 2 1 2-1 3-1 1-2 0-2 0s-1-2-2-1c-2 0-2 1-4 0h-3l-2 1c-1 0-1-1-2-2-1 0-1 2-1 2 0 1 1 2 0 2 0 1-1 2-1 3-1 1-4 2-3 3 1 2 8 7 9 10l2 2c0 1 3-1 3-1 1 1 3 2 4 3 1 0 5-1 6 0l1 1v4c1 1 3 2 3 1 1-2 8-2 8-1 1 1 0 3 1 4s2 1 2 2-2 2-1 4c0 1 2 2 3 1 2 0 2 1 3 2h7c0 1 1 2 2 2 0 1 1 3 2 2s2-5 1-6c-2 0-2 0-2-2 0-1 0-4 1-4l1-1s4 0 3-1Z"
            onPress={stateMachine.bind(this, 20, "CONGO")}
        />
        <Circle
          fill={findColor("CONGO")}
          cx="560" cy="495" r="10"
        />
        <Text2
            x="560" y="495"  text-anchor="middle" fill="none" >{findTropas("CONGO")}
          </Text2>
        <Path
        //AFRICA ORIENTAL
          fill="#c60"
          d="M575 454s-1-2-2-3 0-3 0-4 0-1 1-2v-1l1-2v-2c0-1 0-1-1-1s0 0 1-1 0-2 1-3c0-1-1-5-1-6 0 0 2-1 3-1 0 0 0-5 2-5 1-1 29 1 29-1v1c0 1 1 1 1 1s2 1 2 2c1 1 1 0 1 1 0 0 0 3 1 4 0 2 0 1 1 2s1 0 1 2 1 2 2 4c1 1 0 0 0 2 1 1 1 2 1 3 1 1 1 1 2 1v1c0 2 3 2 4 4l2 2c0 1 0 1-1 3s0 2 1 3c0 1 4 1 4 1s3 0 4-1l1-1c1-1 4 0 7-1 2 0 6-3 7 0 2 2-4 13-6 18s-8 10-12 14c-4 3-7 8-7 8 0 1-1 2-2 2l-2 2c-1 1-1 1-3 2-1 1-1 2-1 3v2c-1 1 0 3 0 4v3s0 1 1 1c2 1 1 6 1 6s-2 2-3 2-2 1-2 1-1 0-2 1c-2 0-3 0-4 1-1 2 0 2 1 5 1 2-1 1-1 2v4c0 1-1 2-2 2 0 1-2-1-3-2-1-2 0-4 1-5 0-2-2-4-2-5v-3c1-1 1 0 0-2 0-2-1-2-2-3 0 0-1-2-2-2s-1-1-1-2-2-1-2-1c-1 1-1 0-2-3 0-3-1-10-1-11 1-1 3 1 4 0v-7c0-2 2-1 4-1 1-1 2-2 2-4 1-1 1-1 2-1s1-2 1-3c1-1 2-2 2-4 0-1-2-2-4-3-2 0-2 1-5 1-3-1-4-1-5-1s-1-2-2-2c-1-1-2 2-2 2s-1-1-3-4c-1-3-3-4-3-4-1 0-1-3-1-4s-2-1-3-2c0-1 0-2-1-2s-2 0-2-3c-1-2-1-4-1-4Z"
            onPress={stateMachine.bind(this, 21, "AFRICA ORIENTAL")}
        />
        <Circle
          fill={findColor("AFRICA ORIENTAL")}
          cx="590" cy="465" r="10"
        />
        <Text2
            x="590" y="465"  text-anchor="middle" fill="none" >{findTropas("AFRICA ORIENTAL")}
          </Text2>
        <Path
        //EGIPTO
          fill="#f90"
          d="M575 429c0-1-4 0-5 0l-1-1s-1-3-1-4-3 1-4 0v-2c0-2-2-1-3-1s-2-1-3-2c-1 0-2 1-3 1-2 0-2 0-2-1-1-1-2 0-4 0s-1-1-2-2-2 0-4-1c-2 0-1-1-1-2-1-1-2-1-2-1v-7c0-1 0-3-2-4-1 0 0-2 0-2v-2c0-1 1-2 2-2s1-1 1-1l-2-4c0-1 2-1 2-1v-1s1 0 2-1c2-1 1-3 1-3h3c2 1 2 1 3 2s1 2 3 2c2 1 3 1 4 1s4-1 4-1c1-1 3-1 9-1s6 3 7 3c2-1 3 0 4 0s3 1 4 1 3 1 3 1c1 0 6 2 7 2l2-2 1 1h1c1 0 1-1 1-1l2-1 2 4s-1 3-1 4v2c-1 1-1 0-2 0l-3-3c-1-1 0 3 0 3s3 4 7 10 0 3 1 4c1 2 2 2 2 4 1 3 0 1 1 3v-1c0 2-28 0-29 1-2 0-2 5-2 5-1 0-3 1-3 1Z"
            onPress={stateMachine.bind(this, 22, "EGIPTO")}
        />
        <Circle
          fill={findColor("EGIPTO")}
          cx="570" cy="420" r="10"
        />
        <Text2
            x="570" y="420"  text-anchor="middle" fill="none" >{findTropas("EGIPTO")}
          </Text2>
        <Path
        //MADAGASCAR
          fill="#c63"
          d="M659 534c1 1 1 0 1 3 0 2 1 5-1 3-1-2-1-3-1-1v3s1 2 0 2h-2v2l-1 1-1 3s2 0 1 2c-1 1-1 2-1 2v2c-1 3-1 4-1 4s1 0 0 1c-2 2-2 3-2 4-1 0 0 1-1 2l-2 2-1 1v2c0 1-1 1-1 1v1c0 1 0 2-1 2-1 1 0 1-2 2-1 1-1 0-1 2s0 2-1 2-10 1-11 0c-2 0 1-7-1-8s-3-6-2-6l1-1 2-2c0-1 1-1 1-1s-1-3 0-3v-2s0-2 1-2c1-1-1-2 1-2 1-1 2 0 2-1s-1-1-2-1c0 0-1 0-1-2 0-1 0 0-1-1 0-2-1-1 0-3 2-1 2 0 2-2 0-1-1-2 1-2 1 0 2 0 4-1h2c3 0 3 1 4 0s2-1 2-2 0-2 1-2c2-1 2 0 3-1 0-1 1-2 1-3s-1-1 0-1c2 0 2 0 3-1v-2c1-2 0-2 1-3 1 0 3-2 3-2s0-1 1 1 0 2 1 3 1 0 1 1v3l-2 1Z"
            onPress={stateMachine.bind(this, 23, "MADAGASCAR")}
        />
        <Circle
          fill={findColor("MADAGASCAR")}
          cx="650" cy="562" r="10"
        />
        <Text2
            x="650" y="562"  text-anchor="middle" fill="none" >{findTropas("MADAGASCAR")}
          </Text2>
        <Path
        //AFRICA NORTE
          fill="#f60"
          d="M544 385c-1-1-1-1-1-2-1-1-1-2-2-2-1-1-1 1-2-1 0-2 0-4-1-4l-2-2-2-2-2-1h-8l-2 2c-1 0-4 2-4 2h-4s0 1-1 2-3 2-4 1h-2c-2 0-3 2-4 2-1-1-2 0-3 0-1 1 0 1-2 1h-8c-1 0-2 1-2 1v5l-3 4s0 2-1 5l-2 4-1 4-2 1c0 1 1 2 0 2 0 1-1 0-2 2 0 1-1 2-1 3 0 0 1 1 0 2s-2 1-2 3-1 4 0 5 1 2 1 4v3c0 2 1 2 1 3 0 2-1 3-1 5s-1 2-1 4-3 3-1 4c2 2 2 3 2 5 1 1 5 1 5 4s4 3 4 4c0 2-1 4 2 5 3 2 3 3 4 4 0 0 3 1 4 2 0 0 1 2 2 2 0 1 1 2 3 2s2 0 6-1h11c1-1 1-2 2-3h10c1 1 1 0 2 2s-1 4 3 4c5 0 8-1 9 0 0 1-2 3-2 4 1 2 1 2 1 3 1 1 1 2 2 2l2-1h3c2 1 2 0 4 0 1-1 2 1 2 1s1 1 2 0c2-1 1-1 1-3-1-1 0-2 1-6 0-3-2-1-2-1v-4c0-3 1-1 1-2 1-1 2-1 3-2 0 0 2 0 3-1 0 0 1-2 2-2 2-1 3-1 5-2 3-1 2-3 2-3 0-1 3-4 3-4s-1-2-2-3 0-3 0-4 0-1 1-2v-1l1-2v-2c0-1 0-1-1-1s0 0 1-1 0-2 1-3c0-1-1-5-1-6s-4 0-5 0l-1-1s-1-3-1-4-3 1-4 0v-2c0-2-2-1-3-1s-2-1-3-2c-1 0-2 1-3 1-2 0-2 0-2-1-1-1-2 0-4 0s-1-1-2-2-2 0-4-1c-2 0-1-1-1-2-1-1-2-1-2-1v-7c0-1 0-3-2-4-1 0 0-2 0-2v-2c0-1 1-2 2-2s1-1 1-1l-2-4c0-1 2-1 2-1v-1s1 0 2-1c2-1 1-3 1-3Z"
            onPress={stateMachine.bind(this, 24, "AFRICA NORTE")}
        />
        <Circle
          fill={findColor("AFRICA NORTE")}
          cx="510" cy="440" r="10"
        />
        <Text2
            x="510" y="440"  text-anchor="middle" fill="none" >{findTropas("AFRICA NORTE")}
          </Text2>
        <Path
        //SUDAFRICA
          fill="#f63"
          d="M547 504c0 1 3-1 3-1 1 1 3 2 4 3 1 0 5-1 6 0l1 1v4c1 1 3 2 3 1 1-2 8-2 8-1 1 1 0 3 1 4s2 1 2 2-2 2-1 4c0 1 2 2 3 1 2 0 2 1 3 2h7c0 1 1 2 2 2 0 1 1 3 2 2s2-5 1-6c-2 0-2 0-2-2 0-1 0-4 1-4l1-1s4 0 3-1c0 0 2 0 2 1s0 2 1 2 2 2 2 2c1 1 2 1 2 3 1 2 1 1 0 2v3c0 1 2 3 2 5-1 1-2 3-1 5 1 1 3 3 3 2 1 0 2-1 2-2v-4c0-1 2 0 1-2-1-3-2-3-1-5 1-1 2-1 4-1 1-1 2-1 2-1s1-1 2-1 3-2 3-2 3-1 2 0c0 1 1 4 1 4v2c1 1 0 1 1 2 0 1-1 2-1 2v3c0 1 0 3-1 4 0 0-1 0-1 1-1 0-1 1-2 2s-1 1-1 2c-1 2-1 1-2 3l-1 1c-2 0-2 1-3 1 0 0-2 2-2 6-1 5 0 6 0 7s-3 4-3 5-1 1-2 1c-1 1-1 3-1 4 0 0 0 3-2 4-1 1 0 1 0 2 1 0 1 1 1 2-1 2-2 1-3 2-1 0-3 3-3 4 1 1 2 1 2 1s-2 2-4 3c-1 2 1 2 1 3s-1 0-2 0c0 0-1 0-1 1-1 1-2 1-5 1-4 1-1 2-3 3s-2 1-7 1-3 1-4 1c-1 1-1 1-2 1s-2 0-3 1l-1 1-1-1c0-1-1-1-2-1s-1 0-2-1 0-2 0-2c0-1-1-3-1-4v-8c-1 0-2-1-2-3v-3c0-1-1 0-1-1-1 0-1-1-2-2v-5c0-1 0-1-1-2 0-1-1-3-1-4-1-1-1-2-1-3s0-1 1-2c0 0-1-1-1-2l-3-3-1-1c0-1-1-2-2-3s0-1 0-2v-3c-1-1-2-3-2-3v-3c1-1 1-1 1-2v-2c0-1 0-1 1-2 0-1 1-1 1-2 0-2 1-3 1-3 0-1 1-1 1-2 1-1 0-1 0-2v-2c0-1-2-4-3-5 0-1 2-3 4-5 2-3-4-8-4-9Z"
            onPress={stateMachine.bind(this, 25, "SUDAFRICA")}
        />
        <Circle
          fill={findColor("SUDAFRICA")}
          cx="570" cy="580" r="10"
        />
        <Text2
            x="570" y="580"  text-anchor="middle" fill="none" >{findTropas("SUDAFRICA")}
          </Text2>
        <Path
        //AFGANISTAN
          fill="#3c0"
          d="M707 296c-1 0-1-2-2-2l-1-1v-3l-2-1h-3c-1 0-3 0-4-1 0 0 0-1-1 0h-3l-2-1s-1 0-1-1c-1 0-1-2-2-2 0-1-1-2-1-2-1 0-1-1-2-2 0 0-1 0-2-1 0 0-1 0-1-1 0 0 0-1-1-1h-1s0-2-1-2c0-1-1-2-2-2s-1 0-2-1v-1s-2-1-2-2l-1-1-1-2h-2l-2-1v1c-1 0-1 0-2 1-1 0-4 0-4 1 0 2 0 2-1 3-1 2-1 2-2 2h-2c-1 0-2-1-2-1h-2l-1-1s-1 0-1 1c-1 0-3 1-3 1s-2 1-3 1h-1c-1 0-2 0-3 1 0 1 1 1-2 1-2 1-2 1-3 1s-2 3-2 3 1 2 0 2-1 1-2 2c0 1-1 1-1 2 1 1 0 2 1 3 0 1 1 3 1 3s1 0 0 1v3c1 1 2 1 2 1l1 1s1 0 1 1 1 2 1 3c0 0 1 2 1 1 1 0 2-1 2-2s0-2 1-2h2c1-1 1-1 2-1s1 0 1 1c1 1 0 0 1 2v4c0 2 0 2-1 2-1 1-3 2-3 3v2c0 2 0 3 1 3 1 1 1 0 1 2 0 1-1 1 0 1h3s2 0 1 2c0 1-1 0 0 2 0 1 0 0 1 2 0 2-1 2 0 2s2 1 2 1l1 2v2s-2-1-2 0c0 2 1 2 1 2s2 0 2 1v3c0 1 1 1 1 2v2c1 1 2 1 3 1 0 0 1-2 2-2h2c0 1 1 1 2 1 0 0 1 0 1 1 1 1 1 1 2 1v2c0 1 1 1 2 1h2c1 0 2 2 2 2 0 1 1 1 1 1s3 0 3-1c1-1 3-3 3-4 0 0 0-2 1-2 0 0 2-1 3 0 1 0 2 0 3-1 0-1 0-4 2-4 1 0 2-1 3 0s4 3 4 3 3 0 5-1c1-1 2-3 2-4v-2c0-1-1-4-1-4s0-1-1-1-2-2-2-2v-3s0-4 1-4l2-1h3c1-1 1-5 2-6 0-1 0-2 1-2s2 0 2-2c0-1 0-5-1-6s-1-2-1-3l1-1v-2Z"
            onPress={stateMachine.bind(this, 26, "AFGANISTAN")}
        />
        <Circle
          fill={findColor("AFGANISTAN")}
          cx="670" cy="330" r="10"
        />
        <Text2
            x="670" y="330"  text-anchor="middle" fill="none" >{findTropas("AFGANISTAN")}
          </Text2>
        <Path
        //CHINA
          fill="#3f0"
          d="M802 324c-1 0 0 0 0 1v1c0 1 1 1 1 1 1 0 0 1 0 2s0 1 1 1 1 0 1 2c0 1 1 0 2 0l1 1c0 1 0 1-2 1-1 1 2 1 3 2 1 0 1 2 1 3-1 1 0 1 1 3 1 1 0 2-1 4-1 3 1 2 2 2s1 4 0 5c-1 2 0 2 0 4s0 2-1 4c0 2 0 1-1 2v4c0 2-1 2-3 2-1 0 0 0 0 1s-1 1-2 2 0 1-1 2c0 2 0 1-1 2l-2 2v3c0 1-1 0-1 0-1 0-2 0-2 1-1 1-2 1-3 3-2 1 0 0 0 1 1 1-1 1-1 2-1 0-1 1-2 2s-2-2-4-3l-1-2c1 0-1-2-1-2-1 0-1-1-1-1 0-1-1-1-1-1v-2l-1-1h-2l-1-2h-1c-1 1-1 1-1 2-1 0-2 1-2 1s1 1 0 1h-3c-1 0-1 1-1 2 0 0 0 2-1 2s-3 0-3-1c-1-1-2-3-3-3-1 1-2-1-2-2l-1-1s-1 0-1-1 0-2-1-3c0 0-1 0-1-1-1 0-1-1-2-1h-1c0 1-1 2-1 2l-1 1h-1l-3-7h-10s-1 2-2 2l-1-2v-4c-1 0-3-1-3-1-1 0-1 2-2 2 0 0-4-2-4-3s1-1-1-1c-1 0 0 1-2 1-2-1-2-1-3-1 0-1-1-2-2-2s-3-1-3-1c0-1-1-1-1-1 0-1 0-2-1-3l-2 1c-1 1-2 0-2-1s1-2 1-2c1 0 2-1 2-1v-7c-1-1-1-4-1-4v-1c0-1 1-1 1-1h-6l-2-1v-3s0-1-1-1l-1 2v1c-2 1-3 0-3 0v-2c0-1-1-4-1-4s0-1-1-1-2-2-2-2v-3s0-4 1-4l2-1h3c1-1 1-5 2-6 0-1 0-2 1-2s2 0 2-2c0-1 0-5-1-6s-1-2-1-3l1-1v-2c1 1 1 0 2 0 2 0 1-1 1-2v-1c-1-1 0-1 0-2 0 0 2-1 2-2v-4h4c1-1 0-5 0-5h2c0 1 1 1 1 1 1 0 1 0 2 1 0 2 1 1 2 1 2 0 3-1 4-2 1 0 1 1 2 2 0 1 0 1 1 2 1 0 1 1 2 2v2c0 1-1 1-2 3-1 1 1 0 2 1l1 1c1 0 1-1 2-1 1-1 0 1 1 1 0 0 1 1 2 1l1 2c1 0 2 6 2 6h1v2s2 1 2 2v1c0 1 2 1 2 1v2s0 1 1 1h3c1 0 1 0 1 1v1c0 1 1 1 1 1h1c0 1 1 1 2 1v2s0 1 1 1 9-1 9-1v1h2c0 1 1 0 2 1h4s0 1 1 2l2-1s0-1 1 0c0 0 0-2 1-2h2s3-1 3 0v2c1 0 2 1 2 1 1 0 2-1 2-1 1 0 1-1 2-1 1 1 2 1 2 1s1 0 2 1h2s3 0 4 1 2 1 3 1Z"
            onPress={stateMachine.bind(this, 27, "CHINA")}
        />
        <Circle
          fill={findColor("CHINA")}
          cx="750" cy="355" r="10"
        />
        <Text2
            x="750" y="355"  text-anchor="middle" fill="black" >{findTropas("CHINA")}
          </Text2>
        <Path
        //INDIA
          fill="#090"
          d="M701 335c0 1-1 3-2 4-2 1-5 1-5 1s-3-2-4-3-2 0-3 0c-2 0-2 3-2 4-1 1-2 1-3 1-1-1-3 0-3 0-1 0-1 2-1 2 0 1-2 3-3 4 0 1-3 2-3 1v3s0 1-1 8c0 3 1 1 2 3v2c0 1 1 3 2 4v2c0 1 1 2 2 3s1 3 0 4 1 1 1 3c1 1 2 5 2 6l2-2c1 0 3 0 3 1 1 1 0 3 1 4l2 1h2c1 0 1-1 1 1v2c1 1 3 1 3 1s2 0 1 1-2 1-2 2-1 1 0 1 1 0 1 1l1 1c1 1 0 1 2 1 1 1 2 0 2 0v-1s1-2 2 0c1 1 0 1 0 3s-1 4-1 5v6c0 2 2 1 2 2 0 2-1 2 0 3 1 0 2 2 2 3v2c0 1 0 2 1 3 1 0 2 0 2 2 0 1 1 3 1 3s1 1 1 2l1 1c0 1 1 0 2 5s2 2 3 6 2 5 3 5 2 0 2-1 0-1 1-1c1-1 1-1 1-2s-1-1-1-2c1 0 0-2 1-2 2 0 3-1 3-1l-1-1v-3c1-3 1-4 1-6 0-3-1-2 0-5s2-1 2-4c0-2 1-4 1-6 0-1 1 0 1-2 0-1-1-2 0-3s2-2 2-3v-3l1-2s2 0 1-1v-4c1-1 2-4 3-3l2 1 2-2v-2s0-2 1-2h3s-1-4 0-4 2 0 2-1 1-2 1-2c1 0 1-3 1-3h2s0-4 1-5 2-3 2-3l-3-7h-10s-1 2-2 2l-1-2v-4c-1 0-3-1-3-1-1 0-1 2-2 2 0 0-4-2-4-3s1-1-1-1c-1 0 0 1-2 1-2-1-2-1-3-1 0-1-1-2-2-2s-3-1-3-1c0-1-1-1-1-1 0-1 0-2-1-3l-2 1c-1 1-2 0-2-1s1-2 1-2c1 0 2-1 2-1v-7c-1-1-1-4-1-4v-1c0-1 1-1 1-1h-6l-2-1v-3s0-1-1-1l-1 2v1c-2 1-3 0-3 0Z"
            onPress={stateMachine.bind(this, 28, "INDIA")}
        />
        <Circle
          fill={findColor("INDIA")}
          cx="700" cy="390" r="10"
        />
        <Text2
            x="700" y="390"  text-anchor="middle" fill="none" >{findTropas("INDIA")}
          </Text2>
        <Path
        //IRKUTSK
          fill="#3f6"
          d="M807 271v1s-1 1-2 1c-1-1-2-1-2-2s-1-1-1-1-2 0-2-1c0 0 0-1-1-2v-2h-2v-1c-1-1-1-2-1-2l-1-1c-1 0-2 1-2 0v-4s-1 0-1-1c0 0 0-1-1-1s-1 0-2 1l-1 1h-4l-1-1h-1c0 1 1 1 0 2v1c-1 0-2 0-2 1l1 1v1c1 0 1 0 1 1s0 2-1 2l-1 1v1c0 1-1 1 0 2 0 0 0 1 1 1v2c0 1 0 1-1 2 0 0-1 1-1 2-1 0 0 1-1 0-1 0-1-1-1-1v-1c-1-1-1-2-1-2s-2-1-2 0c-1 0 0 1-1 1l-1 1c0 1-1 2-2 1h-3c-1 1-2 2-2 1-1 0-2 0-2-1h-5c-1 0-2-1-3-1s-3-1-4-1-1 0-2 1c0 0-1-1-1 0 0 0 0 1-1 1h-2c0-1-1-1-1-1s0-1-1 0h-1l-1-1-1-1-2 1h-1c-2 0-1 0-2-1-1 0 0-1-1-3-1-1-1 1-1 1s-1 0-2-2c0-2 1-1 1-3v-3c0-2 1-1 1-1v-4c0-3-1-1-2-3-1-1 0-1 0-2 1 0 1-1 2-2 1-2 1-1 3-2 2 0 1-2 3-3 2 0 1 0 2 1s2 0 3-1c2 0 2-1 4 0 2 0 1 0 2 1 0 2 1 2 3-1 2-2 0-8-1-11-1-4 3-11 3-11s5-2 6-2c1-1 1-1 2-3 0-2 0-5 2-5 1 0 1 2 1 2 0 1 1 0 3 1 1 0 0-1 0-2v-1c0-1 12 0 12 0v3s2 3 1 5c0 2-1 8 0 9 0 1 0 4 1 5s1 1 1 2c1 1 4 2 5 3 1 2 0 2 1 3 1 0 2 2 2 3s0 3 1 3c1-1 2-2 3-2 0 0 1-1 2 0h5s1 1 1 2 0 1 1 1c2 0 2 0 2 2 1 2 2 2 2 2v3s-1 1-1 2c1 2 1 3 1 4-1 0-2 2-2 3v5Z"
            onPress={stateMachine.bind(this, 29, "IRKUTSK")}
        />
        <Circle
          fill={findColor("IRKUTSK")}
          cx="750" cy="270" r="10"
        />
        <Text2
            x="750" y="270"  text-anchor="middle" fill="none" >{findTropas("IRKUTSK")}
          </Text2>
        <Path
        //JAPON
          fill="#0f6"
          d="M829 335v-5c-1 0-1-1-2 0-1 0-3-1-3-1s0-1 2-2c2-2 3-2 3-2l-1-1s-2 0-1-1 1-2 2-3 3-6 4-8c2-2 4-2 4-2l2-5s-1-3 1-5c3-1 3 1 4-2s3-3 3-4 1-1 0-3c0-2-2-3-2-3v-4c0-2-1-4 1-4 1-1-2-4-2-4s1-1 0-2c-1 0-1-1-1-2v-3s1-2 2-2c0 0 1 0 1-1 0-2-1-5-1-5s-4-5-4-6c-1 0-1 0 0-1 0-1 4 4 6 4 3 1 5 0 5 0l2-1h5s2 0 2 2 3 2 2 3c-2 2-1 3-3 3-1 0-1-1-2-1 0 0-1 0-1 2s1 2 0 4c-1 1-1 2-2 2h-6c-1 1-2-1-2 1 0 1 0 2 1 2s1 0 1 1-2 2-1 2c1 1 2 0 2 1h3v1s1 0 2 1c1 0 2-1 2 0s1 2 1 2v1c1 1 1 2 1 3s-1 3-1 3-1 1-1 3c1 1 1 0 1 1 1 2 1 3 1 4s-1 1 1 2c1 1 1 2 1 2s1 0 1 1v3h-3l-1 1c0 2-1 2-1 2s0 2-1 2-1 0-2 1h-2c0 1 0 2-1 2 0 0-1-2-2 1 0 2 2 3 0 3-2 1-3 1-3 1s0 2-1 1c-1 0-2-1-2-2s-1-2-1-2l-2 2s0 1-2 1c-1 0-2-2-2 0 1 2 1 3 2 4 0 1 1 0 1 1-1 1 0 1-1 2s-2 1-3 1h-2c-1 0-2 7-2 7l-1 1h-1Z"
            onPress={stateMachine.bind(this, 30, "JAPON")}
        />
        <Circle
          fill={findColor("JAPON")}
          cx="860" cy="310" r="10"
        />
        <Text2
            x="860" y="310"  text-anchor="middle" fill="none" >{findTropas("JAPON")}
          </Text2>
        <Path
        //KAMCHATKA
          fill="#0c6"
          d="M818 289c1-1 1 0 2-2 0-2 0-2 1-3 0 0 2-3 2-4 0-2-1-2-1-3 1-2 1-2 1-4s0-2 1-4v-4c0-1-1-2-1-3v-6l-2-2v-1c-1-1-1-1-1-2s-1 1-1-3c1-3 1-4 1-4s-1-4-3-4-3 1-3-1-1-2-3-2c-1-1-2 0-2-1h-4c-2-1-2 0-2-1s0-2 1-5c2-2 2-3 2-4 1-2-1-1 1-3 3-2 2-3 5-3 2 0 3 0 4-1 2-1 1-2 3-1s2 2 3 1c2-1 2-2 3-2l3 2h1c1 0 2 2 3 0s0-2 0-3c-1 0-2 2-2-1 1-3 1-4 1-5-1-1-3-5 0-3 3 3 2 3 3 4 2 0 1 0 1 3 1 2 5 1 4 4 0 3 0 4-1 6 0 1-1 0-1 5s1 14 5 18c5 4 6 5 7 3 0-2 1-2 0-4 0-2-1-3 0-5 1-1 1-2 1-3s1-2 1-3c-1-1 0-3-1-4v-4c0-1-1-2-2-3 0-1-1-3-2-4 0-1 0-2 1-4 1-1-1-2 2-2s2 1 4 1c1-1 3 0 3-2 1-1 1-1 1-2 1-2 2-1 3-3 1-1-1-2 2-4 2-2 4-3 4-3 1-1 2-1 1-2s-1-2-2-3c-2-1-2-2-3-2s-2 0-1-1c1 0 2-1 3-1s1 1 2 0c2-1 2-1 3 0 1 0 1 0 1 1 1 2 0 1 2 2 2 2 4 2 4 2 1 0 0 1 2 0l2-2c1-2 2-2 1-4 0-1-1-2-1-3l-1-2s0-1-1-1h-3c0-1 0-2-1-2s-2-1-2 0c-1 1-2 2-2 1-1 0-2-1-2-1v-2l-2-2-2-1s-3-3-4-3-3 0-3-1 2-1-1-1c-3-1-4 0-5-2-1-1 1-2-2-2-2 0-3 1-5 0-3-1-3-2-4-1s0 1-1 2c-2 1-1 2-3 2s-2 1-3 0c-1 0-1-1-3-1h-2c-2 0-1 1-3 0l-4-2c-2-1-2-1-3-1s-5-1-6 0c0 0-1 2-1 3s1 3-1 3h-1c-1 0-1 0-1 1-1 0-1 0-1 1-1 1-1 2-2 2 0 0-2 0-2 1-1 0 0 0-1 3 0 3 0 7 1 8h4s1 1 1 2v3c0 1-1 1-1 2v3c-1 0-2 1-2 1h-3s0-1-1-1h-3c-1 0 0 1-1 0-1-2 0-3-1-4 0 0-4 0-5 1 0 2-2 3-2 3s-1-2-2 1-3 5-3 5 1 3 0 4l-3 3v3s2 3 1 5c0 2-1 8 0 9 0 1 0 4 1 5s1 1 1 2c1 1 4 2 5 3 1 2 0 2 1 3 1 0 2 2 2 3s0 3 1 3c1-1 2-2 3-2 0 0 1-1 2 0h5s1 1 1 2 0 1 1 1c2 0 2 0 2 2 1 2 2 2 2 2v3s-1 1-1 2c1 2 1 3 1 4-1 0-2 2-2 3v8c0 1-4 1-2 3s2 4 4 4 3 3 3 4c1 1 1 2 3 2 1 0 1 2 2 2h1Z"
            onPress={stateMachine.bind(this, 31, "KAMCHATKA")}
        />
        <Circle
          fill={findColor("KAMCHATKA")}
          cx="820" cy="210" r="10"
        />
        <Text2
            x="820" y="210"  text-anchor="middle" fill="none" >{findTropas("KAMCHATKA")}
          </Text2>
        <Path
        //ORIENTE MEDIO
          fill="#0f0"
          d="M652 343c0 1 1 1-1 1l-2 2s1 1-2 1c-3-1-3-1-4-2-2 0-1 1-3 0-1-1-1-1-1-2-1-1-3-2-3-2s-1 0-1 1 2 1-1 1h-1c-1 0-2 0-2 1-1 0-1 0-2 1h-2c-1 0-1 1-1 1h-4s0 2-1 1c-2-1-2-1-2-2 0 0 0-1 1-1 0 0-1-2-3-1-1 0-3 0-3 1 0 0-1 1-2 1 0 1-2 1-3 0 0-1-1-2-4-3-2-1-4-2-5-1s0 1-2 1c-2-1-4-1-4-1-1 0-2 0-2 1 0 0 0 1-1 1s-2 1-2 1c-1 0-1 1-3 1s-4 0-5-1c-1 0-2-1-2-2l-1-1h-2l-1 1c-1 1-1 1-1 2-1 0-1 0-2 1v1c-1 1-1 0-1 1-1 1 0 1 0 2s1 1 0 2c0 0 1 2 1 3 1 1 2 1 1 2-1 0-2 0-2 1s2 4 3 5 0 4 1 5c2 1 3 2 4 2s2-2 3-1c0 2-1 4 0 4s3 1 3 1c0-1-1-3 0-3 1-1 0-3 3-2 2 1 2 2 4 2h4c1 0 2 1 2 0 1-1 1-2 2-2s3-1 4 1c0 1-1 2-1 3s1 1 1 7 1 9 0 10c-1 0-2 2-2 3 1 1 2 4 2 6 1 2 1 3 1 4 1 1-1 1 1 3 1 1 4 2 4 4 0 1 2 1 3 3 1 1 2 4 2 6 1 2 2-1 3 2 0 3 3 2 3 4 1 2 3 4 4 5 1 0 4 1 4 3-1 1 2 3 2 4v4s0 1 1 2 1 1 2 3c0 1 1 1 1 1s10-1 13-2 7-3 7-4 0 0 2-1c1 0 2-2 2-2l2-2s0-2 1-1c1 0 3 1 3 0s-1 0 2-5 4-7 3-8c0-1 0-1 1-2 1 0 2-3 2-3l-1-2 1-2s1-4 0-5c-1 0-1-1-1-2 0-2-1-3-1-3s0 1-2 0c-1 0-3-2-3-2s-2 1-2 0 1-3 0-2c-1 0-2 0-3 1 0 1 1 2-2 2s-4 1-5 0c-1-2-1-2-1-3 0-2 1-1-1-2-1-1-2-1-2-2v-1s-2 0-2-1c-1-1 1-2-1-4l-2-2c0-1-1-2-1-2s-1 0-1-1c1-1 1-1 2-1 2 0 2-1 3-1 1-1 0-1 2-1 1-1 1-2 1 0 1 1 1 2 1 4v4c1 1 1 2 1 2 0 1 1 2 1 2h1c1 0 1-1 1 0s0 1 1 1c0 1 0 1 1 1s1-1 2-1 1 1 1 1 2 0 2-1-1-2 0-3c0 0 1-2 2 0 1 3 0 3 1 4 0 1 1 1 2 1s1 0 2-1 2-1 2-1-1-2 0-2c2-1 3-2 3-2l1-1 1-1h3s-1-5-2-6c0-2-2-2-1-3s1-3 0-4-2-2-2-3v-2c-1-1-2-3-2-4v-2c-1-2-2 0-2-3 1-7 1-8 1-8v-3s-1 0-1-1c0 0-1-2-2-2h-2c-1 0-2 0-2-1v-2c-1 0-1 0-2-1 0-1-1-1-1-1-1 0-2 0-2-1h-2c-1 0-2 2-2 2-1 0-2 0-3-1h-1v2Z"
            onPress={stateMachine.bind(this, 32, "ORIENTE MEDIO")}
        />
        <Circle
          fill={findColor("ORIENTE MEDIO")}
          cx="620" cy="400" r="10"
        />
        <Text2
            x="620" y="400"  text-anchor="middle" fill="none" >{findTropas("ORIENTE MEDIO")}
          </Text2>
        <Path
        //MONGOLIA
          fill="#096"
          d="m737 273 1 1c0 1 1 2 0 4-1 1-2 3-1 5s3 2 3 4c0 1-1 0-1 2v4c0 1-1 2-1 2l1 2c1 0 2 6 2 6h1v2s2 1 2 2v1c0 1 2 1 2 1v2s0 1 1 1h3c1 0 1 0 1 1v1c0 1 1 1 1 1h1c0 1 1 1 2 1v2s0 1 1 1 9-1 9-1v1h2c0 1 1 0 2 1h4s0 1 1 2l2-1s0-1 1 0c0 0 0-2 1-2h2s3-1 3 0v2c1 0 2 1 2 1 1 0 2-1 2-1 1 0 1-1 2-1 1 1 2 1 2 1s1 0 2 1h2s3 0 4 1c0 0 2 1 3 1 1-1 1 0 2-1 1-2 0-1 2-3 1-2 3-2 1-2-3 0-2 0-3-1-1 0 0-1-2-1-1 1-1 1-2 0 0 0 1-1-1-1s-1 1-2 0c-2-1-2 0-2-1s0-2 1-2c1-1 1 0 2-1 0 0 1 0 1-1s1-1 1-2c1-1 1-3 1-3 1 0 1 0 2 2 0 2-1 2 1 2 1 1 2 1 3 1 1-1 0 0 1 1l2 2c1 0 1 2 1 2h4s-1-1 0 1 1 2 1 4-1 3 0 3c1 1 2 1 2 1s3-2 3-4c0-1 1-1 1-2s-1 0 0-1v-3s0-1-1-1l-1-1c0-2 1-2 0-2s-2-1-2-2 0-1-1-1l-1-1c-2-1-2-1-3-2-1 0-1-1-1-1 0-1 0-2 1-2 0-1 1 1 1-2 0-2-1-2 0-4 1-3 1-3 2-4 0-1 0 0 2-2h-1c-1 0-1-2-2-2-2 0-2-1-3-2 0-1-1-4-3-4s-2-2-4-4 2-2 2-3v-2s-1 1-2 1c-1-1-2-1-2-2s-1-1-1-1-2 0-2-1c0 0 0-1-1-2v-2h-2v-1c-1-1-1-2-1-2l-1-1c-1 0-2 1-2 0v-4s-1 0-1-1c0 0 0-1-1-1s-1 0-2 1l-1 1h-4l-1-1h-1c0 1 1 1 0 2v1c-1 0-2 0-2 1l1 1v1c1 0 1 0 1 1s0 2-1 2l-1 1v1c0 1-1 1 0 2 0 0 0 1 1 1v2c0 1 0 1-1 2 0 0-1 1-1 2-1 0 0 1-1 0-1 0-1-1-1-1v-1c-1-1-1-2-1-2s-2-1-2 0c-1 0 0 1-1 1l-1 1c0 1-1 2-2 1h-3c-1 1-2 2-2 1-1 0-2 0-2-1h-5c-1 0-2-1-3-1s-3-1-4-1-1 0-2 1c0 0-1-1-1 0 0 0 0 1-1 1h-2c0-1-1-1-1-1s0-1-1 0h-1l-1-1-1-1-2 1h-1Z"
            onPress={stateMachine.bind(this, 33, "MONGOLIA")}
        />
        <Circle
          fill={findColor("MONGOLIA")}
          cx="755" cy="310" r="10"
        />
        <Text2
            x="755" y="310"  text-anchor="middle" fill="none" >{findTropas("MONGOLIA")}
          </Text2>
        <Path
        //SUDESTE ASIATICO
          fill="#3c6"
          d="M788 388c-2-1 0-2-3-3-4 0-4 9-3 10 0 1 1 2 3 2 2-1 2 0 2 2 1 2 0 4 0 4s1 0 2-1c1 0 3 1 4 4 1 4 1 4 2 6s1 3 2 6c0 2-1 6-1 7 0 2-4 6-4 7s-3 3-3 4-2-1-2-1-1-3-1-4l-2-2 1-2s-2-1-3-1-1-1-1-1l-2-1s0-1-1-1c-2 0-1 0-2 1 0 1 0 1-2 2-1 2 1 1 2 2 1 2 1 1 1 3s0 3 2 8c1 4 1 1 1 1s1 1 1 2c0 2-1 2-1 2h-4c-1-1 0-1-3-4-2-3-2-4-3-4-1-1 0-2 0-3 0-2 0-3-1-4s-1-2-1-4c-1-1 0-3 0-4 0-2-1-2-1-4l-1-2s-4-3-5-2-2-2-2-2-3 1-4 0c0-2-6-8-7-10 0-2 0-4-1-4s-2-3-2-3l-1-2c-1-3 0-4 0-4 1 0 2 0 2-1s1-2 1-2c1 0 1-3 1-3h2s0-4 1-5 2-3 2-3h1l1-1s1-1 1-2h1c1 0 1 1 2 1 0 1 1 1 1 1 1 1 1 2 1 3s1 1 1 1l1 1c0 1 1 3 2 2 1 0 2 2 3 3 0 1 2 1 3 1s1-2 1-2c0-1 0-2 1-2h3c1 0 0-1 0-1s1-1 2-1c0-1 0-1 1-2h1l1 2h2l1 1v2s1 0 1 1c0 0 0 1 1 1 0 0 2 2 1 2l1 3Z"
            onPress={stateMachine.bind(this, 34, "SUDESTE ASIATICO")}
        />
        <Circle
          fill={findColor("SUDESTE ASIATICO")}
          cx="745" cy="415" r="10"
        />
        <Text2
            x="745" y="415"  text-anchor="middle" fill="none" >{findTropas("SUDESTE ASIATICO")}
          </Text2>
        <Path
        //SIBERIA
          fill="#0c0"
          d="M683 193c1 2 2 1 3 0s0 0 0-2c0-1 0-1-1-2s0 0-2 0h-5c-2 0-1-1-1-2v-2l-2-2v-4c0-1 0 0-1-1v-1l1-1h2l1 1h2l3 3c2 2 1 0 2 0h1s-2-1-2-2c0 0 1-1 1-2 0 0 0-2-1-2 0-1-1-1-1-2-1 0-1-2-1-2s-1 0 0-3c1-2 1 1 1 1h1l1 2 2-1c1 0 2 2 2 2h3c1 0 2-1 2-2s-2 0-2 0l-3-1s-4-1-5-2 0-2 0-2l2-2s1-1 2-1h3s1-3 1-4c0-2 3-1 3-1s1 0 2-1c0 0 2-2 5-4 4-2 4-1 5-1h4c0-1 2-2 2-2 1 0 3-1 3-1 0 1 1 2 1 3 0 0 1-1 3-2s1-1 2-2 1-1 3-1c1 1 0 2 0 3 1 1 2 2 4 3 1 1 4-4 4-1 1 2 4 3 4 4l-3 3-2 2v2c0 1 0 0-2 1l-2 2c0 1-1 1-2 1s0 1-1 2c0 1 1 1 1 1s1-1 2-1c0-1 3-2 3-2 1-1 3-2 4-3 1-2 3-1 4-1 1-1 2 0 2 0s1 0 2-1c1 0 4-1 5-1 0 0 2 0 3 1l3 3 2-1v3c0 1 0 2 1 3s1 1 2 1v5c0 1-1 1-1 1-1 1-1 2-1 3 0 2-1 1-1 3-1 1 0 1 0 2 1 1 1 2 1 3 0 2 0 1-1 1s-1 1-3 1c-1 0-2 1-3 0 0-1-1-1-3-1-3 0-1 1-1 2s-1 1-3 1c-1 1-1 1-1 2 0 2 2 3 3 3l2 2s1 0 3 1c1 2 0 2-1 3s0 4 1 5c1 0 1 1 2 4 0 3 1 3 1 3s1 1 1 4 1 6 1 6-4 7-3 11c1 3 3 9 1 11-2 3-3 3-3 1-1-1 0-1-2-1-2-1-2 0-4 0-1 1-2 2-3 1s0-1-2-1c-2 1-1 3-3 3-2 1-2 0-3 2-1 1-1 2-2 2 0 1-1 1 0 2 1 2 2 0 2 3v4s-1-1-1 1v3c0 2-1 1-1 3 1 2 2 2 2 2s0-2 1-1c1 2 0 3 1 3 1 1 0 1 2 1l1 1c0 1 1 2 0 4-1 1-2 3-1 5s3 2 3 4c0 1-1 0-1 2v4s-1 1-1 2c-1 0-2-1-2-1-1 0 0-2-1-1-1 0-1 1-2 1l-1-1c-1-1-3 0-2-1 1-2 2-2 2-3v-2c-1-1-1-2-2-2-1-1-1-1-1-2-1-1-1-2-2-2-1 1-2 2-4 2-1 0-2 1-2-1-1-1-1-1-2-1 0 0-1 0-1-1 1-1 1 0 1-2 0-1 0-4-1-5s-1-1-1-2v-1c-1 0-2-2-3-3 0-1-1-1-1-1-1 0-2-2-2-2s-4 0-3-1v-2c0-1 1-3 0-4 0-1-1-2-2-2s-2 0-2 1c-1 1-2 1-2 1s-1 0-1-1c0 0 0-3 1-4 1-2 1 0 1 0 1-1 1-3 1-3 0-1 0-2 1-3s2-1 2-2c1-1 1-1 1-2-1 0-2-1-2-2s1-1 0-2-1-1-1-2c0 0 1 0 0-1-2-1-2 0-2-2v-3c1-1 0-3 0-4-1 0-1-1-2-1v-2c-1 0-2-1-2-2l-1-1c0-1-1-2-2-2l-2-1c-1-1-1-2 0-2v-3c-1-1-1-2-1-3 0-2 0-2-1-2h-2v-3l-2-4-1-1c-1-1-2-1-2-1-1-1-1-1-1-2-1-1-1-3-1-3Z"
            onPress={stateMachine.bind(this, 35, "SIBERIA")}
        />
        <Circle
          fill={findColor("SIBERIA")}
          cx="710" cy="220" r="10"
        />
        <Text2
            x="710" y="220"  text-anchor="middle" fill="none" >{findTropas("SIBERIA")}
          </Text2>
        <Path
        //URAL
          fill="#390"
          d="M665 265c1 0 0-1 0-3v-3c0-1-1-2-1-3 0 0 2-1 2-3 1-1 0-2 0-3s-2-1-2-1l-3-2-1-1v-3c0-2 1-2 2-3v-4c0-1-1-1-1-1v-9c0-1-1-3-2-4 0-1 1-3 1-3s-1-2-1-3 1-4 1-4l2-5 1-2s0-4 1-4v-4s-1-7-2-7l1-3-1-1v-2l-3-1 1-3s1-2 2-2c0 0-2-2-2-3v-1c1 0 1-1 1-2l-1-1 1-3 3 1 1 1c1 1 2 0 2 0 1 0 0 1 1 2 1 2 1 0 2 0 1 1 1 2 1 2 0 1-1 2-1 3l-2 2c-1 1 2 2 2 2s0 1 1 2c0 1 0 0 1 1 1 0 0 1 0 2 0 0 1 1 1 2 1 1 0 1 1 3 1 1 2-1 2-1s0 1 1 2c0 1 2 1 2 1l2-2 1-1c1 0 0 0 1 2s0 3 1 4c0 1 0 1 1 2 0 0 1 0 2 1l1 1 2 4v3h2c1 0 1 0 1 2 0 1 0 2 1 3v3c-1 0-1 1 0 2l2 1c1 0 2 1 2 2l1 1c0 1 1 2 2 2v2c1 0 1 1 2 1 0 1 1 3 0 4v3c0 2 0 1 2 2 1 1 0 1 0 1 0 1 0 1 1 2s0 1 0 2 1 2 2 2c0 1 0 1-1 2 0 1-1 1-2 2s-1 2-1 3c0 0 0 2-1 3 0 0 0-2-1 0-1 1-1 4-1 4 0 1 1 1 1 1s1 0 2-1c0-1 1-1 2-1s2 1 2 2c1 1 0 3 0 4v2c-1 1 3 1 3 1s1 2 2 2c0 0 1 0 1 1 1 1 2 3 3 3v1c0 1 0 1 1 2s1 4 1 5c0 2 0 1-1 2h-2s1 4 0 5h-4v4c0 1-2 2-2 2 0 1-1 1 0 2v1c0 1 1 2-1 2-1 0-1 1-2 0-1 0-1-2-2-2l-1-1v-3l-2-1h-3c-1 0-3 0-4-1 0 0 0-1-1 0h-3l-2-1s-1 0-1-1c-1 0-1-2-2-2 0-1-1-2-1-2-1 0-1-1-2-2 0 0-1 0-2-1 0 0-1 0-1-1 0 0 0-1-1-1h-1s0-2-1-2c0-1-1-2-2-2s-1 0-2-1v-1s-2-1-2-2l-1-1-1-2h-2l-2-1Z"
            onPress={stateMachine.bind(this, 36, "URAL")}
        />
        <Circle
          fill={findColor("URAL")}
          cx="670" cy="249" r="10"
        />
        <Text2
            x="670" y="249"  text-anchor="middle" fill="none" >{findTropas("URAL")}
          </Text2>
        <Path
        //YAKUTSK
          fill="#396"
          d="M810 170c-1-1 0-1-1-2-2-1-3-1-4-1-1-1-1-1-1-2 1-2 3-2 0-2-2-1-2-2-3-2-2 0-2 0-3 1h-1v1c-1 0-1 0-2-1s0-1-1-1h-2c-2 1-2 1-4 1-1 0-3 2-3 2h-1c-1 0 0-1-2 1-2 1-1 1-3 1-1 0 0-1-2 0s-2 0-2 1-1 2-1 2v-2c-1-1-1-1-1-2s-5-2-6-4c-1-1-1-1-1-3 0-1-3-2-4-2 0 0-1 2-2 2-1 1-1 2-2 3-1 0-2 1-2 1v3c0 1 0 2 1 3s1 1 2 1v5c0 1-1 1-1 1-1 1-1 2-1 3 0 2-1 1-1 3-1 1 0 1 0 2 1 1 1 2 1 3 0 2 0 1-1 1s-1 1-3 1c-1 0-2 1-3 0 0-1-1-1-3-1-3 0-1 1-1 2s-1 1-3 1c-1 1-1 1-1 2 0 2 2 3 3 3l2 2s1 0 3 1c1 2 0 2-1 3s0 4 1 5c1 0 1 1 2 4 0 3 1 3 1 3s1 1 1 4 1 6 1 6 5-2 6-2c1-1 1-1 2-3 0-2 0-5 2-5 1 0 1 2 1 2 0 1 1 0 3 1 1 0 0-1 0-2v-1c0-1 12 0 12 0l3-3c1-1 0-4 0-4s2-2 3-5 2-1 2-1 2-1 2-3c1-1 5-1 5-1 1 1 0 2 1 4 1 1 0 0 1 0h3c1 0 1 1 1 1h3s1-1 2-1v-3c0-1 1-1 1-2v-3c0-1-1-2-1-2h-4c-1-1-1-5-1-8 1-3 0-3 1-3 0-1 2-1 2-1 1 0 1-1 2-2 0-1 0-1 1-1 0-1 1-1 2-1 2 0 1-2 1-3l-1-1Z"
            onPress={stateMachine.bind(this, 37, "YAKUTSK")}
        />
        <Circle
          fill={findColor("YAKUTSK")}
          cx="760" cy="205" r="10"
        />
        <Text2
            x="760" y="205"  text-anchor="middle" fill="none" >{findTropas("YAKUTSK")}
          </Text2>
        <Path
        //AUSTRALIA ORIENTAL
          fill="#93f"
          d="M825 511v-1c1-2 0-4 1-5 1-2 1-2 3-2l2-2c0-1 1-1 2-1s2 1 3 0 0-2 1-1h2c1 1 2 1 5 1 2-1 3-2 3-1 0 2 0 2 1 2s1 0 0 1c0 1 0 0-1 2-2 2-3 2-3 4v2s0 2 1 2 1 0 3-1c2 0 3 0 3 2 0 1 1 4 2 4 1 1 1 1 3 1 2-1 3 0 3-1v-4c0-1-2 1 1-2 2-4 2-2 2-6-1-3-2-3-1-6l1-2s2 0 2 2c0 3 1 5 1 6s1 5 1 5 1 1 2 1c0-1 1-1 1-2s1-3 1-2 1 1 1 2v3c1 2 2 3 2 3v9c0 2 0 2 1 2l1 1c1 0 1-1 2 0 0 1 0 1 2 1 1 1 2 0 2 0s1 1 1 2-1 2 0 3c0 2 0 2 1 2h1s1 1 1 3v2l1 1s1 1 1 2c1 1 2 1 2 1v2l1 1c1 2 1 2 1 3s1 2 1 3v4c-1 2 0-1-1 2v5c0 1 0 1-1 3v3s-1 2-2 2-3-1-3 0 0 2 1 2 1-1 1 1c0 1 0 1-1 2s-1 1-2 1c-2 1-1 0-2 2-1 3 0 3-1 4-1 0-1 0-1 1-1 2-1 2-1 3v2s-2 1-2 3c0 1 1 1 1 2-1 1 0 1-2 1h-2l-3 1s0-1-1-1c-1 1-1 1-1 2-1 1-1 1-2 1-1 1 0 1-1 2 0 1 0 1-1 1-1-1-2 0-2-1 0-2 0-2-2-2-1-1-2-1-2-1v1c-1 1 0 2-2 2-1 1-1 1-2 0v-7c1-1 0-1-1-2 0-1 1-43 1-43 0-1-30 0-30 0v-38Z"
            onPress={stateMachine.bind(this, 38, "AUSTRALIA ORIENTAL")}
        />
        <Circle
          fill={findColor("AUSTRALIA ORIENTAL")}
          cx="860" cy="580" r="10"
        />
        <Text2
            x="860" y="580"  text-anchor="middle" fill="none" >{findTropas("AUSTRALIA ORIENTAL")}
          </Text2>
        <Path
        //NUEVA GUINEA
          fill="#c3f"
          d="M825 457s1-3 2-3c1-1 0-1 0-3 0-1-1-2 0-2 2-1 2 0 4-1 1 0 3-1 3-1l2 2h3c2 0 3 1 4 3s0 3 3 4c3 2 5 3 7 3 1 1 3 2 2 3 0 2 2 2 0 3 0 0 5 2 6 4 1 1 2 2 1 3-2 1-3 0-3 1s1 2 1 3c1 1 2 2 2 4 0 1 0 2 1 3 2 1 2 1 2 2v2s-1 1-3 1-3-1-3-1c-1 0-3-1-3-1s-1-4-5-5c-3-1-3-2-3-1s1 2 0 3h-3c-1 0 3 2-2 2-4 0-5-2-7-1s-7-4-7-4-3 1-3-1c0-1-1-1 0-3 1-1 1-1 1-2v-4c0-1 1-2 0-2-1-1-2-1-2-2-1-1-1-2-1-2-1 0 0 1-2 1-1 0-2 1-4-1-1-2-1-2-3-2-3 0-8 4-4 0 4-3 5-3 5-3s-4 0-4-2c0-1-1-3-2-4-1 0-2 0-1-2 0-1 1-5 4-5 4 0 5 1 6 2 1 0 3-1 3 0v5s1 1 2 3l1 1Z"
            onPress={stateMachine.bind(this, 39, "NUEVA GUINEA")}
        />
        <Circle
          fill={findColor("NUEVA GUINEA")}
          cx="850" cy="470" r="10"
        />
        <Text2
            x="850" y="470"  text-anchor="middle" fill="none" >{findTropas("NUEVA GUINEA")}
          </Text2>
        <Path
        //INDONESIA
          fill="#63c"
          d="M771 513c1 1 0 2 2 2s3-1 4-1c2 1 1 1 2 1 2 0 3-1 4-1h3s2 1 3 1h5c0 1 2 2 3 1s1-1 1-2 0-2-1-2c0-1 0-1-2-1s-3-1-3-1c-1 0-2-1-3-1 0-1-3-2-4-2h-5c-2 0-2 0-4 1-1 1-2 1-3 2s-1 0-1 1l-1 2Zm23-8c1-2 0-2 0-3 0-2 1-1 1-2 1-1 1-3 2-1s1 3 2 4 2 2 3 1 3-2 2-4c-2-1-2 0-2-3-1-3-1-4-2-4 0 0-1 1-1-1 0-1-1-3 0-4 2 0 3 1 4 0 1-2 2-3 0-3h-3c-1 0-2 0-2-1s-1-1 1-1h3c2 0 3-1 4-2 0 0 1-2 2-3l1-1c0-1-1-1-1-2h-3c0 1-1 2-2 3h-6c-1 1-2 1-2 2-1 0-2 1-2 2v4s-1 2-1 3c-1 0 0 2-1 3v2c0 1-1 1 0 2 0 1 1 1 0 2 0 1-1 1 0 2 0 1 1 1 1 2v3c0 1 2 0 2 0Zm-10-7s-1-1 1-3c3-2 3-2 3-4s0-2-1-3-2-2-1-3c1-2 1-2 3-3 1 0 3-2 3-3v-3c0-1-1-3-2-4v-4c0-1 1-1 2-2 2-1 2-1 2-3s0-4-1-5c-1 0-1 0-2-1-2 0-2-1-4-2-2-2-3-2-4-1 0 1 1-2 0 2-1 3-1 3-1 4-1 1-3 1-3 2 0 2 1 2-1 5-2 2-6 6-8 6-3 1-5 1-5 2s1 2 1 3-2 2-2 3c1 0 1 0 2 1v4l3 3s-2 3-1 3l2 2c1 2 2 3 4 3 1 0 2 1 3 1 1 1 2 0 3 0s4 1 4 0Zm-24-17 1-1v6c1 0 0 1 0 2s1 3 1 3l1 1 2 1v1c1 1 2 1 2 1v2c0 1-1 2 0 2h3c1 0 0 1 1 2 0 1 1 1 1 2v3c-1 1 0 1-1 2s-2 1-2 1c-1 0-1 0-2 1 0 1 2 2 0 2-3-1-3 0-3-1-1-1 1-2-1-3-2 0 0 2-3-1-3-4-3-1-4-4 0-4-1-4-3-7-1-2-2-4-3-4s-2 1-3-1v-2c0-2 0-2-1-4-1-1-1-1-2-3 0-2 0-1-2-4s-3-3-5-5c-2-1-2-1-2-3s-1-4 0-5c1 0 1-1 3 0 1 1 1 2 2 2h2c1 0 1-1 2 1 1 1 2 1 2 3l2 2c0 1 1 1 1 1 1-1 2-2 2-1s0 1 1 1c0 1 1-1 1 1 0 3-1 4 0 3l2-2 1 1c0 1 0 3 1 3 1 1 2 1 2 1h1Z"
            onPress={stateMachine.bind(this, 40, "INDONESIA")}>
        </Path>
        <Circle
          fill={findColor("INDONESIA")}
          cx="755" cy="470" r="10"
        />
        <Text2
            x="755" y="470"  text-anchor="middle" fill="none" >{findTropas("INDONESIA")}
        </Text2>

        <Path
        //AUSTRALIA OCCIDENTAL
          fill="#c3c"
          d="M855 601v-7c1-1 0-1-1-2 0-1 1-43 1-43 0-1-30 0-30 0v-38l-3-1-2-2c-1 0-2 2-2 3-1 0-3 1-3 1s-1 2-1 3c0 2-2 0-4 1s0 1-1 3c0 1 0 0-2 0-1 0 0 1-2 2-1 1-1 0-2 2-2 1-1 1-1 3-1 1-1 0-3 1-1 1-2 3-3 4s-2 0-4 0h-3c-1 0-1 1-2 2s-1 2-3 3c-1 1 0 0-2 1-2 0-1 0-3 1s0 2-1 3c0 1 0 1-1 3 0 1 0 1 1 3 0 1 2 0 2 0s-1 2 0 3c0 1-1 0-2 0-2 0-1 0-1 2v1l-1 1c-1 1 0 1 0 2 0 2 1 2 1 3 1 2 1 1 2 3s0 2 0 4 0 1 1 4c0 2 1 1 1 1l2 2s0 1 1 2c0 2-1 2-1 3v3c0 2-1 1-2 2s0 1-1 2c0 2 0 1 1 2s2 1 3 2c2 3 5 2 8 0 2-1 1-1 2-1 1-1 1-1 2-1l2-2c1-1 0 0 2-1 1 0 1-1 3-2h4c2 0 1 0 1 1 1 1 2 1 2 1 1 0 2 0 3-1 1 0 0-1 0-2v-2c1-1 2-2 3-2s3 0 3-1c1-1 1 0 3 0l2-2c1-1 1-1 3-1h3c2 0 2 1 3 1s2 1 3 2c1 0 0 0 0 2 0 1 0 1 2 4 1 2 2 2 2 2s1-1 2-3 1 0 3-1c1-1 0-1 1-3 0-3 1-1 2-1s0 2 0 4l-2 2-2 2c-1 2-1 1-1 3 1 1 2-1 3-2s1-1 2-1v4c0 1 0 1 1 1 1 1 1 2 0 3v3c1 1 2 3 3 4s1 0 1 1c1 0 1 1 2 1Z"
            onPress={stateMachine.bind(this, 1, "AUSTRALIA OCCIDENTAL")}
        />
        <Circle
          fill={findColor("AUSTRALIA OCCIDENTAL")}
          cx="790" cy="550" r="10"
        />
        <Text2
            x="790" y="550"  text-anchor="middle" fill="none" >{findTropas("AUSTRALIA OCCIDENTAL")}
        </Text2>
      </G>
    </Defs>
    <Circle r={99999} fill="#fff" />
    <G
      strokeLinecap="round"
      strokeLinejoin="round"
      fontFamily="Helvetica,Arial,sans-serif"
      fontSize={18}
      letterSpacing={-1}
      textAnchor="middle"
      transform="scale(1 .85)"
    >
      <Use xlinkHref="#a" stroke="#9ff" strokeWidth={15} />
      <Use xlinkHref="#a" stroke="#fff" strokeWidth={14} />
      <Use xlinkHref="#a" stroke="#9ef" strokeWidth={10} />
      <Use xlinkHref="#a" stroke="#fff" strokeWidth={9} />
      <Use xlinkHref="#a" stroke="#6cf" strokeWidth={6} />
      <Use xlinkHref="#a" stroke="#fff" strokeWidth={5} />
      <Use xlinkHref="#a" stroke="#69f" strokeWidth={3} />
      <Use xlinkHref="#a" stroke="#fff" strokeWidth={2} />
      <Use xlinkHref="#a" stroke="#000" filter="url(#b)" />
      <Path
        fill="none"
        stroke="#ccc"
        strokeWidth={4}
        d="M225 175q0-35 40-35h535q40 0 40 30m-480 20 25-5-5 35m5-35-45 55m120-40 15 15m11 53 34-23-25-10Zl43 4-9-27m-23 55 5 5m-4 68v9m40-7 22-5v20m-110 50h25m175 5v10m-35 90h20l-10-50m165-35h28v48Zv-25m28 25 22 40m-18-220 13 30h-15"
        filter="url(#b)"
      />
      <G filter="url(#c)" />
      <Use xlinkHref="#d" strokeOpacity={0} />
      <Text2 y=".7ex" transform="matrix(.8 0 0 .9 656 451)">
        <TSpan fontWeight="bold">{"*"}</TSpan>
      </Text2>
    </G>
  </Svg>
  )

    // Atributos generales
    let nombrePartida = '';
    //let ganador = null;
    let turno= 0;
    const [cartas, setCartas] = useState(null);
    let descartes= [];
    //let mapa = [];
    let colores = ['verde', 'rojo', 'azul', 'amarillo', 'rosa', 'morado'];
    const [turnoJugador, setTurnoJugador] = useState('');
    let numJugadores = 3; // stub
    //let fase = 0; // Colocar- -> 0; Atacar -> 1; Maniobrar -> 2; Robar -> 3; Fin -> 4;
    // Atributos especfícios (míos, del jugador que juega en este cliente)
    const [numTropas, setNumTropas] = useState(1000);
    //let numTropas = 1000;
    const [territoriosTropas, setterritoriosTropas] = useState([{terrainId: '', numTropas: 0, user: ''}]);
    let territoriosTropasAux = [{terrainId: '', numTropas: 0, user: ''}]; // stub
    let tropas = [{terrainId: '', numTropas: 0, user: ''}];
    let ocupado = false;

    const [dialogBool, setDialogBool] = useState(false);
    const [seguir, setSeguir] = useState(false);
    const[dialog, setDialog] = useState(null);
    const [fase, setFase] = useState(0);// Colocar- -> 0; Atacar -> 1; Maniobrar -> 2; Robar -> 3; Fin -> 4;
    //let seguir = false;
    useEffect(() => {
      //console.log(dialog);
      switch(dialogState.type){
        case 'colocar':
          //setDialog(null);
          setDialogState({type: null, visible: dialogState.visible, title: dialogState.title})
          setDialogBool(false);
          //setSeguir(true);

          colocarTropasCorrectas();
          break;
        case 'seleccionar':
          setDialogState({type: null, visible: dialogState.visible, title: dialogState.title})
          setDialogBool(false);
          //setSeguir(true);
          console.log('seleccionar');
          seleccionarTropasCorrectas();
        break;
      }
    }, [dialogBool]);

    let colorMap =  {}; // no parece necesario
    let text= '';
    let tropasPuestas = 0;
    let recolocacion = false;

    const [textoFase, setTextoFase] = useState('Falta implementar el cambiar este texto(FASE)');
    /*
    // FASES PARTIDA
    const Colocar = 0;
    const Atacar = 1;
    const Maniobrar = 2;
    const Robar = 3;
    const Fin = 4; // No se usa
    */
    let eventoCancelado = false;
    // Ataque
    const [ataqueTropas, setAtaqueTropas] = useState(0);
    const [ataqueOrigen, setAtaqueOrigen] = useState('');
    const [ataqueDestino, setAtaqueDestino] = useState('');
    let avatarAMostrar = '';



  useEffect(() => {
    if(turnoJugador === whoami){
      switch(fase){
        case 0:
          console.log('Fase colocación', whoami, turnoJugador);
          setTextoFase('Fase colocación: Coloca una tropa en un país libre');
          console.log(thisPartida.auxColocar)
          setNumTropas(thisPartida.auxColocar || 0 );
          console.log(numTropas)
          break;
        case 1:
          setTextoFase('Fase ataque: Mueve las tropas de un país tuyo a uno enemigo contiguo');
          break;
        case 2:
          setTextoFase('Fase maniobra: Mueve las tropas de un país tuyo a otro tuyo');
          break;
        case 3:
          setTextoFase('Fase robo: Roba una carta');
          break;
      }
    } else {
      setTextoFase('Espera tu turno');
      setNumTropas(0);
    }
  }, [fase, turnoJugador]);

  const ResolverAtaque= async (partidaId, ataqueOrigen, ataqueDestino, tropasPuestas) => {
    console.log('Partida_id',partidaId,'territorio origen',ataqueOrigen, 'ter destino', ataqueDestino, 'num tropas',tropasPuestas)
    const token = await AsyncStorage.getItem('token');
    let header;
    console.log('Resolviendo Ataque');
    
    if (!token) {
      // redirect the user to the login page if token does not exist
      console.log('resolviendo 2')
      navigation.navigate('Login');
      header=null;
    }

    header=await AsyncStorage.getItem('username');// hasta aqui no es seguro
    console.log('resolviendo 1')
    if (!header) {
      console.log('fallo headers')
      return null;
    }
    console.log('resolviendo 3')
    try {
      
      const response = await axios.put(IP+'/partida/atacarTerritorio', {
        idPartida: partidaId,
        territorioAtacante: ataqueOrigen,
        territorioDefensor: ataqueDestino,
        numTropas: tropasPuestas
      }, {
        headers: {
          'Authorization': `${token}`
        }
      });
      console.log('ataacando')
      console.log(response.data)
      return response.data;
      
    } catch (error) {
      if (error.response) {
        // The request was made and the server responded with a status code
        // that falls out of the range of 2xx
        console.error('Server responded with error data:', error.response.data);
        console.error('Server responded with status code:', error.response.status);
        console.error('Server responded with headers:', error.response.headers);
    } else if (error.request) {
        // The request was made but no response was received
        console.error('No response received:', error.request);
    } else {
        // Something happened in setting up the request that triggered an Error
        console.error('Error setting up the request:', error.message);
    }
    return null; // Ensure to return in case of error
    }
  }


  const  updateFase = async () => {
    /*if(this.paused){
      this.toastr.error('La partida está pausada');
      return;
    }*/
    if(turnoJugador === whoami){
      const response = await axios.put(IP+ "/partida/siguienteFase", {idPartida: thisPartida._id}, { headers: { 'Authorization': token } });
      //console.log(response);
      if(response.status === 200){
        let auxThisPartida = thisPartida;
            // This will be executed when the HTTP request is successful
            auxThisPartida.fase = response.data.fase; // cojo la fase 
            if(auxThisPartida.turno !== response.data.turno){ // si ha cambiado el turno, lo cambio
              auxThisPartida.turno = response.data.turno;
              //console.log(auxThisPartida.jugadores.length);
              setTurnoJugador(auxThisPartida.jugadores[(auxThisPartida.turno) % auxThisPartida.jugadores.length].usuario);
              // y además aviso 
              socket.emit('actualizarEstado', auxThisPartida._id);
            }
            if(auxThisPartida.fase !== undefined && auxThisPartida.fase !== null){
              setFase(auxThisPartida.fase);
            }
            
            //console.log(response.data);
            setThisPartida(auxThisPartida);
            //eventoCancelado = true;
      } 
      else{
        // This will be executed when the HTTP request fails
        console.log('Error al actualizar la fase');
      }
  }
  else{
    //this.toastr.error('No es tu turno');
  }
  }

  //maquina de estados de la partida
  const stateMachine = async (path , territoriname , e) =>   {
    const targetId = path;
    console.log(`Clic en la región con ID: ${targetId}`);
    console.log(`Clic en la región : ${territoriname}`);
    if(recolocacion) return;
    if (turnoJugador !== whoami) {
      Alert.alert('No es tu turno');
      console.log('No es tu turno');
      return;
    } 
    if(isPaused){
      Alert.alert('La partida está pausada');
      console.log('La partida está pausada');
      return;
    }
    if(ocupado){ console.log("espere"); return};
    switch(fase){
      case 0: // colocación
        if (turnoJugador === whoami && !ocupado) {
          tropasPuestas=0;
          eventoCancelado = false;
          colocarTropas(territoriname, whoami, false, false);
          //La emision al socket se hace en la funcion anterior
        } else {
          if(!this.ocupado) Alert.alert('No es tu turno');
        }
        break;
      case 1: // ataque
        // aviso de nuevo click y relleno el territorio en el q se ha pulsado
        console.log('Fase 1')
        setNewClicked(true);
        setTerritorioName(territoriname);
        console.log('Fase 1_1')
        break
      case 2: // maniobra -> reutilizo las variables de ataque jeje
        if (ataqueTropas === 0) {
          setAtaqueTropas(0)
          setAtaqueDestino('')
          setAtaqueOrigen('')
          const numTroops = await seleccionarTropas(territoriname, whoami, false);
          colocarTropas(territoriname, whoami, false, -numTroops) // las quito del mapa
        } else {
          // una vez seleccionadas las tropas me tocará elegir un territorio enemigo
          const enemyTerritoryId = seleccionarTerritorioAmigo(territoriname)
          console.log(`Player has selected friendly territory ${enemyTerritoryId}`)
          const ataqueDestino = enemyTerritoryId
          console.log(enemyTerritoryId)
          console.log('espero que esto sea correcto ' + ataqueTropas + ' ' + ataqueOrigen + ' ' + ataqueDestino)
          axios.put(`${IP}/partida/realizarManiobra`, { idPartida: thisPartida._id, territorioOrigen: ataqueOrigen, territorioDestino: ataqueDestino, numTropas: ataqueTropas }, { headers: { 'Authorization': token } })
          .then(async response => {
            console.log(response.data)
            onLoad()
            setAtaqueDestino('')
            setAtaqueOrigen('')
            setAtaqueTropas(0)
            // update the state of every client
            socket.emit('actualizarEstado', thisPartida._id)
          })
          .catch(error => {
            this.toastr.error('¡ERROR FATAL!');
            this.fase = 0;
            this.fase = 1;
            setAtaqueDestino('')
            setAtaqueOrigen('')
            setAtaqueTropas(0)
          })
        }
        break
      case 3: // robo 
        //this.final(e, svgDoc, imgWidth, imgHeight);
        break
      case 4: // fin
        //this.final(e, svgDoc, imgWidth, imgHeight);
        break
    }
    //this.colocarTropas(e, svgDoc, imgWidth, imgHeight, this.whoami);
    //this.cdr.detectChanges()
  }

  // Cada vez que el jugador pulse en un territorio, se ejecutará este useEffect
  // solo ocurrira si está en la fase de ataque, ya que se avisa de newClicked, 
  // y si ya ha selccionado tropas. En caso contrario, se ejecutará el useEffect
  // de abajo, que es el que selecciona las tropas a poner. 
  useEffect(() => {
    if (ataqueTropas !== 0 && newClicked) {
        console.log("pulsación secundaria")
        console.log("Ataque tropas: ", ataqueTropas);
        let tropasAUtilizar = ataqueTropas;
        // TODO ADAPTAR ESTO
        console.log('Tropas para atacar: ', tropasAUtilizar);
        const selectEnemyTerritory = async () => {
          try {
              let territorioDestinoAtacar = await seleccionarTerritorioEnemigo(territorioName, whoami, false);
              console.log(`Player has selected enemy territory ${territorioName}`);
              setAtaqueDestino(territorioName); // hace falta? 
              console.log('Ataque origen: ', ataqueOrigen, "ataque destino", territorioName, "tropas origen:", "tropas destino:");
              // TODO -> LLAMAR A RESOLVER ATAQUE Y ACTUALIZAR ESTADO
              // NO ME DA TIEMPO A TERMINIARLO PERO ES TRIVIAL
              console.log('Ataque origen: ', ataqueOrigen, "ataque destino", territorioDestinoAtacar, "tropas origen:", "tropas destino:");
              // TODO -> LLAMAR A RESOLVER ATAQUE Y ACTUALIZAR ESTADO
              // NO ME DA TIEMPO A TERMINIARLO PERO ES TRIVIAL
              let usuarioObjetivo = thisPartida.jugadores.find(jugador => jugador.territorios.includes(territorioDestinoAtacar));
              console.log('Usuario objetivo:', usuarioObjetivo)
              console.log('THIS PARTIDA',thisPartida._id)
              ResolverAtaque(thisPartida._id, ataqueOrigen, territorioDestinoAtacar, tropasAUtilizar).then(  
                async response => {
                  console.log('respuesta resolver ataque',response);
                  onLoad();
                  Alert.alert('¡Ataque realizado con éxito!');
                  Alert.alert('Tus dados: ' + response.dadosAtacante + ' Dados defensor: ' + response.dadosDefensor);
                  Alert.alert('Tus bajas: ' + response.resultadoBatalla.tropasPerdidasAtacante + ' Bajas defensor: ' + response.resultadoBatalla.tropasPerdidasDefensor);
                  if(response.conquistado){
                    Alert.alert('¡Territorio conquistado!');
    
                  } else {
                    Alert.alert('¡No has conquistado el territorio!');
                  }
                  console.log("Hola")
                  // update the state of every client
                  socket.emit('actualizarEstado', partida._id);
                  // and notify the defense player 
                  socket.emit('ataco', {userOrigen: whoami, userDestino: usuarioObjetivo?.usuario ?? '', 
                                   dadosAtacante: response.dadosAtacante, dadosDefensor: response.dadosDefensor, 
                                   tropasPerdidasAtacante: response.resultadoBatalla.tropasPerdidasAtacante,
                                   tropasPerdidasDefensor: response.resultadoBatalla.tropasPerdidasDefensor, 
                                   conquistado: response.conquistado, territorioOrigen: ataqueOrigen, 
                                   territorioDestino: territorioName});
                  console.log("Se perpetra el ataque ")
                  setAtaqueDestino('');
                  setAtaqueOrigen('');
                  setAtaqueTropas(0);
                },
                error => {
                  Alert.alert('¡ERROR FATAL!');
                  setFase(0);
                  setFase(1);
                  setAtaqueDestino('');
                  setAtaqueOrigen('');
                  setAtaqueTropas(0);
                }
              );
          } catch (error) {
              console.error('An error occurred:', error);
          }
        }
        selectEnemyTerritory();
        setAtaqueTropas(0);
        setNewClicked(false);

    }
  
  }, [ataqueTropas, newClicked]);
  
  // Cada vez que se haga un click en la fase de ataque, se ejecutará este useEffect
  // esto es debido a que se hace un setNewClicked. Dentro de aquí, ejecutamos 
  // la función q calcula las tropas a poner, por lo q el siguiente click de la fase
  // llamará al useEffect de arriba, y no a este. 
  useEffect(() => {
    if (ataqueTropas === 0 && newClicked) {
          console.log("pulsación inicial")
          console.log('Selecccionar tropas para atacar');
          setAtaqueTropas(0);
          setAtaqueDestino('');
          setAtaqueOrigen(''); 
          setNewClicked(false);
      
          const fetchTroops = async () => {
            console.log("entro dentro")
            const numTroops = await seleccionarTropas(territorioName, whoami, false);
            console.log(ataqueTropas, ataqueOrigen, ataqueDestino, numTroops);
            console.log(`Player has selected ${numTroops} troops`);
            console.log(recolocacion);
            tropasPuestas = 0;
            
            // llamo a colocarTropas con -numTroops para quitarlas del mapa
            colocarTropas(territorioName, whoami, false, -numTroops);
            //setNumTropas(numTropas-numTroops); // tampoco las tengo colocables, las tengo seleccionadas así que las quito de ahí
            console.log('tropas colocables: ', numTropas);
            console.log('tropas seleccionadas', numTroops);
            setAtaqueTropas(numTroops);
            console.log('tropas para atacar: ', ataqueTropas);
          };

          fetchTroops();
          
          // llegados a este punto, ataqueTropas valdrá 0 porque React Native 
          // no actualiza el estado de forma síncrona. Para lograr lo del 
          // "if/else", lo que debo hacer es un useEffect que haga lo que haría el else...
          // voy a ver si lo consigo

    }
  }, [newClicked, ataqueTropas]);
  
  //Pone todas las tropas en 0
  const limpiarTropas =  () => {
    let mapa = thisPartida.mapa;
    mapa.forEach(continente => {
      continente.territorios.forEach(territorio => {
        territorio.tropas = 0;
      });
    });

  }

  //Esto pinta el mapa con las piezas de cada territorio pero creo que no hace falta aqui porque ya se pinta en el colocar tropas
  //No hace falta pintar nada, al hacer setThisPartida se pinta el mapa
  //Lo dejo de momento porque no se si hara falta para otra cosa, pero creo que no
  const distribuirPiezas = () => {
    //console.log("Continentes", mapa)
    //console.log("Jugadores", jugadores)
    //let mapa = thisPartida.mapa;
    //setMapa(mapa);
    //console.log(mapa[0].territorios);
    /*for(let continente of mapa){
      for(let territorio of continente.territorios){
        //console.log(territorio)
        // Find the player who owns this territory
        let jugador = partida.jugadores.find(jugador => jugador.territorios.includes(territorio.nombre));
        //console.log(jugador)
  
        // If a player was found, get their color
        let color = jugador ? jugador.color : undefined;
        //console.log(color)
        if(color !== undefined && jugador) {
          //console.log(`The color of territory ${territorio.nombre} is ${color}, and it has ${territorio.tropas} troops.`);
          //colocarTropas(territorio.nombre, jugador.usuario, true, territorio.tropas);
        }
      }
    }*/
    setterritoriosTropas(territoriosTropasAux);
    console.log(partida);
    setThisPartida(partida);
  }

  const inicializarPartida =  (partida) => {
    // Inicializa los atributos de la partida
    //console.log(partida);
    //jugadores = partida.jugadores;
    //console.log(partida);
    //let me = partida.jugadores.find(jugador => jugador.usuario === whoami);
    //setThisPartida(partida);
    turno  = partida.turno;
    nombrePartida = partida.nombre;
    numJugadores = partida.jugadores.length;
    setMapa(partida.mapa);

    descartes = partida.descartes;

    let _ganador = partida.ganador;
    //console.log(whoami, _ganador);
    /*if(_ganador === whoami && whoami !== null){
      Alert.alert('¡Has ganado la partida!');
      eloGanado+=200; puntosGanados+=200;
    }*/
    setGanador(_ganador);
    setFase(partida.fase);
    setTurnoJugador(partida.jugadores[turno % numJugadores].usuario)

    //TODO fetch cartas del back
    setCartas(partida.cartas);

    //limpiarTropas();
    //distribuirPiezas();
    //setTurnoJugador(jugadores[turno % numJugadores].usuario);
    //turnoJugador = partida.jugadores[partida.turno % this.numJugadores];
    //console.log(partida.jugadores[turno % numJugadores].usuario);
    if(partida.jugadores[turno % numJugadores].usuario === whoami){
      //STUB
      //partida.auxColocar = 3;
      setNumTropas(partida.auxColocar);
      
    }
    //console.log("MAPA:", thisPartida);
  }


  const onLoad = async () => {
    // Aunque venga del lobby, es necesario actualizar el estado con la información de la partida (como los colores de los jugadores)
    // (Al parecer getPartida es un put)

    const response = await axios.put(`${IP}/partida/getPartida/`, { idPartida: partida._id }, { headers: { 'Authorization': token } })
    if (response.status === 200) {
      setThisPartida(response.data.partida)
    } else {
      Alert.alert('Error', 'Error cargando partida');
    }
    setWhoami(await AsyncStorage.getItem('username'));
    //console.log(response.data.partida);
    inicializarPartida(response.data.partida);
    //console.log(partida.jugadores);
  }

  const [stateTropas, setStateTropas] = useState({territoriname: '', user: '', init: false});

  const fixCapitalization = (str) => {
    return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
  };

  const colocarTropas = (territoriname2, user2, init2, limite= null) => {
    // Ask the user for the number of troops

    let troops;
    let duenno = thisPartida.jugadores.find(jugador => jugador.usuario == user2);

    if(!init2 && !recolocacion){
      if(!(territoriname2 && duenno && duenno.territorios.includes(territoriname2))){
        alert('No puedes poner tropas en territorios que no te pertenecen ('+fixCapitalization(territoriname2)+')');
        //this.cdr.detectChanges();
        return;
      }
    }
    
    //Si hay limite, no hace falta preguntar por las tropas, esto solo se usa cuando hay que quitar tropas del mapa
    if(limite){
      troops = limite.toString();

      let numTroops = parseInt(troops);
      let select = false;
      if (!init2 && !recolocacion && !select && (numTroops > numTropas)) {
        Alert.alert('¡No tienes suficientes tropas!');
        eventoCancelado = true;
        return;
      }

      tropasPuestas += numTroops;
      //console.log(territoriosTropas.length);
      let thisPartidaAux = thisPartida;
      const territorios = thisPartidaAux.mapa.flatMap(continent => continent.territorios);
      if (territorios) {
        const terrainInfo = territorios.find(territorio => territorio.nombre === territoriname2)
        if (terrainInfo) {
          terrainInfo.tropas += numTroops;
          terrainInfo.user = user2;
          numTroops = terrainInfo.tropas
          //setterritoriosTropas(territoriosTropas);
          setThisPartida(thisPartidaAux);
          if(!init2){
            let newtropas = numTropas - numTroops;
            setNumTropas(newtropas);
          }
        }
        else {
          //console.log("territorio: " + territoriname2, numTroops, user2);
          //territoriosTropas.push({terrainId: territoriname2, numTropas: numTroops, user: user2});
          //setterritoriosTropas([...territoriosTropas, {terrainId: territoriname2, numTropas: numTroops, user: user2}]);
          territoriosTropasAux.push({terrainId: territoriname2, numTropas: numTroops, user: user2});
        }
      }
    }
    else if(recolocacion){ 
      troops = '0';
    }
    else{
      //Preguntar por tropas
      setStateTropas({territoriname: territoriname2, user: user2, init: init2});
      let newState = { message: null };
      setState(newState);
      let auxDialog = {visible: true, type: 'colocar', title: '¿Cuántas tropas quieres colocar en '+fixCapitalization(territoriname2)+'?'};
      setDialogState(auxDialog);
    }

  }

 //Aqui sigue la funcion colocar tropas despus de introducirlas en el dialog
  const colocarTropasCorrectas = async () => {
    
    console.log('me meto en colocarTropasCorrectas: ', stateTropas.territoriname);
    if (state.message === null) {
      return;
    }

    let numTroops = parseInt(state.message);
    let select = false;
    if (!stateTropas.init && !recolocacion && !select && (numTroops > numTropas)) {
      Alert.alert('¡No tienes suficientes tropas!');
      eventoCancelado = true;
      return;
    }

    
    let newtropas = numTropas - numTroops;
    setNumTropas(newtropas);

    tropasPuestas += numTroops;
   
    let thisPartidaAux = thisPartida;
    const territorios = thisPartidaAux.mapa.flatMap(continent => continent.territorios);

      if (territorios) {
        const terrainInfo = territorios.find(territorio => territorio.nombre === stateTropas.territoriname)
        if (terrainInfo) {
          terrainInfo.tropas += numTroops;
          terrainInfo.user = stateTropas.user;
          numTroops = terrainInfo.numTropas;
          //setterritoriosTropas(territoriosTropas);
          setThisPartida(thisPartidaAux);
        }
        else {
          //console.log("territorio: " + territoriname2, numTroops, user2);
          //territoriosTropas.push({terrainId: territoriname2, numTropas: numTroops, user: user2});
          //setterritoriosTropas([...territoriosTropas, {terrainId: territoriname2, numTropas: numTroops, user: user2}]);
          territoriosTropasAux.push({terrainId: stateTropas.territoriname, numTropas: numTroops, user: stateTropas.user});
        }
      }

    //si estoy en fase de colocacion socket emit y coloco tropas e back
    if(fase === 0){
      ocupado = true;
      //console.log('Colocando tropas en el territorio: ', stateTropas.territoriname, ' con ', numTroops, ' tropas.');
      const response = await axios.put(`${IP}/partida/colocarTropas`, {idPartida: thisPartida._id, territorio: stateTropas.territoriname, numTropas: tropasPuestas}, { headers: { 'Authorization': token } })
        if (response.status === 200) {
          console.log(response);
          tropasPuestas = 0;
          ocupado = false;
          // notify to back with a socket, the back will notify every client in the game
          socket.emit('actualizarEstado', partida._id);
        } else {
          Alert.alert('¡ERROR FATAL!');
          colocarTropas(stateTropas.territoriname, stateTropas.user, stateTropas.init, tropasPuestas);
          ocupado = false
          numTropas += tropasPuestas;
          tropasPuestas = 0;
        }
      
      setTimeout(() => { // si no recibo respuesta del back, está caído
        //console.log("entro")
        if(ocupado){ 
          console.log("fatal error")
          Alert.alert('¡ERROR FATAL!');
          ocupado = false;
          numTropas += tropasPuestas;
        }
      }, 2000);
    }

  }


  //Todo esto es para esperar a que se introduzcan las tropas en el dialog
  useEffect(() => {
    if (seguir) {
      colocarSeguir();
    }
  }, [seguir, numTroops]);

  const colocarSeguir = async () => {
    console.log('seguir');
    await AsyncStorage.setItem('numTroops', numTroops.toString());
    await AsyncStorage.setItem('seguir', 'true');
  }

  const waitForTropasSeleccionadas = async () => {
    let sigo = await AsyncStorage.getItem('seguir');
    if (sigo === 'true') {
      setSeguir(false);
      await AsyncStorage.removeItem('seguir');
      return;
    }
    else{
      await new Promise(
        resolve => setTimeout(resolve, 500)
      );
    }
    await waitForTropasSeleccionadas();
  }


  const [numTroops, setNumTroops] = useState(0);
  //Funcion para seleccionar tropas que se usa en el statemachine
  const seleccionarTropas = async (_territoriId, user2, attack2) => {
    //console.log('Seleccionar tropas');
    
      
      const terrainId = _territoriId;
      //para probar comento esto
      let duenno = thisPartida.jugadores.find(jugador => jugador.usuario == user2);
      if (!(terrainId && duenno && duenno.territorios.includes(terrainId))) {
        Alert.alert('No puedes seleccionar tropas en territorios que no te pertenecen ('+fixCapitalization(terrainId)+')');
        //this.cdr.detectChanges();

        return;
      }
      //Preguntar por tropas
      setStateTropas({territoriId: _territoriId, user: user2, attack: attack2});
      let newState = { message: null };
      setState(newState);
      setDialogState({visible: true, type: 'seleccionar', title: '¿Cuántas tropas quieres seleccionar de '+fixCapitalization(terrainId)+'?'});
      //setDialog('seleccionar');
      //setVisible(true);
      //Despues del dialog se sigue en el SelectTropasCorrectas
      await waitForTropasSeleccionadas();

      return parseInt(await AsyncStorage.getItem('numTroops'));
      
  }
  const seleccionarTerritorioEnemigo = async (_territoriId, user2, attack2) => {
    console.log('Seleccionar tropas');
    
    const terrainId = _territoriId; // territorio enemigo a atacar
    console.log("Vas a atacar el territorio con id: ", terrainId);
    //para probar comento esto
    let duenno = thisPartida.jugadores.find(jugador => jugador.usuario == user2);
    if ((terrainId && duenno && duenno.territorios.includes(terrainId))) {
      Alert.alert('No puedes atacar tu propio territorio');
      //this.cdr.detectChanges();

      return;
    }
    console.log("Territorio origen", ataqueOrigen);
    let origen = ataqueOrigen;
    // debo obtener el territorio origen como tal
    let thisPartidaAux = thisPartida;
    const territorios = thisPartidaAux.mapa.flatMap(continent => continent.territorios);
    const origenAtaque = territorios.find(territorio => territorio.nombre === origen);
    console.log(origenAtaque);
    // si el territorio enemigo no está en la frontera muestro error
    if(origenAtaque && origenAtaque.frontera){ 
      if(!origenAtaque.frontera.includes(terrainId)){
        Alert.alert('No puedes atacar un territorio que no es frontera');
        return;
      }
    }else { // esto no debería pasar
      Alert.alert('El territorio origen no exsite o no tiene una frontera');
      return;
    }

    // busco el territorio objetivo 
    const terrainInfo = territorios.find(terrain => terrain.nombre === terrainId);

    if (terrainInfo) {
      const enemy = thisPartida.jugadores.find(jugador => jugador.territorios.includes(terrainId));
      console.log(enemy)
      if (!enemy) {
        Alert.alert('Este territorio no pertenece a ningún enemigo');
        return;
      } 
    } else {
      Alert.alert('Ha ocurrido un error interno.', 'Atención');
      return;
    }

    Alert.alert(`Has seleccionado el territorio enemigo ${terrainId}.`);
    //TODO PONER ANIMACIÓN DE SELECCIÓN DE TERRITORIO
    return terrainId;
      
  }
  //Aqui sigue la funcion seleccionar tropas despus de introducirlas en el dialog
  const seleccionarTropasCorrectas = async () => {
    const troops = state.message;

    let numTroops = parseInt(troops);

    // Check if the input is a valid number
    if (isNaN(numTroops) || numTroops < 1) {
      Alert.alert('Por favor, introduce un número válido de tropas.');

      return;
    }

    if (stateTropas.attack && numTroops > 3) {
      console.log(stateTropas.attack)
      Alert.alert('Sólo puedes seleccionar hasta 3 tropas para atacar.')

      return;
    }

    let thisPartidaAux = thisPartida;
    const territorios = thisPartidaAux.mapa.flatMap(continent => continent.territorios);
    //console.log(territorios);
    const terrainInfo = territorios.find(terrain => terrain.nombre === stateTropas.territoriId);
    if (terrainInfo) {
      if (terrainInfo.tropas < numTroops + 1) { // se debe dejar al menos una tropa y no quedarnos con tropas negativasd
        Alert.alert('No tienes suficientes tropas en este territorio. Recuerda que debes dejar al menos una tropa.');

        return;
      }
      setAtaqueTropas(ataqueTropas + numTroops)
    } else {
      Alert.alert('Ha ocurrido un error interno.', 'Atención');

      return;
    }

    Alert.alert(`Has seleccionado ${numTroops} tropas.`);
    setAtaqueOrigen(stateTropas.territoriId);
    setNumTroops(numTroops);
    setSeguir(true);
  }

  // Función que comprueba que un territorio es alcanzable desde el territorio de origen
  const isFriendlyReachable = (mapa, origen, destino, jugador) => {
    if (!jugador.territorios.includes(destino)) {
      console.log("El territorio destino no pertenece al jugador")
      return false
    }
    const territorios = mapa.flatMap(continent => continent.territorios)
    const territoriosExplorados = new Set()
    const territoriosPorExplorar = new Set()
    territoriosPorExplorar.add(origen)
    while (territoriosPorExplorar.size > 0) {
      const territorioActual = territoriosPorExplorar.values().next().value

      const vecinosValidos = territorioActual.frontera.filter((vecino) =>                       // Los vecinos válidos son los vecinos del territorio actual
        vecino != territorioActual.nombre                                                       // sin el territorio actual
        && !Array.from(territoriosExplorados).some(territorio => territorio.nombre === vecino)  // que no han sido ya explorados
        && jugador.territorios.includes(vecino)                                                 // y pertenecen al jugador
      )

      territoriosPorExplorar.delete(territorioActual)
      territoriosExplorados.add(territorioActual)
      for (let nombre of vecinosValidos) {
        const territorio = territorios.find(territorio => territorio.nombre === nombre)
        if (territorio && territorio.nombre === destino) {
          console.log("Ruta encontrada desde el territorio origen hasta el territorio destino")
          return true
        } else if (territorio) {
          territoriosPorExplorar.add(territorio)
        }
      }
    }
    console.log("No se ha encontrado una ruta desde el territorio origen hasta el territorio destino")
    return false
  }

  const seleccionarTerritorioAmigo = (_territoriId) => {
    console.log('Seleccionar tropas')

    const terrainId = _territoriId // territorio origen
    console.log("Territorio destino: ", terrainId)
    let duenno = thisPartida.jugadores.find(jugador => jugador.usuario == whoami);
    console.log("Duenno: ", duenno)
    // Check if the territory belongs to the player (it should)
    if (terrainId && duenno && !duenno.territorios.includes(terrainId)) {
      Alert.alert('No puedes mover tropas fuera de tu territorio ('+fixCapitalization(terrainId)+')')
      return
    }
    console.log("Territorio origen", ataqueOrigen);
    let origen = ataqueOrigen;
    // debo obtener el territorio origen como tal
    let thisPartidaAux = thisPartida;
    const territorios = thisPartidaAux.mapa.flatMap(continent => continent.territorios);
    const origenAtaque = territorios.find(territorio => territorio.nombre === origen);
    console.log(origenAtaque);
    // Check if the origin of the troops exists and has a border
    if(origenAtaque && origenAtaque.frontera){
      if (duenno) {
        // Search borders until exhaustion
        const ok = isFriendlyReachable(thisPartida.mapa, origenAtaque, terrainId, duenno)
        console.log(ok)
        if (!ok) {
          // The selected territory is not in the border of the origin of the troops --> fatal error user is stupid xd
          Alert.alert('El territorio seleccionado no está conectado con el origen de las tropas ('+fixCapitalization(terrainId)+')')
          return
        }
      }
    }else { // esto no debería pasar
      Alert.alert('El territorio origen no existe o no tiene una frontera ('+fixCapitalization(terrainId)+')');
      return
    }

    // Check if the territory exists and belongs to the player
    const terrainInfo = territorios.find(terrain => terrain.nombre === terrainId)
    if (terrainInfo) {
      const terrainOwner = thisPartida.jugadores.find(jugador => jugador.territorios.includes(terrainId))
      console.log(terrainOwner)
      if (terrainOwner != duenno) {
        Alert.alert('Este territorio no te pertenece ('+fixCapitalization(terrainId)+')')
        return
      }
    } else {
      Alert.alert('Ha ocurrido un error interno.', 'Atención')
      return
    }

    ToastAndroid.show('Has seleccionado tu territorio ('+fixCapitalization(terrainId)+')', ToastAndroid.SHORT)
    console.log("Territorio destino: ", terrainId)
    return terrainId
  }


  //rutina de OK del boton de dialog
  const handleOK = async () => {
    //setnumterritoriosTropas(state.message);
    setDialogBool(true);
    setDialogState({type: dialogState.type, visible: false, title: dialogState.title})
    console.log('me meto en handleOK: ', state.message);
    
  }


  //TODO: Implementar la rutina de cancelar
  const handleCancel = async () => {
    setDialogState({type: null, visible: false, title: dialogState.title})
  }


  //Funcion para usar cartas que se llama desde el modal de las cartas
  const usarCarta = async (cartaUsada) => {
    //e.preventDefault();
    ToastAndroid.show('Carta usada '+cartaUsada, ToastAndroid.SHORT)
    console.log(cartaUsada)

    let aumento = cartaUsada.estrellas;
    if (usoCartas) {
      try{
        const response = await axios.put(IP+"/partida/utilizarCartas", {idPartida: thisPartida._id, carta1: cartaUsada, carta2: null}, { headers: { 'Authorization': token } });
        if (response.status === 200) {
          console.log(response.data)
          if (thisPartida.auxColocar) {
            thisPartida.auxColocar = thisPartida.auxColocar + aumento; 
          }
          let me = thisPartida.jugadores.find(jugador => jugador.usuario === whoami);
          if(me){ me.cartas = me.cartas.filter(elem => elem !== cartaUsada);
          setThisPartida(thisPartida);
          console.log("Carta jugada" + cartaUsada.estrellas +". Tropas:" + numTropas)
          return numTropas+cartaUsada.estrellas;
          }
        } else {
          Alert.alert('¡ERROR FATAL!');
        }
      }
      catch(error){
        console.log(error)
        Alert.alert('¡ERROR FATAL!');
      }
      
    }
    else {
      console.log(usoCartas)
      ToastAndroid.show('Usocartas no inicializado', ToastAndroid.SHORT)
      return 0;
    }
  }


  const listaCartas = () => {
    if(!thisPartida) return (<Text1>Loading...</Text1>);
    let me = thisPartida.jugadores.find(jugador => jugador.usuario === whoami);
    if(me && me.cartas && me.cartas.length > 0){
      console.log(me.cartas);
      let cartasUsuario = me.cartas;
      //ESTOY USANDO EL ESTADO DE LA PARTIDA, NO EL DEL USUARIO, HAY QUE CAMBIAR ESTO!!!!!!!
      return (cartasUsuario.map(carta => (
        <View 
          key={carta._id}
          style={styles.cartasContainer}>
          <Text1 style={styles.textStyle}>{carta.territorio}  {carta.estrellas} &#11088;</Text1>
          <TouchableOpacity
                style={styles.botonUse}
                onPress={() =>usarCarta(carta)}>
                <Text1 style={styles.textUse}>Use</Text1>
          </TouchableOpacity>
        </View>
      )));
    }
    else{
      return (<Text1>No tienes cartas</Text1>);
    }
    return (<Text1>Loading...</Text1>);
    
  }

  const handleOpenCartasModal = () => {
    if(fase === 0 && turnoJugador === whoami && whoami !== null){
      setModalVisible(true)
      setUsoCartas(true)
    }
    else{
      ToastAndroid.show('No puedes usar cartas en este momento', ToastAndroid.SHORT)
    }
  }

  const handlePauseResume = async () => {
      const response = await axios.put(IP+ "/partida/pausarPartida", {idPartida: thisPartida._id}, { headers: { 'Authorization': token } });
        if(response.status === 200){
        let paused = isPaused; let txt = ''; if(isPaused) txt = 'resumida'; else txt = 'pausada';
        setIsPaused(!isPaused);
        socket.emit('pausoPartida', this.partida._id);
        Alert.alert('Partida ' + txt);
      } else{ 
        console.log('Error al pausar la partida');
        Alert.alert('Error al pausar la partida');
      }
  };

  const handleAbandonar = async () => {
    try{
      socket.off('chatMessage');
      socket.off('userDisconnected');
      socket.off('gameOver');
      socket.off('cambioEstado');
      socket.off('ataqueRecibido');
      socket.off('partidaPausada');
      const response = await axios.put(IP+"/partida/salirPartida", {idPartida: thisPartida._id}, {headers: {'Authorization': token}});
      if(response.status === 200){
        socket.emit('disconnectGame', { gameId: this.partida._id, user: whoami });
        console.log(response.data);
        navigation.navigate('Inicial', {userid : whoami, token: token });
      }
      else{
        console.log('Error al abandonar la partida');
        Alert.alert('Error al abandonar la partida');
      }
    }
    catch(error){
      console.log(error)
      Alert.alert('¡ERROR FATAL!');
    }
  }

  return (
    <View style={styles.container} >
      {thisPartida ? <ModalChat socket={socket} whoami={whoami ? whoami : null} chat={thisPartida ? thisPartida.chat : null} onClose={()=>setChatVisible(false)} token={token} isVisible={chatVisible} /> : null}

      <Modal
        animationType="slide"
        transparent={true}
        visible={abandonarVisible}>
        <View style={styles.modal}>
          <View style={styles.modalView}>
            <Text1 style={styles.textStyle}>¿Estás seguro de que quieres abandonar la partida?</Text1>
            <Pressable
                style={[styles.botonUse, {backgroundColor: "green"}]} 
                onPress={handleAbandonar}>
                <Text1 style={styles.textUse}>SI</Text1>
              </Pressable>
              <Pressable
                style={[styles.botonUse, {backgroundColor: "red"}]} 
                onPress={()=> setAbandonarVisible(false)}>
                <Text1 style={styles.textUse}>NO</Text1>
              </Pressable>
          </View>
        </View>
      </Modal>
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => {
          Alert.alert('Modal has been closed.');
          setModalVisible(!modalVisible);
        }}>
        <View style={styles.modal}>
          <View style={styles.modalView}>
            <View style={{height: 200}} >
              <ScrollView style={styles.scroll}>
                {listaCartas()}              
              </ScrollView>
            </View>
            <Pressable
                style={styles.botonUse}
                onPress={() => {setModalVisible(!modalVisible);
                                setUsoCartas(false)}}>
                <Text1 style={styles.textUse}>Cerrar</Text1>
              </Pressable>
          </View>
        </View>
      </Modal>
      <View style={styles.containerleft}>
        <ReactNativeZoomableView
          maxZoom={3}
          minZoom={0.8}
          zoomStep={0.5}
          initialZoom={1}
          bindToBorders={false}
  >
          <MapSVGComponent />
        </ReactNativeZoomableView>
      </View>
      <View style={styles.containerRight}>
        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
          <Text1 style={styles.zoneText}>Tu color: {
            thisPartida ? thisPartida.jugadores.find(jugador => jugador.usuario === whoami) ? thisPartida.jugadores.find(jugador => jugador.usuario === whoami).color : "Loading..." : "Loading..."
          }
          </Text1>
          <View style={[styles.colorSquare, { backgroundColor: makeRGB(thisPartida ? thisPartida.jugadores.find(jugador => jugador.usuario === whoami) ? thisPartida.jugadores.find(jugador => jugador.usuario === whoami).color : "" : "") }]} />
        </View>
        <Text1 style={styles.zoneText}>Tropas: {numTropas}</Text1>
        <Text1 style={styles.zoneText}>Turno del jugador: {turnoJugador}</Text1>
        <Text1 style={styles.zoneText}>{textoFase}</Text1>
        <View style={styles.buttonContainer}>
          <TouchableOpacity style={styles.botonControl} onPress={updateFase}>
            <Text1 style={styles.zoneText}>Siguiente Fase</Text1>
          </TouchableOpacity>
          <TouchableOpacity style={styles.botonControl} onPress={()=> handleOpenCartasModal()}>
            <Text1 style={styles.zoneText}>Usar Cartas</Text1>
          </TouchableOpacity>
          <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
            <TouchableOpacity 
                style={[styles.botonControl, { width: 50, height: 50, justifyContent: 'center', alignItems: 'center' }]} 
                onPress={handlePauseResume}
            >
                <Text1 style={styles.zoneText}>{isPaused ? '▶' : '❚❚'}</Text1>
            </TouchableOpacity>
            <TouchableOpacity style={[styles.botonControl, {width: 110, backgroundColor: "red"}]} onPress={()=> setAbandonarVisible(true)}>
              <Text1 style={styles.zoneText}>Abandonar</Text1>
            </TouchableOpacity>
          </View>
          <TouchableOpacity style={styles.botonControl} onPress={()=> setChatVisible(true)}>
            <Text1 style={styles.zoneText}>Chat</Text1>
          </TouchableOpacity>

          
        </View>
      </View>
      {/*thisPartida ? <ModalChat socket={socket} whoami={whoami ? whoami : null} chat={thisPartida ? thisPartida.chat : null} onClose={()=>setChatVisible(false)} token={token} isVisible={chatVisible} /> : null*/}
      {/*DIALOGO PARA LAS TROPAS */}
        <Dialog.Container visible={dialogState.visible} > 
        <Dialog.Title>{dialogState.title}</Dialog.Title>
           <Dialog.Input inputMode='numeric' label="Troop" onChangeText={(troop ) => setState({ message: troop })} 
            ></Dialog.Input>
          <Dialog.Button label="Cancel" onPress={handleCancel} />
          <Dialog.Button label="OK" onPress={handleOK} />
        </Dialog.Container>
    </View>
    
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'start',
    flexDirection: 'row',
    justifyContent: 'left',
  },
  scroll: {
    width: 500,
    height: 10,
  },
  modal: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  modalView: {
    margin: 20,
    backgroundColor: 'white',
    borderRadius: 20,
    padding: 35,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  cartasList: {
    flexDirection: 'column',
    justifyContent: 'start',
    width: 200,
    height: 100,
    paddingVertical: 10,
  },
  cartasContainer: {
    flexDirection: 'row',
    borderColor: 'black',
    borderWidth: 1,
    borderRadius: 5,
    justifyContent: 'space-between',
  },
  containerRight: {
    top: 25,
    left: 15,
    flex: 1,
    alignItems: 'start',
    flexDirection: 'column',
    justifyContent: 'start',
  },
  textStyle: {
    marginStart: 10,
    color: 'black',
    fontWeight: 'bold',
    textAlign: 'auto',
    textAlignVertical: 'center',
    fontSize: 20,
  },
  botonUse: {
    backgroundColor: 'red',
    color: 'red',
    padding: 10,
    marginBottom: 5,
    marginTop: 5,
    marginEnd: 5,
    textAlign: 'center',
    borderRadius: 5,

  },
  textUse: {
    color: 'black',
    fontWeight: 'bold',
    textAlign: 'center',
    textAlignVertical: 'center',
    fontSize: 20,
  },
  containerleft: {
    height: 400,
    width: 600,

  },
  mapImage: {
    width: 300,
    height: 300,
  },
  zoneText: {
    color: 'black',
    fontWeight: 'bold',
  },
  buttonContainer: {
    flexDirection: 'column',
    justifyContent: 'space-around',
    width: 200
  },
  botonControl: {
    backgroundColor: '#007bff',
    color: 'white',
    padding: 10,
    textAlign: 'center',
    margin: 10,
    borderRadius: 5,
  },
  colorSquare: {
    width: 10,
    height: 10,
    margin: 10,
  },
      // Chat button styles
  chatButton: {
    backgroundColor: '#FF6347',
    color: 'white',
    padding: 10,
    textAlign: 'center',
    margin: 10,
    borderRadius: 5,    
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
});

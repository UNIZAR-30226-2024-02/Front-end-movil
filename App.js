import * as React from 'react';
import { StyleSheet,View, Text } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack'
import HomeScreen from './Pantallas/Home';
import Login from './Pantallas/Login';
import Register from './Pantallas/Register';
import Inicial from './Pantallas/Inicial';
import Tienda from './Pantallas/Tienda';
import CrearPartida from './Pantallas/CrearPartida';
import Ranking from './Pantallas/Ranking';
import SkinDetailScreen from './Pantallas/SkinDetailScreen';
import Perfil from './Pantallas/Perfil';
import MyChats from './Pantallas/MyChats';
import MySkins from './Pantallas/MySkins';
import MyHistory from './Pantallas/MyHistory';
import MySkinDetailScreen from './Pantallas/MySkinDetailScreen';
import RiskMap from './Pantallas/RiskMap';
import BuscarJugador from './Pantallas/BuscarJugador';
import MisAmigos from './Pantallas/MisAmigos';
import FriendDetails from './Pantallas/FriendDetails';
import MisSolicitudes from './Pantallas/MisSolicitudes';
import SolicitudDetails from './Pantallas/SolicitudDetails';
import Chat from './Pantallas/Chat';
import Partidas from './Pantallas/Partidas';
import Lobby from './Pantallas/Lobby';
import SocketsTest from './Pantallas/SocketsTest';
import Partida from './Pantallas/Partida';
import Amistad from './Pantallas/Amistad';

const Stack = createNativeStackNavigator();

export default function App() {
  console.log('Entered')
  return (
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen name="Home" component={HomeScreen} options={{ headerShown: false }}/>
        <Stack.Screen name="Login" component={Login} options={{ headerShown: false }}/>
        <Stack.Screen name="Register" component={Register} options={{ headerShown: false }}/>
        <Stack.Screen name="Inicial" component={Inicial} options={{ headerShown: false }}/>
        <Stack.Screen name="Tienda" component={Tienda} options={{ headerShown: false }}/>
        <Stack.Screen name="CrearPartida" component={CrearPartida} options={{ headerShown: false }}/>
        <Stack.Screen name="Ranking" component={Ranking} options={{ headerShown: false }}/>
        <Stack.Screen name="SkinDetailScreen" component={SkinDetailScreen} options={{ headerShown: false }}/>
        <Stack.Screen name="Perfil" component={Perfil} options={{ headerShown: false }}/>
        <Stack.Screen name="MyChats" component={MyChats} options={{ headerShown: false }}/>
        <Stack.Screen name="MySkins" component={MySkins} options={{ headerShown: false }}/>
        <Stack.Screen name="MyHistory" component={MyHistory} options={{ headerShown: false }}/>
        <Stack.Screen name="MySkinDetailScreen" component={MySkinDetailScreen} options={{ headerShown: false }}/>
        <Stack.Screen name="RiskMap" component={RiskMap} options={{ headerShown: false }}/>
        <Stack.Screen name="BuscarJugador" component={BuscarJugador} options={{ headerShown: false }}/>
        <Stack.Screen name="MisAmigos" component={MisAmigos} options={{ headerShown: false }}/>
        <Stack.Screen name="MisSolicitudes" component={MisSolicitudes} options={{ headerShown: false }}/>
        <Stack.Screen name="FriendDetails" component={FriendDetails} options={{ headerShown: false }}/>
        <Stack.Screen name="SolicitudDetails" component={SolicitudDetails} options={{ headerShown: false }}/>
        <Stack.Screen name="Chat" component={Chat} options={{ headerShown: false }}/>
        <Stack.Screen name="Partidas" component={Partidas} options={{ headerShown: false }}/>
        <Stack.Screen name="Lobby" component={Lobby} options={{ headerShown: false }}/>
        <Stack.Screen name="SocketsTest" component={SocketsTest} options={{ headerShown: false }}/>
        <Stack.Screen name="Partida" component={Partida} options={{ headerShown: false }}/>
        <Stack.Screen name="Amistad" component={Amistad} options={{ headerShown: false }}/>
        {/* Add more screens here as needed */}
      </Stack.Navigator>
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});

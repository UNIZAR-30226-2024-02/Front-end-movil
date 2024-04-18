import * as React from 'react';
import { StyleSheet,View, Text } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack'
import HomeScreen from './Pantallas/Home'; // Importing HomeScreen from the same directory
import Login from './Pantallas/Login'; // Assuming Login is in the "Pantallas" directory
import Register from './Pantallas/Register'; // Assuming Login is in the "Pantallas" directory
import Inicial from './Pantallas/Inicial'; // Assuming Login is in the "Pantallas" directory
import Tienda from './Pantallas/Tienda'; // Assuming Login is in the "Pantallas" directory
import CrearPartida from './Pantallas/CrearPartida'; // Assuming Login is in the "Pantallas" directory
import Ranking from './Pantallas/Ranking'; // Assuming Login is in the "Pantallas" directory
import SkinDetailScreen from './Pantallas/SkinDetailScreen'; // Assuming Login is in the "Pantallas" directory
import Perfil from './Pantallas/Perfil'; // Assuming Login is in the "Pantallas" directory
import MyChats from './Pantallas/MyChats'; // Assuming Login is in the "Pantallas" directory
import MySkins from './Pantallas/MySkins'; // Assuming Login is in the "Pantallas" directory
import MyHistory from './Pantallas/MyHistory'; // Assuming Login is in the "Pantallas" directory
import MySkinDetailScreen from './Pantallas/MySkinDetailScreen'; // Assuming Login is in the "Pantallas" directory
import RiskMap from './Pantallas/RiskMap'; // Assuming Login is in the "Pantallas" directory
import BuscarJugador from './Pantallas/BuscarJugador'; // Assuming Login is in the "Pantallas" directory
import MisAmigos from './Pantallas/MisAmigos'; // Assuming Login is in the "Pantallas" directory
import FriendDetails from './Pantallas/FriendDetails'; // Assuming Login is in the "Pantallas" directory
import MisSolicitudes from './Pantallas/MisSolicitudes'; // Assuming Login is in the "Pantallas" directory
import SolicitudDetails from './Pantallas/SolicitudDetails'; // Assuming Login is in the "Pantallas" directory
import Chat from './Pantallas/Chat'; // Assuming Login is in the "Pantallas" directory


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

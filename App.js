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


const Stack = createNativeStackNavigator();

export default function App() {
  console.log('Entered')
  return (
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen name="Home" component={HomeScreen} />
        <Stack.Screen name="Login" component={Login} />
        <Stack.Screen name="Register" component={Register} />
        <Stack.Screen name="Inicial" component={Inicial} />
        <Stack.Screen name="Tienda" component={Tienda} />
        <Stack.Screen name="CrearPartida" component={CrearPartida} />
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

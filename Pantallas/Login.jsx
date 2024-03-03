import React from 'react';
import { View, Image, useWindowDimensions, TextInput, TouchableOpacity, StyleSheet, Text } from 'react-native';

export default function App({ navigation }) {
  const { width, height } = useWindowDimensions();

  const handleLogin = () => {
    // Handle login logic here
    // Assuming login is successful, navigate to the "Inicial" screen
    navigation.navigate('Inicial');
  };

  return (
    <View style={styles.container}>
      <Image
        source={require('../assets/guerra.jpg')}
        style={{
          flex: 1,
          resizeMode: 'cover',
          width: width,
          height: height,
          position: 'absolute',
          top: 0,
          left: 0,
        }}
      />
      <View style={styles.overlayContainer}>
        <Text style={styles.title}>Iniciar Sesión</Text>
        <View style={styles.inputContainer}>
          <TextInput
            style={styles.input}
            placeholder="Nombre de usuario"
          />
          <TextInput
            style={styles.input}
            placeholder="Contraseña"
            secureTextEntry={true}
          />
        </View>
        <TouchableOpacity style={styles.button} onPress={handleLogin}>
          <Text style={styles.buttonText}>Iniciar Sesión</Text>
        </TouchableOpacity>
        <Text>Si no tienes cuenta puedes registrarte aquí</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'row', // Set flexDirection to 'row' for horizontal layout
    justifyContent: 'center',
    alignItems: 'center',
  },
  overlayContainer: {
    maxWidth: 300,
    width: '100%',
    margin: 40,
    padding: 15,
    shadowColor: 'rgba(0, 0, 0, 0.2)',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.8,
    shadowRadius: 8,
    borderRadius: 10,
    backgroundColor: 'rgba(255, 255, 255, 0.8)',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    color: 'black',
  },
  inputContainer: {
    flexDirection: 'row', // Set flexDirection to 'row' for horizontal layout
    marginBottom: 15,
  },
  input: {
    flex: 1, // Take up all available space within the parent container
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 10,
    marginRight: 10, // Add margin between input fields
    backgroundColor: 'white',
  },
  button: {
    backgroundColor: 'green',
    padding: 10,
    borderRadius: 8,
    width: '100%',
    alignItems: 'center',
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

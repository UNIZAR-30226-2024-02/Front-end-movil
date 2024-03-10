import React, { useState } from 'react';
import { View, TextInput, FlatList, Text, StyleSheet, TouchableOpacity, ImageBackground} from 'react-native';

const PlayerSearch = ({navigation}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);

  const playersData = [
    { id: 1, username: 'player1', name: 'Player One' },
    { id: 2, username: 'player2', name: 'Player Two' },
    { id: 3, username: 'player3', name: 'Player Three' },
    //Modificar esto segun la BBDD
  ];

  const handleSearch = () => {
    if (searchQuery.trim() === '') {
      return;
    }
  
    const results = playersData.filter(
      //cambiar el player.name segun la BBDD
      (player) => player.name.toLowerCase().includes(searchQuery.toLowerCase())
    );
    setSearchResults(results);
  };

  const renderItem = ({ item }) => (
    <TouchableOpacity
      style={styles.playerItem}
      onPress={() => navigation.navigate('PlayerDetails', { playerName: item.name })}
    >
      <Text>{item.name}</Text>
    </TouchableOpacity>
    //cambiar el item.name segun la BBDD
  );

  return (
    <ImageBackground source={require('../assets/guerra.jpg')} style={styles.background}>
        <View style={styles.container}>
        <TextInput
            style={styles.input}
            placeholder="Buscar jugador por nombre de usuario"
            value={searchQuery}
            onChangeText={(text) => setSearchQuery(text)}
        />
        <TouchableOpacity style={styles.searchButton} onPress={handleSearch}>
            <Text style={styles.buttonText}>Buscar</Text>
        </TouchableOpacity>
        <FlatList
            data={searchResults}
            renderItem={renderItem}
            ListEmptyComponent={<Text>No se encontraron resultados</Text>}
        />
        </View>
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  background: {
    flex: 1,
    resizeMode: 'cover',
    justifyContent: 'center',
  },
  input: {
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    marginBottom: 10,
    paddingHorizontal: 10,
    backgroundColor: 'rgba(255, 255, 255, 0.5)',
  },
  searchButton: {
    backgroundColor: '#3498db',
    paddingVertical: 10,
    alignItems: 'center',
    borderRadius: 5,
    marginBottom: 10,
  },
  buttonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  playerItem: {
    padding: 10,
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 5,
    marginBottom: 10,
    backgroundColor: '#ffffff',
  },
});

export default PlayerSearch;
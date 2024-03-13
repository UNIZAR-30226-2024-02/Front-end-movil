import React, { useState, useEffect } from 'react';
import { View, ScrollView, Image, ImageBackground, TouchableOpacity, Text, StyleSheet } from 'react-native';
import axios from 'axios';

export default function Tienda({ navigation, route }) {
  const { token } = route.params;
  const [skins, setSkins] = useState([]);
  console.log('Token:', token); // Access token
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.post(
          'http://192.168.1.44:4000/tienda', // Replace with your server's URL
          { sortBy: 'precio', precioMin: 0, precioMax: 100000000, tipo: undefined },
          { headers: { Authorization: token } }
        );
        setSkins(response.data);
      } catch (error) {
        console.error('Error fetching skins:', error);
      }
    };

    fetchData();
  }, [token]);

  // Function to handle when a skin is pressed
  const handleSkinPress = (skinId) => {
    const selectedSkin = skins.find((skin) => skin.id === skinId);
    navigation.navigate('SkinDetailScreen', { skin: selectedSkin, token: token });
  };

  return (
    <ImageBackground source={require('../assets/tienda.jpg')} style={styles.background}>
      <ScrollView contentContainerStyle={styles.container}>
        {skins.map((skin) => (
          <TouchableOpacity
            key={skin.id}
            style={styles.skinItem}
            onPress={() => handleSkinPress(skin.id)}
          >
            <Image source={{ uri: skin.path }} style={styles.skinImage} />
            <View style={styles.skinDetails}>
              <Text style={styles.skinName}>{skin.idSkin}</Text>
              <Text style={styles.skinDescription}>{skin.tipo}</Text>
              <Text style={styles.skinPrice}>{skin.precio}</Text>
            </View>
          </TouchableOpacity>
        ))}
      </ScrollView>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 20,
  },
  background: {
    flex: 1,
    resizeMode: 'cover',
    justifyContent: 'center',
  },
  skinItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
    backgroundColor: '#ffffff',
    borderRadius: 8,
    width: '90%',
    elevation: 3,
    backgroundColor: 'rgba(255, 255, 255, 0.5)',
  },
  skinImage: {
    width: 100,
    height: 100,
    borderRadius: 8,
    margin: 10,
  },
  skinDetails: {
    flex: 1,
    justifyContent: 'center',
    marginLeft: 10,
  },
  skinName: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  skinDescription: {
    fontSize: 16,
    marginBottom: 5,
  },
  skinPrice: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#4CAF50',
  },
});

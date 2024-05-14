import React, { useState, useEffect } from 'react';
import { View, Text, Image, StyleSheet, TouchableOpacity, ImageBackground,Alert } from 'react-native';
import axios from 'axios';
import { IP } from '../config';
import { images } from '../assets/Skins_image'
import { FontAwesome } from '@expo/vector-icons'; // Import FontAwesome from expo/vector-icons

export default function SkinDetailScreen({ route }) {
  const { skin, token } = route.params;
  const [misSkin, setSkinsMySkins] = useState([]);

  const fetchData = async () => {
    try {
      const responseMy = await axios.get(
        IP + '/misSkins/enPropiedad', // Replace with your server's URL
        { headers: { Authorization: token } }
      );
      setSkinsMySkins(responseMy.data);
    } catch (error) {
      console.error('Error fetching skins:', error);
    }
  };

  useEffect(() => {
    fetchData();
  }, [token]);

  const handleBuyButtonPress = async () => {
    if (misSkin.some(s => s._id === skin._id)) {
      Alert.alert('Error', 'Esta skin ya está comprada.');
    } else {
      try {
        const response = await axios.post(
          IP + '/tienda/comprar', // Replace with your server's URL
          { idSkin: skin.idSkin },
          { headers: { Authorization: token } }
        );
        Alert.alert('Éxito', 'La skin se ha comprado correctamente.');
        fetchData();
      } catch (error) {
        Alert.alert('Error', 'La compra de la skin no se ha podido realizar.');
      }
    }
  };

  return (
    <ImageBackground source={require('../assets/tienda.jpg')} style={styles.background} resizeMode="cover">
      <View style={styles.container}>
        <View style={styles.content}>
          <Image source={images.find(item => item.index === skin.idSkin).img} style={styles.skinImage} />
          <View style={styles.detailsContainer}>
            <Text style={styles.skinName}>{skin.idSkin}</Text>
            <Text style={styles.skinDescription}>Tipo: {skin.tipo}</Text>
          </View>
        </View>

        <TouchableOpacity
          style={[styles.buyButton, misSkin.some(s => s._id === skin._id) && styles.buttonDisabled]}
          onPress={handleBuyButtonPress}
          disabled={misSkin.some(s => s._id === skin._id)}
        >
          <Text style={styles.priceText}>
            {misSkin.some(s => s._id === skin._id) ? 'Adquirido' : `Comprar ${skin.precio}`}
          </Text>
        </TouchableOpacity>

      </View>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'flex-start', // Align items at the top
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 50,
    
  },
  background: {
    flex: 1,
    resizeMode: 'cover',
    justifyContent: 'center',
  },
  content: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  skinImage: {
    width: '40%',
    aspectRatio: 1,
    borderRadius: 8,
  },
  detailsContainer: {
    flex: 1,
    marginLeft: 20,
    justifyContent: 'flex-start', // Align items at the top
  },
  skinName: {
    fontSize: 40,
    fontWeight: 'bold',
    textAlign: 'center',
    color:'white',
    marginBottom: 10,
    
  },
  skinDescription: {
    top:20,
    fontSize: 30,
    color:'white',
    textAlign: 'center',
    marginBottom: 20,
    paddingBottom: 150, // Add paddingTop to give space for the skin name
    
  },
  buyButton: {
    position: 'absolute', // Position the button absolutely
    bottom: 60, // Adjust the bottom margin
    right: 80,
    backgroundColor: 'olive',
    borderRadius: 8,
    paddingVertical: 20,
    paddingHorizontal: 80,
    alignItems: 'center', // Align button content at the center horizontally
    flexDirection: 'row', // Arrange button content in a row
  },
  buyButtonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
    marginRight: 10, // Add spacing between button text and price
  },
  priceText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
    
  },
});

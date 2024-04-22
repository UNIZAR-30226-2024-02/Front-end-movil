import React, { useState, useEffect } from 'react';
import { View, Text, Image, StyleSheet, TouchableOpacity, ImageBackground,Alert } from 'react-native';
import axios from 'axios';
import { IP } from '../config';
import { images } from '../assets/Skins_image'

export default function SkinDetailScreen({ route}) {
  const { skin,token} = route.params;
  const [misSkin,setSkinsMySkins]=useState([]);
  console.log('Token:', token); // Access token
  const fetchData = async () => {
    try {
      const responseMy = await axios.get(
        IP+'/misSkins/enPropiedad', // Replace with your server's URL
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

  const handleBuyButtonPress = async() => {
    // Handle buy button press event here
    console.log('Buy button pressed');
    console.log('Skin:', skin.idSkin); // Access skin details
    console.log('Token:', token); // Access token
    try {
      const response = await axios.post(
        IP+'/tienda/comprar', // Replace with your server's URL
        { idSkin: skin.idSkin },
        { headers: { Authorization: token } }
        
      );
      console.log('Response:', response.data);
      Alert.alert('Éxito', 'La skin se ha comprado correctamente.');
      fetchData();
    } catch (error) {
      Alert.alert('Error', 'La compra de la skin no se ha podido realizar.');
      console.error('Error fetching skins:', error);
    }
  };

  return (
    <ImageBackground source={require('../assets/tienda.jpg')} style={styles.background}>
      <View style={styles.container}>
        <View style={styles.content}>
          <Image source={images.find(item => item.index === skin.idSkin).img} style={styles.skinImage} />
          <View style={styles.detailsContainer}>
            <Text style={styles.skinName}>{skin.idSkin}</Text>
            <Text style={styles.skinDescription}>{skin.tipo}</Text>
          </View>
        </View>
        { misSkin.length > 0 ?
        ( <TouchableOpacity 
          style={styles.buyButton} 
          onPress={(misSkin.filter(item => item !== null)).some(s => s._id === skin._id) ? null : handleBuyButtonPress}
          disabled={(misSkin.filter(item => item !== null)).some(s => s._id === skin._id)}
        >
          <Text style={styles.priceText}>
            {(misSkin.filter(item => item !== null)).length > 0 ? 
              ((misSkin.filter(item => item !== null)).some(s => s._id === skin._id) ? 'Adquirido' : skin.precio) 
              : skin.precio}
          </Text>
        </TouchableOpacity>) : (<TouchableOpacity style={styles.buyButton} onPress={handleBuyButtonPress}>
          <Text style={styles.priceText}>{skin.precio}</Text>
        </TouchableOpacity>)}
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
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 10,
    
  },
  skinDescription: {
    top:1,
    fontSize: 18,
    textAlign: 'center',
    marginBottom: 20,
    paddingBottom: 150, // Add paddingTop to give space for the skin name
    
  },
  buyButton: {
    position: 'absolute', // Position the button absolutely
    bottom: 20, // Adjust the bottom margin
    right: 150,
    backgroundColor: '#4CAF50',
    borderRadius: 8,
    paddingVertical: 10,
    paddingHorizontal: 30,
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

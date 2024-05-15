import React, { useState,useEffect } from 'react';
import { View, Text, Image, StyleSheet, TouchableOpacity, Alert, ImageBackground } from 'react-native';
import axios from 'axios';
import { IP } from '../config';
import { images } from '../assets/Skins_image'
import { MaterialIcons } from '@expo/vector-icons';


export default function MySkinDetailScreen({navigation, route }) {
  const { skin,id,token} = route.params;
  const [skins,setSkins]=useState([]);
  const fetchData = async () => {
    try {
      const response = await axios.get(
        IP+'/misSkins/equipadas', // Replace with your server's URL
        { headers: { Authorization: token } }
      );
      setSkins(response.data[skin.tipo.charAt(0).toLowerCase() + skin.tipo.slice(1)]);
    } catch (error) {
      console.error('Error fetching skins:', error);
    }
  };

  const goToMySkins = () => {
    navigation.navigate('MySkins', {id:id, token: token });
  };
  useEffect(() => {
    
    fetchData();
  }, [token]);

  const handleEquipadasPress = async() => {
    // Handle buy button press event here

    try {
      const response = await axios.post(
        IP+'/misSkins/equipar', // Replace with your server's URL
        { skinAEquipar: skin.idSkin },
        { headers: { Authorization: token } }
      );
      Alert.alert("Skin equipada correctamente.");
      fetchData();
    } catch (error) {
      console.error('Error fetching skins:', error);
    }
  };

  
  return (
    <ImageBackground source={require('../assets/img-2d3IDaHACsstyAx6hCGZP.jpeg')} style={styles.background}>
      <View style={styles.container}>
      <TouchableOpacity
        style={{ marginTop:-20, marginLeft:-600,width: 50,
        height: 50,
        alignItems:'center',
        justifyContent: 'center',
        borderRadius: 25, // Half of the width and height to make it a circle
        backgroundColor: 'silver'}}
        onPress={goToMySkins}
      >
        <MaterialIcons name="arrow-back" size={30} color="black" />
      </TouchableOpacity>
        <View style={styles.content}>
          <Image source={images.find(item => item.index === skin.idSkin).img} style={styles.skinImage} />
          <View style={styles.detailsContainer}>
            <Text style={styles.skinName}>{skin.idSkin}</Text>
            <Text style={styles.skinDescription}>Tipo: {skin.tipo}</Text>
          </View>
        </View>
        {skins && skins._id === skin._id ? (
          <View style={styles.buyButton}>
            <Text style={styles.buyButtonText}>Equipado</Text>
          </View>
        ) : (
            <TouchableOpacity 
              style={styles.buyButton} 
              onPress={handleEquipadasPress}
            >
              <Text style={styles.buyButtonText}>Equipar</Text>
            </TouchableOpacity>
          )
        }
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
    width: '35%',
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
    color:'white',
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 10,
    
  },
  skinDescription: {
    top:1,
    fontSize: 40,
    color:'white',
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
import React from 'react';
import { View, Text, Image, StyleSheet, TouchableOpacity } from 'react-native';

export default function MySkinDetailScreen({ route }) {
  const { skin,token} = route.params;
  console.log('Token:', token); // Access token


  return (
    <View style={styles.container}>
      <View style={styles.content}>
        <Image source={skin.path} style={styles.skinImage} />
        <View style={styles.detailsContainer}>
          <Text style={styles.skinName}>{skin.idSkin}</Text>
          <Text style={styles.skinDescription}>{skin.tipo}</Text>
          <Text style={styles.skinPrice}>{skin.precio}</Text>
        </View>
      </View>
      <TouchableOpacity style={styles.buyButton}>
        <Text style={styles.buyButtonText}>Buy</Text>
        <Text style={styles.priceText}>{skin.precio}</Text>
      </TouchableOpacity>
    </View>
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
  skinPrice: {
    top:2,
    fontSize: 18,
    textAlign: 'center',
    marginBottom: 20,
    paddingBottom: 170, // Add paddingTop to give space for the skin name
    
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


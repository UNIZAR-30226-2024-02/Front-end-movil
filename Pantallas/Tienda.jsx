import React from 'react';
import { View, ScrollView, Image, TouchableOpacity, Text, StyleSheet } from 'react-native';

export default function Tienda() {
  // Sample data for skins
  const skins = [
    {
      id: 1,
      name: 'Skin 1',
      description: 'Description of Skin 1',
      price: '$10',
      image: require('../assets/skin1.jpg'),
    },
    {
      id: 2,
      name: 'Skin 2',
      description: 'Description of Skin 2',
      price: '$15',
      image: require('../assets/skin2.jpg'),
    },
    {
        id: 3,
        name: 'Skin 2',
        description: 'Description of Skin 2',
        price: '$15',
        image: require('../assets/skin2.jpg'),
      },
      {
        id: 4,
        name: 'Skin 2',
        description: 'Description of Skin 2',
        price: '$15',
        image: require('../assets/skin2.jpg'),
      },
      {
        id: 5,
        name: 'Skin 2',
        description: 'Description of Skin 2',
        price: '$15',
        image: require('../assets/skin2.jpg'),
      },
      {
        id: 6,
        name: 'Skin 2',
        description: 'Description of Skin 2',
        price: '$15',
        image: require('../assets/skin2.jpg'),
      },
    // Add more skins as needed
  ];

  // Function to handle when a skin is pressed
  const handleSkinPress = (skinId) => {
    // Handle the press event, for example, navigate to a detail screen
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      {skins.map((skin) => (
        <TouchableOpacity
          key={skin.id}
          style={styles.skinItem}
          onPress={() => handleSkinPress(skin.id)}
        >
          <Image source={skin.image} style={styles.skinImage} />
          <View style={styles.skinDetails}>
            <Text style={styles.skinName}>{skin.name}</Text>
            <Text style={styles.skinDescription}>{skin.description}</Text>
            <Text style={styles.skinPrice}>{skin.price}</Text>
          </View>
        </TouchableOpacity>
      ))}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 20,
  },
  skinItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
    backgroundColor: '#ffffff',
    borderRadius: 8,
    width: '90%',
    elevation: 3,
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

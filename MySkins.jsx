import React from 'react';
import { View, ScrollView, Image, ImageBackground, TouchableOpacity, Text, StyleSheet } from 'react-native';

export default function MySkins({ navigation }) {
  // Sample data for user's skins
  const userSkins = [
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
    // Add more skins for the user as needed
  ];

  const handleSkinPress = (skinId) => {
    // Handle press event for the skin
    const selectedSkin = userSkins.find(skin => skin.id === skinId);
    navigation.navigate('MySkinDetailScreen', { skin: selectedSkin });
  };

  return (
    <ImageBackground source={require('../assets/guerra.jpg')} style={styles.backgroundImage}>
      <ScrollView contentContainerStyle={styles.container}>
        {userSkins.map((skin) => (
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
  skinItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.8)',
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
  backgroundImage: {
    flex: 1,
    resizeMode: 'cover',
    justifyContent: 'center',
  },
});

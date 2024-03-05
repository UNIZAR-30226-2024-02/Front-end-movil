import React from 'react';
import { View, Text, Image, StyleSheet, TouchableOpacity } from 'react-native';

export default function SkinDetailScreen({ route }) {
  const { skin } = route.params;

  const handleBuyButtonPress = () => {
    // Handle buy button press event here
    console.log('Buy button pressed');
  };

  return (
    <View style={styles.container}>
      <View style={styles.content}>
        <Image source={skin.image} style={styles.skinImage} />
        <View style={styles.detailsContainer}>
          <Text style={styles.skinName}>{skin.name}</Text>
          <Text style={styles.skinDescription}>{skin.description}</Text>
        </View>
      </View>

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

});

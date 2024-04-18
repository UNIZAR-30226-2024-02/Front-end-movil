import React from 'react';
import { View, Image, StyleSheet, TouchableOpacity, Text } from 'react-native';
import { IP } from '../config';

export default function RiskMap() {
  // Define event handlers for touch events
  const handleLowRiskPress = () => {
    // Handle touch event for low-risk zone
    console.log('Low risk zone pressed');
  };

  const handleMediumRiskPress = () => {
    // Handle touch event for medium-risk zone
    console.log('Medium risk zone pressed');
  };

  const handleHighRiskPress = () => {
    // Handle touch event for high-risk zone
    console.log('High risk zone pressed');
  };

  return (
    <View style={styles.container}>
      <Image source={require('../assets/risk-map.jpg')} style={styles.mapImage} />
      {/* Touchable areas representing different risk zones */}
      <TouchableOpacity style={styles.lowRiskZone} onPress={handleLowRiskPress}>
        <Text style={styles.zoneText}>Low Risk</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.mediumRiskZone} onPress={handleMediumRiskPress}>
        <Text style={styles.zoneText}>Medium Risk</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.highRiskZone} onPress={handleHighRiskPress}>
        <Text style={styles.zoneText}>High Risk</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  mapImage: {
    width: 300,
    height: 300,
  },
  lowRiskZone: {
    position: 'absolute',
    top: 50,
    left: 50,
    width: 100,
    height: 100,
    backgroundColor: 'green',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 50,
  },
  mediumRiskZone: {
    position: 'absolute',
    top: 150,
    left: 150,
    width: 100,
    height: 100,
    backgroundColor: 'yellow',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 50,
  },
  highRiskZone: {
    position: 'absolute',
    top: 250,
    left: 250,
    width: 100,
    height: 100,
    backgroundColor: 'red',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 50,
  },
  zoneText: {
    color: 'white',
    fontWeight: 'bold',
  },
});

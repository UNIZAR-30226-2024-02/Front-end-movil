import React, { useState, useEffect } from 'react';
import { View, ScrollView, Image, ImageBackground, TouchableOpacity, Text, StyleSheet } from 'react-native';
import axios from 'axios';
import { IP } from '../config';
import { images } from '../assets/Skins_image'

export default function Tienda({ navigation, route }) {
  const { token } = route.params;
  const [skins, setSkins] = useState([]);
  const [misSkin,setSkinsMySkins]=useState([]);
  const [money, setMoney]=useState({});
  console.log('Token:', token); // Access token
  const fetchData = async () => {
    try {
      const response = await axios.post(
        IP+'/tienda', // Replace with your server's URL
        { sortBy: 'precio', precioMin: 0, precioMax: 100000000, tipo: undefined },
        { headers: { Authorization: token } }
      );
      setSkins(response.data);
      console.log("Skins: ",response.data);
      const responseMy = await axios.get(
        IP+'/misSkins/enPropiedad', // Replace with your server's URL
        { headers: { Authorization: token } }
      );
      setSkinsMySkins(responseMy.data);
      const responseMoney=await axios.get(
        IP+'/tienda/dineroUser', // Replace with your server's URL
        { headers: { Authorization: token } }
      );
      setMoney(responseMoney.data);
      console.log("Money: ",responseMoney.data);
    } catch (error) {
      console.error('Error fetching skins:', error);
    }
  };

  useEffect(() => {
    fetchData();
  }, [token]);

  // Function to handle when a skin is pressed
  const handleSkinPress = (skinId) => {
    const selectedSkin = skins.find((skin) => skin._id === skinId);
    navigation.navigate('SkinDetailScreen', { skin: selectedSkin, token: token });
  };

  return (
    <ImageBackground source={require('../assets/tienda.jpg')} style={styles.background}>
      <View style={styles.moneyContainer}>
        <Text style={styles.moneyText}>Dinero: {money.dinero}</Text>
      </View>
      <ScrollView contentContainerStyle={styles.container}>
        {skins.map((skin) => (
          <TouchableOpacity
            key={skin._id}
            style={styles.skinItem}
            onPress={() => handleSkinPress(skin._id)}
          >
            <Image source={images.find(item => item.index === skin.idSkin).img} style={styles.skinImage}/>
            <View style={styles.skinDetails}>
              <Text style={styles.skinName}>{skin.idSkin}</Text>
              <Text style={styles.skinDescription}>{skin.tipo}</Text>
              <Text style={styles.skinPrice}>{(misSkin.filter(item => item !== null)).some(s => s._id === skin._id) ? 'Adquirido' : skin.precio}</Text>
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
    paddingVertical: 10, 
  },
  moneyContainer: {
    marginTop: 30, 
    marginLeft: 15, 
  },
  moneyText: {
    color: 'white',
    fontSize: 20,
    fontWeight: 'bold',
    textTransform: 'uppercase',
    textShadowColor: 'black',
    textShadowOffset: { width: 2, height: 1 },
    textShadowRadius: 2,
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

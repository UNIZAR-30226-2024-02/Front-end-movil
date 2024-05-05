import React, { useState, useEffect } from 'react';
import { View, ScrollView, Image, ImageBackground, TouchableOpacity, Text, StyleSheet } from 'react-native';
import axios from 'axios';
import { IP } from '../config';
import { images } from '../assets/Skins_image'

export default function MisSkins({ navigation, route }) {
  const { token } = route.params;
  const [skins, setSkins] = useState([]);
  const [equipada,setEquipada]=useState([]);
  console.log('Token:', token); // Access token
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(
          IP+'/misSkins/enPropiedad', // Replace with your server's URL
          { headers: { Authorization: token } }
        );
        setSkins(response.data);
        console.log(response.data);
      } catch (error) {
        console.error('Error fetching skins:', error);
      }
    };

    const equipadas = async () => {
      try {
        const response = await axios.get(
          IP+'/misSkins/equipadas', // Replace with your server's URL
          { headers: { Authorization: token } }
        );
        console.log("Equipadas: ",response.data);
        setEquipada(response.data);
      } catch (error) {
        console.error('Error fetching skins:', error);
      }
    };

    fetchData();
    equipadas();
  }, [token]);



  // Function to handle when a skin is pressed
  const handleSkinPress = (skinId) => {
    const selectedSkin = (skins.filter(item => item !== null)).find((skin) => skin._id === skinId);
    navigation.navigate('MySkinDetailScreen', { skin: selectedSkin, token: token });
  };

  return (
    <ImageBackground source={require('../assets/img-2d3IDaHACsstyAx6hCGZP.jpeg')} style={styles.background}>
      <ScrollView contentContainerStyle={styles.container}>
        {(skins.filter(item => item !== null)).map((skin) => (
          <TouchableOpacity
            key={skin._id}
            style={styles.skinItem}
            onPress={() => handleSkinPress(skin._id)}
          >
            <Image source={images.find(item => item.index === skin.idSkin).img} style={styles.skinImage}/>
            <View style={styles.skinDetails}>
              <Text style={styles.skinName}>{skin.idSkin}</Text>
              <Text style={styles.skinDescription}>{skin.tipo}</Text>
              {
                equipada[skin.tipo.charAt(0).toLowerCase() + skin.tipo.slice(1)]._id === skin._id && 
                (<Text style={styles.skinEquiped}>Equipada</Text>)
              }
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
  skinEquiped: {
    fontSize: 16,
    marginBottom: 5,
    color:'green',
  },
  skinPrice: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#4CAF50',
  },
});

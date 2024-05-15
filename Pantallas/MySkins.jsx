import React, { useState, useEffect } from 'react';
import { View, ScrollView, Image, ImageBackground, TouchableOpacity, Text, StyleSheet } from 'react-native';
import axios from 'axios';
import { IP } from '../config';
import { images } from '../assets/Skins_image'
import { useFocusEffect } from '@react-navigation/native'; // Import useFocusEffect hook
import { MaterialIcons } from '@expo/vector-icons';

export default function MisSkins({ navigation, route }) {
  const {userid, token } = route.params;
  const [skins, setSkins] = useState([]);
  const [equipada,setEquipada]=useState([]);
  
    const fetchData = async () => {
      try {
        const response = await axios.get(
          IP+'/misSkins/enPropiedad', // Replace with your server's URL
          { headers: { Authorization: token } }
        );
        setSkins(response.data);
      } catch (error) {
        console.error('Error fetching skins:', error);
      }
    };
    const goToPerfil = () => {
      navigation.navigate('Perfil', {userid:userid, token: token });
    };
    const equipadas = async () => {
      try {
        const response = await axios.get(
          IP+'/misSkins/equipadas', // Replace with your server's URL
          { headers: { Authorization: token } }
        );
        setEquipada(response.data);
      } catch (error) {
        console.error('Error fetching skins:', error);
      }
    };

   

  useEffect(() => {
    fetchData();
    equipadas();
  }, [token]);
  
  useFocusEffect(
    React.useCallback(() => {
      fetchData();
      equipadas();
    }, [token])
  );

  // Function to handle when a skin is pressed
  const handleSkinPress = (skinId) => {
    const selectedSkin = (skins.filter(item => item !== null)).find((skin) => skin._id === skinId);
    navigation.navigate('MySkinDetailScreen', { skin: selectedSkin,userid:userid, token: token });
  };

  return (
    <ImageBackground source={require('../assets/img-2d3IDaHACsstyAx6hCGZP.jpeg')} style={styles.background}>
      <TouchableOpacity
        style={{ marginTop:30, marginLeft:30,width: 50,
        height: 50,
        alignItems:'center',
        justifyContent: 'center',
        borderRadius: 25, // Half of the width and height to make it a circle
        backgroundColor: 'silver'}}
        onPress={goToPerfil}
      >
        <MaterialIcons name="arrow-back" size={30} color="black" />
      </TouchableOpacity>

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
                equipada[skin.tipo.charAt(0).toLowerCase() + skin.tipo.slice(1)] && equipada[skin.tipo.charAt(0).toLowerCase() + skin.tipo.slice(1)]._id === skin._id && 
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

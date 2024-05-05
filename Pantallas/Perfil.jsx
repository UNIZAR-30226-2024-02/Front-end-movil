import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView,Image, ImageBackground, TouchableOpacity } from 'react-native';
import { FontAwesome } from '@expo/vector-icons'; // Import FontAwesome from expo/vector-icons
import axios from 'axios';
import { images } from '../assets/Skins_image'
import { IP } from '../config';

export default function Perfil({ navigation,route }) {

  const { token } = route.params;
  const [perfil, setPerfil] = useState(null);
  const [equipada,setEquipada]=useState([]);
  const [money, setMoney]=useState({});

  const fetchData = async () => {
    try {
      const response = await axios.get(
        IP+'/perfil',
        { headers: { Authorization: token } }
      );
      console.log(response.data.nombre)
        setPerfil(response.data);
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
      console.log("Equipadas: ",response.data['avatar']);
      setEquipada(response.data['avatar']);
    } catch (error) {
      console.error('Error fetching skins:', error);
    }
  };

  const dinero =async () => {
    try{
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
    equipadas();
    fetchData();
    dinero();
  }, [token]);

  
  const goToMySkins = () => {
    navigation.navigate('MySkins', { token: token });
  };

  const goToMyHistory = () => {
    navigation.navigate('MyHistory', { token: token });
  };

  const goToMyFriends = () => {
    navigation.navigate('MisAmigos', { token: token });
  };

  return (
    <ImageBackground source={require('../assets/guerra.jpg')} style={styles.backgroundImage}  resizeMode="stretch">
      <View style={styles.detailsContainer}>
      {images.find(item => item.index === equipada.idSkin) && (
        <Image
          source={images.find(item => item.index === equipada.idSkin).img}
          style={styles.skinImage}
        />
      )}
        <View style={styles.perfilDetails}>
          <Text style={styles.title}>{perfil ? perfil.nombre : ''} </Text>
          <Text style={styles.title}>Dinero: {money.dinero} </Text>
          <Text style={styles.title}>Elo: {perfil ? perfil.elo : ''} </Text>
        </View>
      </View>
      <ScrollView contentContainerStyle={styles.container}>
        <TouchableOpacity style={styles.skinsbutton} onPress={goToMySkins}>
        <FontAwesome name="paint-brush" size={24} color="white" />
          <Text style={styles.buttonText}>Mis Skins</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.historialbutton} onPress={goToMyHistory}>
        <FontAwesome name="history" size={24} color="white" />
          <Text style={styles.buttonText}>Mi Historial</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.amigosbutton} onPress={goToMyFriends}>
        <FontAwesome name="users" size={24} color="white" />
          <Text style={styles.buttonText}>Mis Amigos</Text>
        </TouchableOpacity>
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
  detailsContainer:{
    flexDirection: 'row',
    borderWidth: 1,
    borderColor: '#DB4437',
    alignItems: 'center',
    marginBottom: 20,
    backgroundColor: '#ffffff',
    borderRadius: 8,
    width: '90%',
    elevation: 3,
    backgroundColor: 'rgba(255, 255, 255, 0.5)',
    marginTop:30,
    marginLeft:15,
  },
  title: {
    fontWeight: 'bold',
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
    textShadowColor: 'black',
    textShadowOffset: { width: 2, height: 1 },
    textShadowRadius: 2,
  },
  skinImage: {
    width: 100,
    height: 100,
    borderRadius: 8,
    margin: 10,
  },
  skinsbutton: {
    backgroundColor: '#DB4437',
    paddingVertical: 11,
    paddingHorizontal: 40,
    borderRadius: 12,
    marginBottom: 0,
    marginRight: 10,
    position: 'absolute',
    left:50,
    justifyContent: 'center',
    alignItems: 'center',
    overflow: 'hidden',
    width:200,
    height:80,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 3,
    },
    shadowOpacity: 0.5,
    shadowRadius: 4,
    elevation: 5,
    // Adding larger darker bottom part
    borderBottomColor: 'rgba(0,0,0,0.2)',
    borderBottomWidth: 5,
  },
  perfilDetails: {
    flex: 1,
    justifyContent: 'center',
    marginLeft: 10,
  },
  amigosbutton: {
    backgroundColor: '#DB4437',
    paddingVertical: 11,
    paddingHorizontal: 40,
    borderRadius: 12,
    marginBottom: 0,
    marginRight: 10,
    position: 'absolute',
    left:500,
    justifyContent: 'center',
    alignItems: 'center',
    overflow: 'hidden',
    width:200,
    height:80,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 3,
    },
    shadowOpacity: 0.5,
    shadowRadius: 4,
    elevation: 5,
    // Adding larger darker bottom part
    borderBottomColor: 'rgba(0,0,0,0.2)',
    borderBottomWidth: 5,
  },
  historialbutton: {
    backgroundColor: '#DB4437',
    paddingVertical: 11,
    paddingHorizontal: 40,
    borderRadius: 12,
    marginBottom: 0,
    marginRight: 10,
    position: 'absolute',
    left:270,
    justifyContent: 'center',
    alignItems: 'center',
    overflow: 'hidden',
    width:200,
    height:80,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 3,
    },
    shadowOpacity: 0.5,
    shadowRadius: 4,
    elevation: 5,
    // Adding larger darker bottom part
    borderBottomColor: 'rgba(0,0,0,0.2)',
    borderBottomWidth: 5,
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
    textTransform: 'uppercase',
    // Adding text shadow to create black outline
    textShadowColor: 'black',
    textShadowOffset: { width: 2, height: 1 },
    textShadowRadius: 2,
  },
  backgroundImage: {
    flex: 1,
    resizeMode: 'cover',
    justifyContent: 'center',
  },
});

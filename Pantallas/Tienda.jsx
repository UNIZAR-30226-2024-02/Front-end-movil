import React, { useState, useEffect } from 'react';
import { View, ScrollView, Image, ImageBackground, TouchableOpacity, Text, TextInput,StyleSheet } from 'react-native'; // Update imports
import axios from 'axios';
import { IP } from '../config';
import { images } from '../assets/Skins_image'
import { useFocusEffect } from '@react-navigation/native'; // Import useFocusEffect hook
import { Picker } from '@react-native-picker/picker'; // Import Picker from the new package
import { MaterialIcons } from '@expo/vector-icons';

export default function Tienda({ navigation, route }) {
  const { userid,token } = route.params;
  const [skins, setSkins] = useState([]);
  const [filtred,setFiltred]=useState([]);
  const [misSkin,setSkinsMySkins]=useState([]);
  const [money, setMoney]=useState({});
  const [price, setPrice] = useState('');
  const [minPrice, setMinPrice] = useState({});
  const [maxPrice, setMaxPrice] = useState({});
  const [type, setType] = useState('');

  // Options for the "Tipo" dropdown menu
  const tipoOptions = [
    { label: 'Avatar', value: 'Avatar' },
    { label: 'SetFichas', value: 'SetFichas' },
    { label: 'Terreno', value: 'Terreno' },
  ];
  console.log('token tienda', token)
  console.log('id tienda', userid)
  const goToInicial=()=>{
    navigation.navigate('Inicial', { userid : userid, token: token });
  };

  const fetchData = async () => {
    try {
      const response = await axios.post(
        IP+'/tienda',
        { sortBy: 'precio', precioMin: 0, precioMax: 100000000, tipo: undefined },
        { headers: { Authorization: token } }
      );
      setSkins(response.data);
      setFiltred(response.data);
      setMaxPrice(100000000);
      setMinPrice(0);
      setPrice('precio');
      setType(undefined);
      const responseMy = await axios.get(
        IP+'/misSkins/enPropiedad',
        { headers: { Authorization: token } }
      );
      setSkinsMySkins(responseMy.data);
      const responseMoney=await axios.get(
        IP+'/tienda/dineroUser',
        { headers: { Authorization: token } }
      );
      setMoney(responseMoney.data);
    } catch (error) {
      console.error('Error fetching skins:', error);
    }
  };

  const handlePriceMin = async (query) => {
    setMinPrice(parseInt(query.nativeEvent.text));
    if (query.nativeEvent.text === '') {
      setFiltred(skins); 
      setMinPrice(0);
    }
    else {
      const filtered = await axios.post(
        IP+'/tienda',
        { sortBy: price, precioMin: minPrice, precioMax: maxPrice, tipo: type },
        { headers: { Authorization: token } }
      );
      setFiltred(filtered.data);
    }
  };

  const handlePriceMax = async (query) => {
    setMaxPrice(parseInt(query.nativeEvent.text));
    if (query.nativeEvent.text === '') {
      setFiltred(skins); 
      setMaxPrice(100000000);
    }
    else {
      const filtered = await axios.post(
        IP+'/tienda',
        { sortBy: price, precioMin: minPrice, precioMax: maxPrice, tipo: type },
        { headers: { Authorization: token } }
      );
      setFiltred(filtered.data);
    }
  };

  const handleOptionChange = async (query) => {
    if (!query) {
      setFiltred(skins); 
      setPrice(undefined);
    } else if (query === 'precio') { // Use equality operator instead of assignment
      const filtered = await axios.post(
        IP+'/tienda',
        { sortBy: price, precioMin: minPrice, precioMax: maxPrice, tipo: type },
        { headers: { Authorization: token } }
      );
      setFiltred(filtered.data);
      setPrice(query); // Use the query value here instead of undefined
    } else {
      const filtered = await axios.post(
        IP+'/tienda',
        { sortBy: 'A-Z', precioMin: minPrice, precioMax: maxPrice, tipo: type },
        { headers: { Authorization: token } }
      );
      setFiltred(filtered.data);
      setPrice(query); // Use the query value here instead of 'A-Z'
    }
  };
  

  const handleTypeChange = async (value) => { // Updated function to handle dropdown change
    setType(value);
    if (!value) {
      setFiltred(skins); 
      setType(undefined);
    }
    else {
      const filtered = await axios.post(
        IP+'/tienda',
        { sortBy: price, precioMin: minPrice, precioMax: maxPrice, tipo: value },
        { headers: { Authorization: token } }
      );
      setFiltred(filtered.data);
    }
  };

  useEffect(() => {
    fetchData();
  }, [token]);

  useFocusEffect(
    React.useCallback(() => {
      fetchData();
    }, [token])
  );

  // Function to handle when a skin is pressed
  const handleSkinPress = (skinId) => {
    const selectedSkin = skins.find((skin) => skin._id === skinId);
    navigation.navigate('SkinDetailScreen', { skin: selectedSkin,userid : userid, token: token });
  };

  return (
    <ImageBackground source={require('../assets/tienda.jpg')} style={styles.background} resizeMode="stretch">
      <TouchableOpacity
        style={{ marginTop:30, marginLeft:10,width: 50,
        height: 50,
        alignItems:'center',
        justifyContent: 'center',
        borderRadius: 25, // Half of the width and height to make it a circle
        backgroundColor: 'silver'}}
        onPress={goToInicial}
      >
        <MaterialIcons name="arrow-back" size={30} color="black" />
      </TouchableOpacity>
      <View style={styles.moneyContainer}>
        <Text style={styles.moneyText}>Mi dinero: {money.dinero} $</Text>
      </View>
      <View style={styles.filterContainer}>
        <Picker
          style={styles.input}
          selectedValue={price}
          onValueChange={handleOptionChange}
        >
          <Picker.Item label="Opciones: precio (menor a mayor) o A-Z" value="" />
          <Picker.Item label="precio" value="precio" />
          <Picker.Item label="A-Z" value="A-Z" />
        </Picker>
        <TextInput style={styles.inputPrice} placeholder="Precio Min" onSubmitEditing={handlePriceMin} mode="outlined"/>
        <TextInput style={styles.inputPrice} placeholder="Precio Max" onSubmitEditing={handlePriceMax} mode="outlined"/>
        <Picker
          style={styles.inputType}
          selectedValue={type}
          onValueChange={handleTypeChange}
        >
          <Picker.Item label="Tipo: Avatar, SetFichas o Terreno" value="" />
          {tipoOptions.map(option => (
            <Picker.Item key={option.value} label={option.label} value={option.value} />
          ))}
        </Picker>
      </View>
      <ScrollView contentContainerStyle={styles.container}>
        {filtred.map((skin) => (
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
  filterContainer: {
    flexDirection: 'row', 
    marginVertical: 5,
    marginLeft:50,
  },
  input: {
    borderWidth: 1,
    borderColor: '#DB4437',
    backgroundColor: '#fff',
    borderRadius: 5,
    paddingHorizontal: 10,
    paddingVertical: 8,
    marginLeft: 30,
    marginRight:20,
    width: 140, 
    height:50,
  },
  inputPrice: {
    borderWidth: 1,
    borderColor: '#DB4437',
    backgroundColor: '#fff',
    borderRadius: 5,
    paddingHorizontal: 10,
    paddingVertical: 8,
    marginRight: 10,
    width: 100, 
    height:50,
  },
  inputType: {
    borderWidth: 1,
    borderColor: '#DB4437',
    backgroundColor: '#fff',
    borderRadius: 5,
    paddingHorizontal: 10,
    paddingVertical: 8,
    marginRight: 10,
    width: 250, 
    height:50,
  },
  moneyContainer: {
    marginTop: -50, 
    marginLeft: 80, 
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

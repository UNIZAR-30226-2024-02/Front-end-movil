import React, { useState, useEffect } from 'react';
import { ScrollView,TouchableOpacity, Text, StyleSheet, ImageBackground, View } from 'react-native';
import axios from 'axios';
import { IP } from '../config';
import { MaterialIcons } from '@expo/vector-icons';

export default function Ranking({navigation, route }) {
  const { userid,token } = route.params;
  const [historialData, setHistorialData] = useState([]);
  useEffect(() => {
    fetchRankingData();
  }, []);

  const fetchRankingData = async () => {
    try {
        const response = await axios.get(IP+'/partidas/historico',{headers: {
        'Authorization': `${token}`
      }});
      setHistorialData(response.data);
    } catch (error) {
      console.error('Error fetching historial data:', error);
    }
  };

  const goToPerfil = () => {
    navigation.navigate('Perfil', {userid : userid, token: token });
  };

  return (
    
    <ImageBackground source={require('../assets/guerra.jpg')} style={styles.background} resizeMode="stretch">
      <TouchableOpacity
        style={{ marginTop:30, marginLeft:-630,width: 50,
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
        <View style={styles.table}>
          <View style={styles.tableHeader}>
          <Text style={[styles.headerText, { flex: 3 }]}>Fecha inicio</Text>
            <Text style={[styles.headerText, { flex: 3 }]}>Fecha fin</Text>
            <Text style={[styles.headerText, { flex: 1 }]}>Turno</Text>
            <Text style={[styles.headerText, { flex: 2 }]}>Jugadores</Text>
          </View>
          {historialData.length === 0 ? <Text style={{ color: 'white' }}>No hay partidas</Text> : historialData.map((part) => (
            <View key={part._id} style={styles.tableRow}>
              <Text style={[styles.fecha, { flex: 3 }]}>{part.fechaInicio}</Text>
              <Text style={[styles.fecha, { flex: 3 }]}>{part.fechaFin}</Text>
              <Text style={[styles.fecha, { flex: 1 }]}>{part.turno}</Text>
              <Text style={[styles.fecha, { flex: 2 }]}>{part.jugadores.map(jugador => (
                (part.ganador === jugador.usuario ? '⭐ ' : ''))+jugador.usuario).join(', ')}</Text>
            </View>
          ))}
        </View>
      </ScrollView>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  background: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  container: {
    flexGrow: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 20,
    marginTop:10,
  },
  table: {
    borderWidth: 1,
    borderColor: '#DB4437',
    borderRadius: 15,
    overflow: 'hidden',
    minWidth: '95%',
  },
  tableHeader: {
    flexDirection: 'row',
    backgroundColor: '#DB4437',
    padding: 10,
  },
  headerText: {
    flex:3,
    textAlign: 'center',
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
    textShadowColor: 'black',
    textShadowOffset: { width: 2, height: 1 },
    textShadowRadius: 2,
  },
  tableRow: {
    flexDirection: 'row',
    backgroundColor: '#ffffff',
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#DB4437',
    backgroundColor: 'gray',
  },
  cell: {
    textAlign: 'center',
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
    textShadowColor: 'black',
    textShadowOffset: { width: 2, height: 1 },
    textShadowRadius: 2,
  },
  fecha: {
    textAlign: 'center',
    color: 'white',
    fontSize: 15,
    fontWeight: 'bold',
    textShadowColor: 'black',
    textShadowOffset: { width: 2, height: 1 },
    textShadowRadius: 2,
  },
});
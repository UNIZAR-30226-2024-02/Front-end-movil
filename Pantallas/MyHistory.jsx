import React, { useState, useEffect } from 'react';
import { ScrollView, Text, StyleSheet, ImageBackground, View } from 'react-native';
import axios from 'axios';
import { IP } from '../config';

export default function Ranking({ route }) {

  const { token } = route.params;
  const [historialData, setHistorialData] = useState([]);
  useEffect(() => {
    fetchRankingData();
  }, []);

  const fetchRankingData = async () => {
    try {
        const response = await axios.get(IP+'/partidas/historico',{headers: {
        'Authorization': `${token}`
      }});
      console.log(response.data)
      setHistorialData(response.data);
    } catch (error) {
      console.error('Error fetching historial data:', error);
    }
  };

  return (
    <ImageBackground source={require('../assets/guerra.jpg')} style={styles.background} resizeMode="stretch">
      <ScrollView contentContainerStyle={styles.container}>
        <View style={styles.table}>
          <View style={styles.tableHeader}>
            <Text style={[styles.headerText]}>Historial</Text>  
          </View>
          
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
    minWidth: '80%',
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
});
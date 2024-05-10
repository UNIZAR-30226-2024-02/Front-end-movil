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
            <Text style={[styles.headerText, { flex: 1 }]}>Historial</Text>
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
  },
  table: {
    borderWidth: 1,
    borderColor: 'white',
    borderRadius: 8,
    overflow: 'hidden',
    minWidth: '80%',
  },
  tableHeader: {
    flexDirection: 'row',
    backgroundColor: '#4CAF50',
    paddingVertical: 10,
  },
  headerText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: 'white',
    textAlign: 'center',
  },
  tableRow: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderBottomColor: 'white',
    paddingVertical: 10,
  },
  cell: {
    fontSize: 16,
    textAlign: 'center',
  },
});
import React, { useState, useEffect } from 'react';
import { ScrollView, Text, StyleSheet, ImageBackground, View } from 'react-native';
import axios from 'axios';
import { IP } from '../config';

export default function Ranking({ route }) {

  const { token } = route.params;
  console.log('Token:', token);
  const [rankingData, setRankingData] = useState([]);
  const [perfil, setPerfil] = useState(null);

  useEffect(() => {
    fetchRankingData();
    fetchData();
  }, []);

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

  const fetchRankingData = async () => {
    try {
        const response = await axios.get(IP+'/ranking',{headers: {
        'Authorization': `${token}`
      }});
      setRankingData(response.data);
    } catch (error) {
      console.error('Error fetching ranking data:', error);
    }
  };

  return (
    <ImageBackground source={require('../assets/guerra.jpg')} style={styles.background}>
      <View style={styles.eloContainer}>
        <Text style={styles.title}>Mi elo:  {perfil ? perfil.elo : ''}</Text>
      </View>
      <ScrollView vertical={true} contentContainerStyle={styles.container}>
        <View style={[styles.table, { minWidth: '60%' }]}>
          <View style={styles.tableHeader}>
            <Text style={[styles.headerText, { flex: 1 }]}>Rank</Text>
            <Text style={[styles.headerText, { flex: 3 }]}>Player</Text>
            <Text style={[styles.headerText, { flex: 1 }]}>Elo</Text>
          </View>
          {rankingData.map((player, index) => (
            <View key={index} style={styles.tableRow}>
              <Text style={[styles.rank, { flex: 1 }]}>{index+1}</Text>
              <Text style={[styles.playerName, { flex: 3 }]}>{player.idUsuario}</Text>
              <Text style={[styles.score, { flex: 1 }]}>{player.elo}</Text>
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
    resizeMode: 'cover',
    justifyContent: 'center',
    alignItems: 'center',
  },
  eloContainer: {
    marginTop: 30, 
    marginLeft: 15, 
    backgroundColor: 'gray',
    borderRadius: 10,
    width: 150,
    borderColor: '#DB4437',
    borderWidth: 2,
  },
  container: {
    flexGrow: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 20,
    marginTop:10,
  },
  title: {
    fontWeight: 'bold',
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
    textShadowColor: 'black',
    textShadowOffset: { width: 2, height: 1 },
    textShadowRadius: 2,
    textAlign:'center',
  },
  table: {
    borderWidth: 1,
    borderColor: '#DB4437',
    borderRadius: 15,
    overflow: 'hidden',
    width: '90%',
  },
  tableHeader: {
    flexDirection: 'row',
    backgroundColor: '#DB4437',
    padding: 10,
  },
  headerText: {
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
  rank: {
    textAlign: 'center',
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
    textShadowColor: 'black',
    textShadowOffset: { width: 2, height: 1 },
    textShadowRadius: 2,
  },
  playerName: {
    textAlign: 'center',
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
    textShadowColor: 'black',
    textShadowOffset: { width: 2, height: 1 },
    textShadowRadius: 2,
  },
  score: {
    textAlign: 'center',
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
    textShadowColor: 'black',
    textShadowOffset: { width: 2, height: 1 },
    textShadowRadius: 2,
  },
});

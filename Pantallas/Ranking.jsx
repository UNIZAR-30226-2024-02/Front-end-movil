import React, { useState, useEffect } from 'react';
import { ScrollView, Text, StyleSheet, ImageBackground, View } from 'react-native';
import axios from 'axios';

export default function Ranking({ route }) {

  const { token } = route.params;
  console.log('Token:', token);
  const [rankingData, setRankingData] = useState([]);

  useEffect(() => {
    fetchRankingData();
  }, []);

  const fetchRankingData = async () => {
    try {
      const response = await axios.get('http://192.168.79.96:4000/ranking',{headers: {
        'Authorization': `${token}`
      }});
      setRankingData(response.data);
    } catch (error) {
      console.error('Error fetching ranking data:', error);
    }
  };

  return (
    <ImageBackground source={require('../assets/guerra.jpg')} style={styles.background}>
      <ScrollView vertical={true} contentContainerStyle={styles.container}>
        <View style={[styles.table, { minWidth: '60%' }]}>
          <View style={styles.tableHeader}>
            <Text style={[styles.headerText, { flex: 1 }]}>Rank</Text>
            <Text style={[styles.headerText, { flex: 3 }]}>Player</Text>
            <Text style={[styles.headerText, { flex: 1 }]}>Pts</Text>
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
  },
  tableHeader: {
    flexDirection: 'row',
    backgroundColor: '#4CAF50',
    padding: 10,
  },
  headerText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: 'white',
    textAlign: 'center',
  },
  tableRow: {
    flexDirection: 'row',
    backgroundColor: '#ffffff',
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#4CAF50',
  },
  rank: {
    fontSize: 16,
    textAlign: 'center',
  },
  playerName: {
    fontSize: 16,
    textAlign: 'center',
  },
  score: {
    fontSize: 16,
    textAlign: 'center',
  },
});

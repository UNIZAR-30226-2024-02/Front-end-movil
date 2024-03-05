import React from 'react';
import { ScrollView, Text, StyleSheet, ImageBackground, View } from 'react-native';

export default function Ranking() {
  // Sample ranking data
  const rankingData = [
    { rank: 1, name: 'Player 1', score: 100 },
    { rank: 2, name: 'Player 2', score: 90 },
    { rank: 3, name: 'Player 3', score: 80 },
    { rank: 4, name: 'Player 4', score: 70 },
    { rank: 5, name: 'Player 5', score: 60 },
    { rank: 6, name: 'Player 6', score: 50 },
    { rank: 7, name: 'Player 7', score: 40 },
    { rank: 8, name: 'Player 8', score: 30 },
    { rank: 9, name: 'Player 9', score: 20 },
    { rank: 10, name: 'Player 10', score: 10 },
    // Add more ranking data as needed
  ];

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
              <Text style={[styles.rank, { flex: 1 }]}>{player.rank}</Text>
              <Text style={[styles.playerName, { flex: 3 }]}>{player.name}</Text>
              <Text style={[styles.score, { flex: 1 }]}>{player.score}</Text>
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

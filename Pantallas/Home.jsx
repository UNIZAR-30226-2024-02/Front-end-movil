import * as React from 'react';
import { View, Text, Button, StyleSheet, ImageBackground } from 'react-native'; // Import ImageBackground
import { useNavigation } from '@react-navigation/native';

export default function Home() {
  const navigation = useNavigation();

  const goToLogin = () => {
    navigation.navigate('Login');
  };

  const goToRegister = () => {
    navigation.navigate('Register');
  };

  return (
    <ImageBackground source={require('../assets/guerra.jpg')} style={styles.backgroundImage}>
      <View style={styles.container}>
        <Text>Home Screen</Text>
        <Button
          title="Go to Login"
          onPress={goToLogin}
        />
        <Button
          title="Go to Register"
          onPress={goToRegister}
        />
      </View>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  backgroundImage: {
    flex: 1,
    resizeMode: 'cover',
    justifyContent: 'center',
  },
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
});

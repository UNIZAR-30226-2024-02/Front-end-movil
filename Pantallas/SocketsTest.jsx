import React, { useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView, Dimensions } from 'react-native';
import io from 'socket.io-client';
import { IP } from '../config';

const windowWidth = Dimensions.get('window').width;

const SocketsTest = () => {

    // Connect to the server socket
    const socket = io(IP); // Update the URL with your server URL

    // Event listeners
    useEffect(() => {
        socket.on('connect', () => {
            console.log('Connected to server socket');
        });

        socket.on('disconnect', () => {
            console.log('Disconnected from server socket');
        });

        // Clean up on component unmount
        return () => {
            socket.disconnect();
        };
    }, []); // empty dependency array ensures this effect runs only once

    // Define functions that need access to the 'socket' variable
    const joinGame = (gameId) => {
        // Emit the joinGame event to the server
        socket.emit('joinGame', gameId);
        console.log(`Joined game ${gameId}`);
    };

    const sendFriendRequest = (userId, message) => {
        // Emit the sendFriendRequest event to the server
        socket.emit('sendFriendRequest', { userId, message });
        console.log(`Sent friend request to ${userId} with message: ${message}`);
    };

    const exitGame = (gameId) => {
        // Emit the exitGame event to the server
        socket.emit('exitGame', gameId);
        console.log(`Exited game ${gameId}`);
    };

    const login = (username) => {
        // Emit the login event to the server
        socket.emit('login', username);
        console.log(`Logged in as ${username}`);
    };

    const logout = (username) => {
        // Emit the logout event to the server
        socket.emit('logout', username);
        console.log(`Logged out as ${username}`);
    };

    return (
        <View style={styles.container}>
            <ScrollView contentContainerStyle={styles.scrollViewContainer}>
                <View style={styles.buttonContainer}>
                    <TouchableOpacity style={styles.button} onPress={() => joinGame('game123')}>
                        <Text style={styles.buttonText}>Join Game123</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.button} onPress={() => joinGame('caballo')}>
                        <Text style={styles.buttonText}>Join Caballo</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.button} onPress={() => sendFriendRequest('user456', 'Hello!')}>
                        <Text style={styles.buttonText}>Send Friend Request</Text>
                    </TouchableOpacity>
                </View>
                <View style={styles.buttonContainer}>
                    <TouchableOpacity style={styles.button} onPress={() => exitGame('game123')}>
                        <Text style={styles.buttonText}>Exit Game123</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.button} onPress={() => exitGame('caballo')}>
                        <Text style={styles.buttonText}>Exit Caballo</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.button} onPress={() => login('perro_Sanxe')}>
                        <Text style={styles.buttonText}>Login perro_Sanxe</Text>
                    </TouchableOpacity>
                </View>
                <View style={styles.buttonContainer}>
                    <TouchableOpacity style={styles.button} onPress={() => login('pigdemon')}>
                        <Text style={styles.buttonText}>Login pigdemon</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.button} onPress={() => logout('perro_Sanxe')}>
                        <Text style={styles.buttonText}>Logout perro_Sanxe</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.button} onPress={() => logout('pigdemon')}>
                        <Text style={styles.buttonText}>Logout pigdemon</Text>
                    </TouchableOpacity>
                </View>
                {/* Add more buttonContainers if needed */}
            </ScrollView>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        flexDirection: 'row', // Ensure landscape orientation
        justifyContent: 'center',
        alignItems: 'center',
    },
    scrollViewContainer: {
        alignItems: 'center',
    },
    buttonContainer: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        marginVertical: 10,
        width: windowWidth, // Make each button container take full width
    },
    button: {
        backgroundColor: '#007bff',
        padding: 10,
        borderRadius: 5,
    },
    buttonText: {
        color: '#ffffff',
        fontWeight: 'bold',
    },
});

export default SocketsTest;

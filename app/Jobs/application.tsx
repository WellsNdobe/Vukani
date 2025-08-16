import React from 'react';
import { StyleSheet, Text, View } from 'react-native';

const Application = () => (
    <View style={styles.container}>
        <Text style={styles.text}>Welcome to the Application screen!</Text>
    </View>
);

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#fff',
    },
    text: {
        fontSize: 18,
        color: '#333',
    },
});

export default Application;
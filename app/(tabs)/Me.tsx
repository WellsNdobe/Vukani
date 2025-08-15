import React from 'react';
import { StyleSheet, Text, View } from 'react-native';

const Me = () => {
    return (
        <View style={styles.container}>
            <Text style={styles.title}>This is my profile page</Text>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#fff',
    },
    title: {
        fontSize: 20,
        fontWeight: 'bold',
    },
});

export default Me;
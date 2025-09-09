import React from 'react';
import { StyleSheet, Text, View } from 'react-native';

const Jobs = () => (
    <View style={styles.container}>
        <Text style={styles.text}>this is a jobs page</Text>
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
        fontSize: 20,
    },
});

export default Jobs;
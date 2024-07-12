import React, { useEffect, useRef, useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Animated, Dimensions } from 'react-native';
import useLocation from '../hooks/useLocation';
import { base_url } from '../utils/constants';
import io from 'socket.io-client';

const HomeScreen = () => {
  const scrollText = useRef(new Animated.Value(0)).current;
  const windowWidth = Dimensions.get('window').width;

  const { location: myLocation, error } = useLocation();
  const [socket, setSocket] = useState(null);

  useEffect(() => {
    const socketInstance = io(base_url); // Replace with your Socket.IO server URL
    console.log(socketInstance)
    setSocket(socketInstance);

    return () => {
      socketInstance.disconnect();
    };
  }, []);

  useEffect(() => {
    if (socket && myLocation) {
      socket.emit('location', { latitude: myLocation.latitude, longitude: myLocation.longitude });

      socket.on('locationUpdate', (data) => {
        console.log('Location update from server:', data);
      });
    }

    return () => {
      if (socket) {
        socket.off('locationUpdate');
      }
    };
  }, [socket, myLocation]);

  useEffect(() => {
    Animated.loop(
      Animated.timing(scrollText, {
        toValue: 1,
        duration: 10000,
        useNativeDriver: true
      })
    ).start();
  }, [scrollText]);

  const translateX = scrollText.interpolate({
    inputRange: [0, 1],
    outputRange: [windowWidth, -windowWidth]
  });

  return (
    <View style={styles.container}>
      <Animated.Text style={[styles.marqueeText, { transform: [{ translateX }] }]}>
        Disclaimer! You are subjected to arrest if you raise a false alarm!
      </Animated.Text>

      {error && <Text style={styles.errorText}>{error}</Text>}
      {myLocation ? (
        <View style={styles.locationContainer}>
          <Text>Latitude: {myLocation.latitude}</Text>
          <Text>Longitude: {myLocation.longitude}</Text>
        </View>
      ) : (
        <Text>Loading location...</Text>
      )}

      <TouchableOpacity style={styles.btn}>
        <Text style={styles.btnText}>Alarm Police</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.btn}>
        <Text style={styles.btnText}>Alarm Nearest Hospital</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  btn: {
    width: '80%',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#333',
    padding: 10,
    borderRadius: 10,
    marginBottom: 10,
  },
  btnText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  marqueeText: {
    position: 'absolute',
    top: 50,
    width: '100%',
    textAlign: 'center',
    fontSize: 16,
    fontWeight: 'bold',
  },
  locationContainer: {
    marginVertical: 20,
  },
  errorText: {
    color: 'red',
  },
});

export default HomeScreen;

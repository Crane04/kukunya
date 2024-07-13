import React, { useEffect, useRef, useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Animated, Dimensions, Alert } from 'react-native';
import useLocation from '../hooks/useLocation';
import { base_url } from '../utils/constants';
import io from 'socket.io-client';

const HomeScreen = () => {
  const scrollText = useRef(new Animated.Value(0)).current;
  const windowWidth = Dimensions.get('window').width;

  const { location: myLocation, error } = useLocation();
  const [socket, setSocket] = useState(null);
  const [confirmationMessage, setConfirmationMessage] = useState('');

  useEffect(() => {
    const socketInstance = io(base_url, {
      reconnection: true,
      reconnectionAttempts: Infinity,
      reconnectionDelay: 1000,
      reconnectionDelayMax: 5000,
      timeout: 20000,
    });

    setSocket(socketInstance);

    socketInstance.on('connect', () => {
      console.log('Connected to Socket.IO server');
    });

    socketInstance.on('disconnect', (reason) => {
      console.log('Disconnected from Socket.IO server:', reason);
      if (reason === 'io server disconnect') {
        console.log('Attempting to reconnect to the Socket.IO server...');
        socketInstance.connect();
      }
    });

    socketInstance.on('reconnect', (attemptNumber) => {
      console.log('Reconnected to Socket.IO server after', attemptNumber, 'attempts');
    });

    socketInstance.on('connect_error', (error) => {
      console.error('Error connecting to Socket.IO server:', error);
    });

    return () => {
      console.log('Disconnecting from Socket.IO server...');
      socketInstance.disconnect();
    };
  }, []);

  const Alarm = (type) => {
    if (socket && myLocation) {
      Alert.alert(
        'Confirmation',
        `Are you sure you want to send a ${type} alarm?`,
        [
          {
            text: 'Cancel',
            onPress: () => console.log(`${type} alarm canceled`),
            style: 'cancel',
          },
          {
            text: 'OK',
            onPress: () => {
              console.log(`Sending ${type} alarm with location:`, myLocation);
              socket.emit("sendLocation", {
                latitude: myLocation.latitude,
                longitude: myLocation.longitude,
                type: type
              });
              setConfirmationMessage(
                type === 'police'
                  ? 'Nearest Police Station has been notified!'
                  : 'Nearest Hospital has been notified!'
              );
            },
          },
        ],
        { cancelable: false }
      );
    } else {
      console.log('Socket or location not available');
    }
  };

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
        <Text>Getting Your Location...</Text>
      )}

      <TouchableOpacity style={styles.btn} onPress={() => { Alarm("police") }}>
        <Text style={styles.btnText}>Alarm Police</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.btn} onPress={() => { Alarm("hospital") }}>
        <Text style={styles.btnText}>Alarm Nearest Hospital</Text>
      </TouchableOpacity>

      {confirmationMessage ? (
        <View style={styles.confirmationContainer}>
          <Text style={styles.confirmationText}>{confirmationMessage}</Text>
        </View>
      ) : null}
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
  confirmationContainer: {
    marginTop: 20,
    padding: 10,
    backgroundColor: '#dff0d8',
    borderRadius: 5,
  },
  confirmationText: {
    color: '#3c763d',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default HomeScreen;

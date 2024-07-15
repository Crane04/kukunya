import React, { useEffect, useRef, useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Animated, Dimensions, Alert } from 'react-native';
import useLocation from '../hooks/useLocation';
import { base_url } from '../utils/constants';
import io from 'socket.io-client';
import AsyncStorage from '@react-native-async-storage/async-storage'; // Import AsyncStorage
import { useNavigation } from '@react-navigation/native';
import postData from '../helpers/postData';

const HomeScreen = () => {
  const scrollText = useRef(new Animated.Value(0)).current;
  const windowWidth = Dimensions.get('window').width;

  const { location: myLocation, error } = useLocation();
  const [socket, setSocket] = useState(null);
  const [confirmationMessage, setConfirmationMessage] = useState('');
  const [userData, setUserData] = useState(null);
  const navigation = useNavigation();

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const user = await AsyncStorage.getItem('userDetails');
        if (user) {
          setUserData(JSON.parse(user));
        } else {
          navigation.navigate('Login'); // Navigate to login if no user data
        }
      } catch (error) {
        console.error('Failed to fetch user data:', error);
        navigation.navigate('Login');
      }
    };

    fetchUserData();
  }, [navigation]);

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

    socketInstance.on('helpOnTheWay', () => {
      setConfirmationMessage('Help is coming!');
    });

    return () => {
      console.log('Disconnecting from Socket.IO server...');
      socketInstance.disconnect();
    };
  }, []);

  const Alarm = (type) => {
    if (socket && myLocation) {
      const socketId = socket.id;
      
      Alert.alert(
        'Confirmation',
        `Are you sure you want to send a ${type} alarm?`,
        [
          {
            text: 'Cancel',
            style: 'cancel',
          },
          {
            text: 'OK',
            onPress: async () => {
              console.log(`Attempting to create issue with location:`, myLocation);
              
              try {
                const response = await postData('/issues', {
                  location: {
                    latitude: myLocation.latitude,
                    longitude: myLocation.longitude
                  },
                  type: type,
                  user: socketId
                }, userData?.token);
  
                if(!response._id){                
                  setConfirmationMessage('Failed to notify the authorities. Please try again.');
                  return
                }
  
                // Emit the location data only if the issue is created successfully
                socket.emit("sendLocation", {
                  latitude: myLocation.latitude,
                  longitude: myLocation.longitude,
                  type: type,
                  user: socketId // Send the socket ID
                });
  
                setConfirmationMessage(
                  type === 'station'
                    ? 'Nearest Police Station has been notified!'
                    : 'Nearest Hospital has been notified!'
                );
              } catch (error) {
                console.error('Error creating issue:', error);
                setConfirmationMessage('Failed to notify the authorities. Please try again.');
              }
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

  if (!userData) {
    return (
      <View style={styles.loadingContainer}>
        <Text>Loading...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Animated.Text style={[styles.marqueeText, { transform: [{ translateX }] }]}>
        Disclaimer! You are subjected to arrest if you raise a false alarm!
      </Animated.Text>

      {error && <Text style={styles.errorText}>{error}</Text>}
      {myLocation ? (
        <View style={styles.locationContainer}>
          {/* <Text>Latitude: {myLocation.latitude}</Text>
          <Text>Longitude: {myLocation.longitude}</Text> */}
        </View>
      ) : (
        <Text>Getting Your Location...</Text>
      )}

      <Text style={styles.loggedInText}>Logged in as: {userData?.user?.first_name}</Text>

      <TouchableOpacity style={styles.btn} onPress={() => { Alarm("station") }}>
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
  loadingContainer: {
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
  loggedInText: {
    marginBottom: 20,
    fontSize: 16,
    fontWeight: 'bold',
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

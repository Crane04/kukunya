import React, { useEffect, useRef, useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Animated, Dimensions, PermissionsAndroid, Platform, Alert } from 'react-native';
import Geolocation from 'react-native-geolocation-service';
import axios from 'axios';

const HomeScreen = () => {
  const scrollText = useRef(new Animated.Value(0)).current;
  const windowWidth = Dimensions.get('window').width;

  const [location, setLocation] = useState(null);
  const [places, setPlaces] = useState([]);

  useEffect(() => {
    Animated.loop(
      Animated.timing(scrollText, {
        toValue: 1,
        duration: 10000,
        useNativeDriver: true
      })
    ).start();
  }, [scrollText]);

  useEffect(() => {
    const requestLocationPermission = async () => {
      if (Platform.OS === 'android') {
        const granted = await PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
          {
            title: 'Location Permission',
            message: 'App needs access to your location',
          }
        );
        if (granted === PermissionsAndroid.RESULTS.GRANTED) {
          getCurrentLocation();
        } else {
          console.log('Location permission denied');
        }
      } else {
        getCurrentLocation();
      }
    };

    const getCurrentLocation = () => {
      Geolocation.getCurrentPosition(
        (position) => {
          setLocation({
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
          });
        },
        (error) => {
          console.log(error);
        },
        { enableHighAccuracy: true, timeout: 15000, maximumAge: 10000 }
      );
    };

    requestLocationPermission();
  }, []);

  const getNearbyPlaces = async (type) => {
    if (!location) {
      Alert.alert('Location not available', 'Unable to fetch location.');
      return;
    }

    const apiKey = 'YOUR_GOOGLE_API_KEY';  // Replace with your actual API key
    const url = `https://maps.googleapis.com/maps/api/place/nearbysearch/json?location=${location.latitude},${location.longitude}&radius=1500&type=${type}&key=${apiKey}`;

    try {
      const response = await axios.get(url);
      setPlaces(response.data.results);
      console.log(response.data.results);
    } catch (error) {
      console.error(error);
      Alert.alert('Error', 'Failed to fetch nearby places.');
    }
  };

  const translateX = scrollText.interpolate({
    inputRange: [0, 1],
    outputRange: [windowWidth, -windowWidth]
  });

  return (
    <View style={styles.container}>
      <Animated.Text style={[styles.marqueeText, { transform: [{ translateX }] }]}>
        Disclaimer! You are subjected to arrest if you raise a false alarm!
      </Animated.Text>
      <TouchableOpacity style={styles.btn} onPress={() => getNearbyPlaces('police')}>
        <Text style={styles.btnText}>Alarm Police</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.btn} onPress={() => getNearbyPlaces('hospital')}>
        <Text style={styles.btnText}>Alarm Nearest Hospital</Text>
      </TouchableOpacity>

      {places.length > 0 && (
        <View style={styles.placesContainer}>
          {places.map((place) => (
            <Text key={place.place_id} style={styles.placeText}>{place.name}</Text>
          ))}
        </View>
      )}
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
  placesContainer: {
    marginTop: 20,
    width: '80%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  placeText: {
    fontSize: 16,
    fontWeight: 'bold',
    marginVertical: 5,
  },
});

export default HomeScreen;

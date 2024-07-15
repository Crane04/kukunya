import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, FlatList } from 'react-native';
import getData from '../helpers/getData'; // Adjust the path as needed
import AsyncStorage from '@react-native-async-storage/async-storage';
import moment from 'moment'; // Use moment.js for formatting dates

const getLocationFromCoordinates = async (latitude, longitude) => {
  try {
    const apiKey = 'YOUR_GOOGLE_MAPS_API_KEY'; // Replace with your API key
    const response = await fetch(
      `https://maps.googleapis.com/maps/api/geocode/json?latlng=${latitude},${longitude}&key=${apiKey}`
    );

    if (!response.ok) {
      throw new Error('Network response was not ok');
    }

    const data = await response.json();

    if (data.results && data.results.length > 0) {
      return data.results[0].formatted_address;
    } else {
      return 'Unknown location';
    }
  } catch (error) {
    console.error('Error fetching location:', error);
    return 'Unknown location';
  }
};

const formatCondition = (condition) => {
    switch (condition) {
      case 'attendedTo':
        return 'Attended To';
      case 'attendingTo':
        return 'Attending To';
      case 'unattendedTo':
        return 'Unattended To';
      default:
        return condition; // fallback in case new values are added
    }
  };
const Issues = () => {
  const [issues, setIssues] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchIssues = async () => {
      try {
        const userData = await AsyncStorage.getItem('userDetails'); // Fetch the user details from AsyncStorage
        const parsedData = JSON.parse(userData); // Parse the JSON string
        const token = parsedData.token; // Extract the token from the parsed data
        const response = await getData('/issues', token); // Pass the token to the helper function
        setIssues(response);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchIssues();
  }, []);

  if (loading) {
    return (
      <View style={styles.container}>
        <Text>Loading...</Text>
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.container}>
        <Text>Error: {error}</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <FlatList
        data={issues}
        keyExtractor={(item) => item._id}
        renderItem={({ item, index }) => (
          <View style={styles.issueItem}>
            <Text style={styles.issueText}>Condition: {formatCondition(item.condition)}</Text>
            <Text style={styles.issueText}>Type of Issue: {item.type}</Text>
            <Text style={styles.issueText}>Time: {moment(item.time).format('MMMM Do YYYY, h:mm:ss a')}</Text>
            <Text style={styles.issueText}>Location: Lat {item.location.latitude}, Lon {item.location.longitude}</Text>
          </View>
        )}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  issueItem: {
    marginBottom: 16,
    padding: 16,
    backgroundColor: '#333',
    borderRadius: 8,
  },
  issueText: {
    fontSize: 16,
    color:"#fff"
  },
});

export default Issues;

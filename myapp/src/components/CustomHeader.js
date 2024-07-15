// CustomHeader.js
import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, SafeAreaView } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons'; // Make sure you have react-native-vector-icons installed
import { useNavigation } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';  // Import AsyncStorage

const CustomHeader = ({title}) => {
  const navigation = useNavigation(); // Use navigation

  const Logout = async () => {
    await AsyncStorage.removeItem('userDetails');
    navigation.navigate('Login');
  };

  return (
    <SafeAreaView style={styles.headerContainer}>
      <Text style={styles.headerTitle}>Kukunya</Text>
      {
        (title != "Login" && title != "Onboarding") && (
        <TouchableOpacity onPress={Logout} style={styles.logout}>
            <Icon name="log-out-outline" size={30} color="#fff" />
          </TouchableOpacity>
        )
      }

    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  headerContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 10,
    backgroundColor: '#333',
    height: 120,
  },
  headerTitle: {
    fontSize: 25,
    fontWeight: 'bold',
    color: '#fff',
    marginLeft: 15,
  },
  logout: {
    marginRight: 15,
  },
});

export default CustomHeader;

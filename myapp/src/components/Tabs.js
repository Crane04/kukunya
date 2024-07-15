import React from 'react';
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import Home from '../screens/Home';
import Map from '../screens/Map';
import Entypo from "@expo/vector-icons/Entypo";
import { View, Text, StyleSheet } from 'react-native';
import { FontAwesome } from '@expo/vector-icons';

const Tab = createBottomTabNavigator();

const Tabs = () => {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false, // Hide header for all tab screens
        tabBarActiveTintColor: "crimson",
        tabBarInactiveTintColor: "white",
        tabBarStyle: {
          backgroundColor: "black",
          height: 80
        },
        tabBarLabelStyle: {
          display: "none",
        },
      })}
    >
      <Tab.Screen 
        name="Home" 
        component={Home} 
        options={{
          tabBarIcon: ({ focused }) => (
            <View style={[styles.iconContainer, focused && styles.iconContainerActive]}>
              <Entypo name="home" size={24} color={"#fff"}  />
              {focused && <Text style={styles.iconLabel}>Home</Text>}
            </View>
          ),
        }} 
      />
      <Tab.Screen 
        name="Map" 
        component={Map} 
        options={{
          tabBarIcon: ({ focused }) => (
            <View style={[styles.iconContainer, focused && styles.iconContainerActive]}>
              <FontAwesome name="map-marker" size={24} color="#fff" />
              {focused && <Text style={styles.iconLabel}>Map</Text>}
            </View>
          ),
        }} 
      />
    </Tab.Navigator>
  );
};

const styles = StyleSheet.create({
  iconContainer: {
    flexDirection: "row",
    alignItems: "center",
    padding: 10,
    borderRadius: 20,
    borderColor: "transparent",
    borderWidth: 2,
  },
  iconContainerActive: {
    backgroundColor: "#800020",
    borderColor: "#800020",
  },
  iconLabel: {
    color: "#fff",
    marginLeft: 8,
    fontFamily: "Grandstander_700Bold"
  },
});

export default Tabs;

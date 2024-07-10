import React, { useEffect, useRef } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Animated, Dimensions } from 'react-native';

const HomeScreen = () => {
  const scrollText = useRef(new Animated.Value(0)).current;
  const windowWidth = Dimensions.get('window').width;

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
});

export default HomeScreen;

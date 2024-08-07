// screens/LoginScreen.js
import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, KeyboardAvoidingView, Platform, ScrollView, ActivityIndicator, Alert } from 'react-native';
import { useForm, Controller } from 'react-hook-form';
import { useNavigation } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';  // Import AsyncStorage
import apiRequest from '../helpers/postData';  // Adjust the path as necessary

const LoginScreen = () => {
  const { control, handleSubmit, formState: { errors } } = useForm();
  const navigation = useNavigation();
  const [loading, setLoading] = useState(false);

  const onSubmit = async data => {
    setLoading(true);
    try {
      const response = await apiRequest('/auth/user/signin', data);
      console.log(response);
      setLoading(false);
      if (response?.user) {
        console.log("Successful");

        // Save user details to AsyncStorage
        await AsyncStorage.setItem('userDetails', JSON.stringify(response));

        Alert.alert('Success', 'Sign In successful!', [{ text: 'OK', onPress: () => navigation.navigate('Tabs') }]);
      } else {
        Alert.alert('Error', response["message"]);
      }
    } catch (error) {
      console.error("Signup request failed: ", error);
      setLoading(false);
      Alert.alert('Error', error.message);  // Corrected to display error.message
    }
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={styles.container}
    >
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <Text style={styles.title}>Login</Text>
        <Controller
          control={control}
          rules={{ required: 'Email is required' }}
          render={({ field: { onChange, onBlur, value } }) => (
            <TextInput
              style={styles.input}
              onBlur={onBlur}
              onChangeText={onChange}
              value={value}
              placeholder="Email"
              keyboardType="email-address"
            />
          )}
          name="email"
          defaultValue=""
        />
        {errors.email && <Text style={styles.error}>{errors.email.message}</Text>}

        <Controller
          control={control}
          rules={{ required: 'Password is required' }}
          render={({ field: { onChange, onBlur, value } }) => (
            <TextInput
              style={styles.input}
              onBlur={onBlur}
              onChangeText={onChange}
              value={value}
              placeholder="Password"
              secureTextEntry
            />
          )}
          name="password"
          defaultValue=""
        />
        {errors.password && <Text style={styles.error}>{errors.password.message}</Text>}

        <TouchableOpacity style={styles.button} onPress={handleSubmit(onSubmit)} disabled={loading}>
          {loading ? <ActivityIndicator size="small" color="#fff" /> : <Text style={styles.buttonText}>Submit</Text>}
        </TouchableOpacity>

        <TouchableOpacity style={styles.onboardingButton} onPress={() => navigation.navigate('Onboarding')}>
          <Text style={styles.onboardingButtonText}>Don't have an account? Sign Up</Text>
        </TouchableOpacity>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContainer: {
    flexGrow: 1,
    justifyContent: 'center',
    padding: 16,
  },
  title: {
    fontSize: 24,
    marginBottom: 16,
    textAlign: 'center',
  },
  input: {
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    marginBottom: 12,
    paddingHorizontal: 8,
  },
  error: {
    color: 'red',
    marginBottom: 8,
  },
  button: {
    backgroundColor: '#007BFF',
    padding: 10,
    alignItems: 'center',
    borderRadius: 5,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
  },
  onboardingButton: {
    marginTop: 20,
    alignItems: 'center',
  },
  onboardingButtonText: {
    color: '#007BFF',
    fontSize: 16,
    textDecorationLine: 'underline',
  },
});

export default LoginScreen;

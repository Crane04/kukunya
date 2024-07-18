import AsyncStorage from '@react-native-async-storage/async-storage';

export const getUser = async () => {
  try {
    const user = await AsyncStorage.getItem('userDetails');
    return user ? JSON.parse(user) : null;
  } catch (error) {
    console.error('Failed to fetch user data:', error);
    return null;
  }
};

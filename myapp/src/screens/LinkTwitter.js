import React from 'react';
import { View, Button, AsyncStorage } from 'react-native';
import { RNTwitterSignIn } from 'react-native-twitter-signin';
import { TWITTER_API_KEY, TWITTER_API_SECRET_KEY } from '../utils/social/twitter/config';

RNTwitterSignIn.init(TWITTER_API_KEY, TWITTER_API_SECRET_KEY);

const LinkTwitterAccount = () => {
  const twitterLogin = async () => {
    try {
      const loginData = await RNTwitterSignIn.logIn();
      console.log(loginData);

      const { authToken, authTokenSecret, userID } = loginData;
      // Save tokens securely, example using AsyncStorage
      await AsyncStorage.setItem('twitterAuthToken', authToken);
      await AsyncStorage.setItem('twitterAuthTokenSecret', authTokenSecret);
      alert('Twitter account linked successfully!');
    } catch (error) {
      console.log(error);
      alert('Failed to link Twitter account');
    }
  };

  return (
    <View>
      <Button title="Link Twitter Account" onPress={twitterLogin} />
    </View>
  );
};

export default LinkTwitterAccount;

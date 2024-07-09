import React from 'react';
import { View, Button, AsyncStorage } from 'react-native';
import axios from 'axios';
import OAuth from 'oauth-1.0a';
import CryptoJS from 'crypto-js';
import {
  TWITTER_API_KEY,
  TWITTER_API_SECRET_KEY,
} from '../utils/social/twitter/config';

const postTweet = async (status) => {
  try {
    const authToken = await AsyncStorage.getItem('twitterAuthToken');
    const authTokenSecret = await AsyncStorage.getItem('twitterAuthTokenSecret');

    const url = 'https://api.twitter.com/1.1/statuses/update.json';
    const params = { status };
    
    const oauth = OAuth({
      consumer: {
        key: TWITTER_API_KEY,
        secret: TWITTER_API_SECRET_KEY,
      },
      signature_method: 'HMAC-SHA1',
      hash_function(base_string, key) {
        return CryptoJS.HmacSHA1(base_string, key).toString(CryptoJS.enc.Base64);
      },
    });

    const request_data = {
      url,
      method: 'POST',
      data: params,
    };

    const token_data = {
      key: authToken,
      secret: authTokenSecret,
    };

    const authHeader = oauth.toHeader(oauth.authorize(request_data, token_data)).Authorization;

    await axios.post(url, null, {
      params,
      headers: {
        Authorization: authHeader,
      },
    });

    alert('Tweet posted successfully!');
  } catch (error) {
    console.log('Error posting tweet:', error);
    alert('Failed to post tweet');
  }
};

const DangerButton = () => {
  const handlePress = () => {
    postTweet('Help! I am in danger!');
  };

  return (
    <View>
      <Button title="Send Danger Alert" onPress={handlePress} />
    </View>
  );
};

export default DangerButton;

// App.js
import * as React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import OnboardingScreen from './screens/OnboardingScreen'; // Adjust the path as needed

const Stack = createStackNavigator();

const App = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Onboarding">
        <Stack.Screen name="Onboarding" component={OnboardingScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default App;

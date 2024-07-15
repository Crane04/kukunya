// App.js
import * as React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import Onboarding from './src/screens/Onboarding';
import Home from './src/screens/Home';
import Login from './src/screens/Login';
import Map from './src/screens/Map';
import Tabs from "./src/components/Tabs"
import CustomHeader from "./src/components/CustomHeader"

const Stack = createStackNavigator();

const App = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator
          initialRouteName="Tabs"
          screenOptions={({ route, options }) => ({
            
            gestureEnabled: false,
            header: () => (
              <CustomHeader
                title={route.name}
                options = {route}
              />
            ),
          })}
      >
        <Stack.Screen name="Onboarding" component={Onboarding} />
        <Stack.Screen name="Home" component={Home} />
        <Stack.Screen name="Login" component={Login} />
        <Stack.Screen name="Map" component={Map} />
        <Stack.Screen name="Tabs" component={Tabs} />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default App;

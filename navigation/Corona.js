import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';

import Home from "../screens/Home";
import Detail from "../screens/Detail";
import Splash from "../screens/Splash";

//import tema
import * as theme from '../Theme';

const Stack = createStackNavigator();

function Corona(route) {
  return (
    <NavigationContainer>
      <Stack.Navigator
        screenOptions={{
          gestureEnabled: true
        }}
        initialRouteName="Splash"
        headerMode="screen"
        screenOptions={{
            headerTintColor : 'white',
            headerStyle : {
                backgroundColor: theme.colors.background_secondary
            },
        }}
      >
        <Stack.Screen 
            name="Home" 
            component={Home} 
            screenOptions="default" 
            options={{
                title: 'Covid-19',
                headerTitleAlign: 'center',
                headerTitleStyle: {
                  fontWeight: 'bold',
                },
                headerLeft: null,
            }}
            />

        <Stack.Screen 
          name="Detail" 
          component={Detail} 
          options={({ route }) => ({
            title: route.params.pilneg,
            headerTitleStyle: {
              fontWeight: 'bold',
            },
            headerTitleAlign: 'center'
          })}
          />

        <Stack.Screen 
          name="Splash" 
          component={Splash} 
          header = {null}
          headerMode = "none"
          options={({ route }) => ({
            title: '',
            headerStyle:{
              backgroundColor: theme.colors.background
            }
          })}
          />

      </Stack.Navigator>
    </NavigationContainer>
  );
}

export default Corona;

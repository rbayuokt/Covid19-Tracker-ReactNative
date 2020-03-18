import React , {Component} from 'react';
import { Asset } from 'expo-asset';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import Corona from './navigation/Corona';
import * as Font from 'expo-font';

export default class App extends React.Component {
  state = {
    fontLoaded: false,
  };

  async componentDidMount() {
    await Font.loadAsync({
      'poppins': require('./assets/fonts/Poppins-Regular.ttf'),
      'poppins-bold': require('./assets/fonts/Poppins-Bold.ttf'),
    });

    this.setState({ fontLoaded: true });
  }

  render() {
    return(
      this.state.fontLoaded ?
      <Corona/>
      : null
    )
  }

};
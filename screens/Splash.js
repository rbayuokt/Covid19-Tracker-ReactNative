import React, { Component } from 'react'
import { Text, StyleSheet, View, Animated, Image, Dimensions, ScrollView, TouchableOpacity , Button , TouchableHighlight } from 'react-native'
import { Dropdown } from 'react-native-material-dropdown';
import PTRView from 'react-native-pull-to-refresh';
import axios from 'axios';

//import tema
import * as theme from '../Theme';

const { width, height } = Dimensions.get('screen');

class Splash extends React.Component {

    performTimeConsumingTask = async() => {
        return new Promise((resolve) =>
          setTimeout(
            () => { resolve('result') },
            1500
          )
        )
      }

    async componentDidMount() {
        const data = await this.performTimeConsumingTask();

        if (data !== null) {
        this.props.navigation.navigate('Home');
        }
  }

    render(){

        return(
            <View style={styles.container}>
                <View style={styles.conSplash}>
                    <Image source={require('../assets/images/bacteria.png')} style={styles.icnErr} />
                    <Text style={styles.title}>Covid-19 Tracker</Text>
                    <Text style={styles.subTitle}>Made with ♥ @rbayuokt</Text>
                    <Text style={styles.subTitle}>in Cimahi</Text>
                </View>
            </View>
        )
    }
}


const styles = StyleSheet.create({
    container:{
        flex: 1,
        backgroundColor: theme.colors.background,
        
    },
    conSplash:{
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: -80
    },
    rapih:{
        marginLeft: theme.padding.kiri,
        marginRight: theme.padding.kanan,
        fontFamily: 'poppins',
        fontSize: 18
    },
    title:{
        fontSize: theme.ukuran.medium,
        color: theme.colors.putih,
        fontFamily: 'poppins-bold',
        opacity: 0.87,
        paddingLeft: theme.padding.kiri,
        paddingRight: theme.padding.kanan,
        marginTop: 25,
        marginBottom: 10,
        textAlign: 'center'
    },
    subTitle:{
        fontSize: theme.ukuran.kecil,
        color: theme.colors.putih,
        fontFamily: 'poppins',
        opacity: 0.87,
        paddingLeft: theme.padding.kiri,
        paddingRight: theme.padding.kanan,
        textAlign: 'center'
    },
    icnErr:{
        width: 150,
        height: 150,
    },
})

export default Splash;
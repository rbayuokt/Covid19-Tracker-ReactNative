import React, { Component } from 'react'
import { Text, StyleSheet, View, Animated, Image, Dimensions, ScrollView, TouchableOpacity ,BackHandler , ToastAndroid , TouchableHighlight} from 'react-native'
import PTRView from 'react-native-pull-to-refresh/index';
import moment from "moment";
import Loading from 'react-native-whc-loading'

import axios from 'axios';

//import tema
import * as theme from '../Theme';

const { width, height } = Dimensions.get('window');

const format = amount => {
    return Number(amount)
        .toFixed()
        .replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1.');
  };


class Provinsi extends React.Component{

    static navigationOptions = ({ route }) => ({
        title: `${route.pilneg}`,
         headerTitleStyle : {textAlign: 'center',alignSelf:'center'},
            headerStyle:{
                backgroundColor:'white',
            },
        });
        
    constructor(props){
        super(props);
        this.state = {
            data_provinsi: [],
            isError : false,
            isLoading : true,
        };
        
    }

    _refresh = () => {
        return new Promise((resolve) => {
            this.componentDidMount();
            setTimeout(()=>{resolve()}, 1000)
        });
    }

    componentDidMount(){
        //show loading        
        this.refs.loading.show(this.state.isLoading);

        //get all provinsi 
        axios.get('https://indonesia-covid-19.mathdro.id/api/provinsi')
        .then(res => {
            const prov = res.data.data;
            this.setState({
                data_provinsi : prov,
                isLoading : false
            });

            this.refs.loading.show(this.state.isLoading);
        })
    }

    renderDataProvinsi = () => {
        //get length
        var panjang_p = this.state.data_provinsi.length;

        return(
            <View style={{marginBottom:40}}>
                <View style={{flexDirection:'row',justifyContent:'space-between'}}>
                    <Text style={styles.title}>List Provinsi</Text>
                </View>

                {
                    this.state.data_provinsi.slice(0,panjang_p).map((prov) => {

                    return(
                        <View style={styles.kartuItem}>
                            <View style={{flexDirection: 'row' , justifyContent:'space-between'}}>
                                <Text style={styles.headerKartu}>{prov.provinsi}</Text>
                            </View>

                            <View style={{flexDirection: 'row' , justifyContent:'flex-start'}}>
                                <Text style={styles.textDescKuning}>Positif : {prov.kasusPosi}</Text>
                                <Text style={styles.textDescHijau}>Sembuh : {prov.kasusSemb}</Text>
                                <Text style={styles.textDescMerah}>Meninggal : {prov.kasusMeni}</Text>
                            </View>
                        </View>
                    )
                })
            }

            </View>
        )
    }


    render(){

        return(
            <PTRView onRefresh={this._refresh} style={styles.container}>
                <Loading ref="loading"/>
                <View style={{flex:1}}>
                    {this.renderDataProvinsi()}
                </View>
            </PTRView>
        )
    }
}

const styles = StyleSheet.create({
    container:{
        backgroundColor: theme.colors.background,
        flex: 1,
        flexDirection: 'column'
    },
    rapih:{
        height: height / 3.7,
        marginLeft: theme.padding.kiri,
        marginRight: theme.padding.kanan,
        fontFamily: 'poppins',
        fontSize: 18,
        backgroundColor: theme.colors.background_secondary
    },
    title:{
        fontSize: theme.ukuran.besar,
        color: theme.colors.putih,
        fontFamily: 'poppins-bold',
        opacity: 0.87,
        paddingLeft: theme.padding.kiri,
        paddingRight: theme.padding.kanan,
        marginTop: 25,
    },
    kartuItem:{
        marginTop: 10,
        backgroundColor: theme.colors.background_secondary,
        paddingTop: 18,
        paddingBottom: 18,
        paddingLeft: theme.padding.kiri,
        paddingRight: theme.padding.kanan,
        fontFamily: 'poppins'
    },
    headerKartu:{
        fontFamily: 'poppins-bold',
        fontSize: 16,
        color: theme.colors.putih,
        opacity: 0.87
    },
    statusPasienD:{
        color: theme.colors.biru,
        marginTop: 5,
        fontSize:12,
        fontFamily: 'poppins-bold'
    },
    textDesc:{
        marginTop: 10,
        color: theme.colors.putih
    },
    textDescKuning:{
        marginTop: 10,
        color: theme.colors.kuning,
        paddingRight: 20
    },
    textDescHijau:{
        marginTop: 10,
        color: theme.colors.hijau,
        paddingRight: 20
    },
    textDescMerah:{
        marginTop: 10,
        color: theme.colors.merah,
    },
    textDescBiru:{
        marginTop: 10,
        color: theme.colors.biru,
    }
});

export default Provinsi;
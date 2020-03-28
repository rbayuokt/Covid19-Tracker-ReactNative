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


class Harian extends React.Component{

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
            data_harian: [],
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

         //get all data harian
         axios.get('https://indonesia-covid-19.mathdro.id//api/harian')
         .then(res => {
             const harian = res.data.data;
             this.setState({
                 data_harian : harian, 
                 isLoading : false});

            this.refs.loading.show(this.state.isLoading);
        })
    }

    renderDataHarian = () => {
        var panjang_h = this.state.data_harian.length;

        return(
            <View style={{marginBottom:40}}>
                <View style={{flexDirection:'row',justifyContent:'space-between'}}>
                <Text style={styles.title}>Total</Text>
                <Text style={{color:'#fff',marginTop:35,marginRight:theme.padding.kanan}}>{panjang_h + " Hari"}</Text>
                </View>

                { 
                    this.state.data_harian.slice(0,panjang_h).reverse().map((hari) =>{
                        return(  
                            <View style={styles.kartuItem}>
                                <View style={{flexDirection: 'row' , justifyContent:'space-between'}}>
                                    <Text style={styles.headerKartu}>Hari ke {hari.harike}</Text>
                                </View>

                                <View style={{flexDirection: 'row' , justifyContent:'flex-start'}}>
                                    <View style={{paddingRight:30}}>
                                        <Text style={styles.textDescKuning}>Pasien Baru : { (hari.jumlahKasusBaruperHari != null) ? hari.jumlahKasusBaruperHari : '-' }</Text>
                                        <Text style={styles.textDescBiru}>Pasien Dirawat : { (hari.jumlahKasusDirawatperHari != null) ? hari.jumlahKasusDirawatperHari : '-' }</Text>
                                    </View>
                                    <View>
                                        <Text style={styles.textDescHijau}>Pasien Sembuh : { (hari.jumlahKasusSembuhperHari != null) ? hari.jumlahKasusSembuhperHari : '-'}</Text>
                                        <Text style={styles.textDescMerah}>Pasien Meninggal : { (hari.jumlahKasusMeninggalperHari != null) ? hari.jumlahKasusMeninggalperHari : '-'}</Text>
                                    </View>
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
                    {this.renderDataHarian()}
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

export default Harian;
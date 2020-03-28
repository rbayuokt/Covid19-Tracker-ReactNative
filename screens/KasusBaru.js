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


class KasusBaru extends React.Component{

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
            kasus_baru: [],
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

        //get all kasus
        axios.get('https://indonesia-covid-19.mathdro.id/api/kasus')
        .then(res=>{
            const data_kasus = res.data.data.nodes;
            this.setState({
                kasus_baru : data_kasus,
                isLoading : false
            });

            this.refs.loading.show(this.state.isLoading);
        })
    }

    renderStatus = (kasus) => {
        if(kasus.status == "Dalam Perawatan"){
            return <Text style={styles.statusPasienD}>{kasus.status}</Text>
        }else if(kasus.status == "Meninggal"){
            return <Text style={styles.statusPasienM}>{kasus.status}</Text>
        }else if(kasus.status == "Sembuh"){
            return <Text style={styles.statusPasienS}>{kasus.status}</Text>
        }
    }

    renderKasusBaru = () => {
        var panjang_k = this.state.kasus_baru.length;

        return(
            <View>
                <View style={{flexDirection:'row',justifyContent:'space-between'}}>
                    <Text style={styles.title}>Total Kasus</Text>
                    <Text style={{color:'#fff',marginTop:35,marginRight:theme.padding.kanan}}>{panjang_k + " Kasus"}</Text>
                </View>

                 {  
                    //get 3 last data
                    this.state.kasus_baru.slice(0,panjang_k).reverse().map((kasus)=>{
                    return(
                            <View style={styles.kartuItem}>
                                <View style={{flexDirection: 'row' , justifyContent:'space-between'}}>
                                    <Text style={styles.headerKartu}>{kasus.klaster}</Text>
                                    {this.renderStatus(kasus)}
                                </View>

                                <View style={{flexDirection: 'row' , justifyContent:'space-between'}}>
                                    <Text style={styles.textDesc}>Umur : {kasus.umur}</Text>
                                    <Text style={styles.textDesc}>Gender : {kasus.gender}</Text>
                                    <Text style={styles.textDesc}>{kasus.wn}</Text>
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
                    {this.renderKasusBaru()}
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
    statusPasienM:{
        color: theme.colors.merah,
        marginTop: 5,
        fontSize:12,
        fontFamily: 'poppins-bold'
    },
    statusPasienS:{
        color: theme.colors.hijau,
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

export default KasusBaru;
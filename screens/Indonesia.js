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


class Indonesia extends React.Component{

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
        //get all negara untuk dropdown
        axios.get('https://indonesia-covid-19.mathdro.id/api/kasus')
        .then(res=>{
            const data_kasus = res.data.nodes;

            this.setState({kasus_baru : data_kasus });
            console.log(this.state.kasus_baru)
        })
    }

    renderKasusBaru = () => {
        return(
            <View>
                <View style={{flexDirection:'row',justifyContent:'space-between'}}>
                    <Text style={styles.title}>Kasus Baru</Text>
                    <TouchableHighlight underlayColor='#1F746A' onPress={() => this.props.navigation.navigate('Indonesia')}>
                        <Text style={{color:'#fff',marginTop:35,marginRight:theme.padding.kanan}}>detail</Text>
                    </TouchableHighlight>
                </View>

                {/* { */}
                    {/* this.state.kasus_baru.map((kasus)=>{ */}
                    {/* return( */}
                            <View style={styles.kartuItem}>
                                <View style={{flexDirection: 'row' , justifyContent:'space-between'}}>
                                    <Text style={styles.headerKartu}>Jawa Tengah</Text>
                                    <Text style={styles.statusPasienD}>Dalam Perawatan</Text>
                                </View>

                                <View style={{flexDirection: 'row' , justifyContent:'space-between'}}>
                                    <Text style={styles.textDesc}>Umur : 37</Text>
                                    <Text style={styles.textDesc}>Gender : Perempuan</Text>
                                    <Text style={styles.textDesc}>WNI</Text>
                                </View>
                            </View>
                        {/* )
                    }) 
                } */}
                
                
            </View>
        )
    }

    renderDataProvinsi = () => {
        return(
            <View style={{marginTop:20}}>
                <View style={{flexDirection:'row',justifyContent:'space-between'}}>
                    <Text style={styles.title}>Data Provinsi</Text>
                    <TouchableHighlight underlayColor='#1F746A' onPress={() => this.props.navigation.navigate('Indonesia')}>
                        <Text style={{color:'#fff',marginTop:35,marginRight:theme.padding.kanan}}>detail</Text>
                    </TouchableHighlight>
                </View>

                <View style={styles.kartuItem}>
                    <View style={{flexDirection: 'row' , justifyContent:'space-between'}}>
                        <Text style={styles.headerKartu}>Provinsi DKI Jakarta</Text>
                    </View>

                    <View style={{flexDirection: 'row' , justifyContent:'flex-start'}}>
                        <Text style={styles.textDescKuning}>Positif : 353</Text>
                        <Text style={styles.textDescHijau}>Sembuh : 23</Text>
                        <Text style={styles.textDescMerah}>Meninggal : 29</Text>
                    </View>
                </View>
            </View>
        )
    }

    renderDataHarian = () => {
        return(
            <View style={{marginTop:20,marginBottom:40}}>
                <View style={{flexDirection:'row',justifyContent:'space-between'}}>
                    <Text style={styles.title}>Update Harian</Text>
                    <TouchableHighlight underlayColor='#1F746A' onPress={() => this.props.navigation.navigate('Indonesia')}>
                        <Text style={{color:'#fff',marginTop:35,marginRight:theme.padding.kanan}}>detail</Text>
                    </TouchableHighlight>
                </View>

                <View style={styles.kartuItem}>
                    <View style={{flexDirection: 'row' , justifyContent:'space-between'}}>
                        <Text style={styles.headerKartu}>Hari ke 22</Text>
                    </View>

                    <View style={{flexDirection: 'row' , justifyContent:'flex-start'}}>
                        <View style={{paddingRight:30}}>
                            <Text style={styles.textDescKuning}>Pasien Baru : 65</Text>
                            <Text style={styles.textDescBiru}>Pasien Dirawat : 500</Text>
                        </View>
                        <View>
                            <Text style={styles.textDescHijau}>Pasien Sembuh : 30</Text>
                            <Text style={styles.textDescMerah}>Pasien Meninggal : 49</Text>
                        </View>
                    </View>
                </View>
            </View>
        )
    }

    render(){

        return(
            <PTRView onRefresh={this._refresh} style={styles.container}>
                <View style={{flex:1}}>
                    {this.renderKasusBaru()}
                    {this.renderDataProvinsi()}
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
        fontSize: 18,
        color: theme.colors.putih
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

export default Indonesia;
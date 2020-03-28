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
            data_provinsi: [],
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

        //get all kasus
        axios.get('https://indonesia-covid-19.mathdro.id/api/kasus')
        .then(res=>{
            const data_kasus = res.data.data.nodes;
            this.setState({kasus_baru : data_kasus });
        })

        //get all provinsi 
        axios.get('https://indonesia-covid-19.mathdro.id/api/provinsi')
        .then(res => {
            const prov = res.data.data;
            this.setState({data_provinsi : prov});
        });

        //get all data harian
        axios.get('https://indonesia-covid-19.mathdro.id//api/harian')
        .then(res => {
            const harian = res.data.data;
            this.setState({data_harian : harian, isLoading : false});
            
            //remove loading
            this.refs.loading.show(this.state.isLoading);
        });

        
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
                    <Text style={styles.title}>Kasus Baru</Text>
                    <TouchableHighlight underlayColor='#1F746A' onPress={() => this.props.navigation.navigate('KasusBaru')}>
                        <Text style={{color:'#fff',marginTop:35,marginRight:theme.padding.kanan}}>detail</Text>
                    </TouchableHighlight>
                </View>

                 {  
                    //get 3 last data
                    this.state.kasus_baru.slice(panjang_k-3,panjang_k).reverse().map((kasus)=>{
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

    renderDataProvinsi = () => {
        return(
            <View style={{marginTop:20}}>
                <View style={{flexDirection:'row',justifyContent:'space-between'}}>
                    <Text style={styles.title}>Data Provinsi</Text>
                    <TouchableHighlight underlayColor='#1F746A' onPress={() => this.props.navigation.navigate('Provinsi')}>
                        <Text style={{color:'#fff',marginTop:35,marginRight:theme.padding.kanan}}>detail</Text>
                    </TouchableHighlight>
                </View>

                {
                    this.state.data_provinsi.slice(0,3).map((prov) => {

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

    renderDataHarian = () => {
        var panjang_h = this.state.data_harian.length;

        return(
            <View style={{marginTop:20,marginBottom:40}}>
                <View style={{flexDirection:'row',justifyContent:'space-between'}}>
                    <Text style={styles.title}>Update Harian</Text>
                    <TouchableHighlight underlayColor='#1F746A' onPress={() => this.props.navigation.navigate('Harian')}>
                        <Text style={{color:'#fff',marginTop:35,marginRight:theme.padding.kanan}}>detail</Text>
                    </TouchableHighlight>
                </View>

                { 
                    this.state.data_harian.slice(panjang_h-3,panjang_h).reverse().map((hari) =>{
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

export default Indonesia;
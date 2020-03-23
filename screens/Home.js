import React, { Component } from 'react'
import { Text, ToastAndroid ,StyleSheet, View, Animated, Image, Dimensions, ScrollView, TouchableOpacity , Button , TouchableHighlight } from 'react-native'
import { Dropdown } from 'react-native-material-dropdown';
import PTRView from 'react-native-pull-to-refresh';
import axios from 'axios';
import { BackHandler } from 'react-native';
console.disableYellowBox = true;

//import tema
import * as theme from '../Theme';

const { width, height } = Dimensions.get('screen');

const format = amount => {
    return Number(amount)
        .toFixed()
        .replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1.');
  };

class Home extends React.Component {
    
    constructor(props){
        super(props);
        this.state = {
            data_global : {},
            data_negara : {},
            drop_negara : [],
            negarana : "",
            default : "Indonesia",
            stat_idn : {}
        };
    }

    _refresh = () => {
        return new Promise((resolve) => {
            this.componentDidMount();
            this.setState({default: "Indonesia"});
            setTimeout(()=>{resolve()}, 1000)
        });
    }
    

    handleBackButton() {
        ToastAndroid.show('apps by @rbayuokt \n API by @mathdroid', ToastAndroid.SHORT);
        return true;
    }

    componentWillUnmount() {
        BackHandler.removeEventListener('hardwareBackPress', this.handleBackButton);
    }

    componentDidMount(){
        BackHandler.addEventListener('hardwareBackPress', this.handleBackButton);

        //get all negara
        axios.get('https://covid19.mathdro.id/api')
        .then(res=>{
            const datana = res.data;
            this.setState({data_global : datana});
            //console.log(this.state.data_global);
        })

        //get all negara untuk dropdown
        axios.get('https://covid19.mathdro.id/api/countries/')
        .then(res=>{
            const data_negarana = res.data.countries;
            this.setState({data_negara : data_negarana });
            var hitung = Object.keys(this.state.data_negara).length;

            //tampung dulu
            var tempNegara = [];
            for(var i=0 ; i < hitung ; i++){
                //jadiin format dropdown
                tempNegara.push({
                    value : Object.keys(this.state.data_negara)[i]
                })
            }
            this.setState({drop_negara: tempNegara});
        })

        //get all status indo
        axios.get('https://indonesia-covid-19.mathdro.id/api')
        .then(res=>{
            const datana = res.data;
            this.setState({stat_idn : datana});
        })

    }

    renderStatusGlobal = () => {
        return(
            <View style={styles.status}>
                <View style={styles.kartuKuning}>
                    <View style={styles.kartuKet}>
                        <Image source={require('../assets/images/masker.png')} style={styles.icn} />
                        <View>
                            <Text style={styles.labelCount}>{format(this.state.data_global.confirmed != undefined ? this.state.data_global.confirmed.value : "")}</Text>
                            <Text style={styles.labelDesc}>Terinfeksi</Text>
                        </View>
                    </View>
                </View>
                <View style={styles.kartuHijau}>
                    <View style={styles.kartuKet}>
                            <Image source={require('../assets/images/sembuh.png')} style={styles.icn} />
                        <View>
                            <Text style={styles.labelCount}>{ format(this.state.data_global.recovered != undefined ? this.state.data_global.recovered.value : "")}</Text>
                            <Text style={styles.labelDesc}>Sembuh</Text>
                        </View>
                    </View>
                </View>
                <View style={styles.kartuMerah}>
                    <View style={styles.kartuKet}>
                        <Image source={require('../assets/images/mati.png')} style={styles.icn} />
                        <View>
                            <Text style={styles.labelCount}>{ format(this.state.data_global.deaths != undefined ? this.state.data_global.deaths.value : "")}</Text>
                            <Text style={styles.labelDesc}>Meninggal</Text>
                        </View>
                    </View>
                </View>
            </View>
        );
    };


    renderLokasi = () => {
        // const { route , navigation } = this.props;
        return(
            <View style={styles.card}>
                <Text style={styles.title}>Pilih Negara</Text>

                <View style={styles.rapih}>
                    <Dropdown
                        value= {this.state.default}
                        baseColor = {theme.colors.putih}
                        itemTextStyle={{color:"#FFF" , fontSize : 18 , padding: 12 ,fontFamily: 'poppins'}}
                        itemColor = {theme.colors.hitam}
                        selectedItemColor = {theme.colors.hitam}
                        textColor="#FFF"
                        label = "- pilih -"
                        fontSize = {16}
                        data = {this.state.drop_negara}
                        onChangeText = { value => this.onChangeHandler(value)}
                    />
                    <TouchableHighlight underlayColor='#1F746A' style={styles.btnHijau} onPress={() => this.props.navigation.navigate('Detail' , { pilneg : (this.state.negarana == "") ? 'Indonesia' : this.state.negarana }) }>
                        <Text style={styles.btnHijauText}>CEK</Text>
                    </TouchableHighlight>
                </View>
            </View>
        );
    };

    onChangeHandler = (value) => {
        this.setState({negarana : value});
        console.log(this.state.negarana);
      }

    renderIndonesia = () => {
        return(
            <View>
                <View style={{flexDirection:'row',justifyContent:'space-between'}}>
                    <Text style={styles.title2}>Indonesia Status</Text>
                    <TouchableHighlight underlayColor='#1F746A' onPress={() => this.props.navigation.navigate('Indonesia')}>
                        <Text style={{color:'#fff',marginTop:37,marginRight:theme.padding.kanan}}>detail</Text>
                    </TouchableHighlight>
                </View>

                <View style={{flex:1,flexDirection:'row',justifyContent:'space-between',marginLeft:theme.padding.kiri,marginRight:theme.padding.kanan,marginTop:20}}>               
                    <View style={{alignItems:'center'}}>
                        <Text style={styles.textKuningBold}>{format(this.state.stat_idn.jumlahKasus != undefined ? this.state.stat_idn.jumlahKasus : "")}</Text>
                        <Text style={styles.textKuning}>Terinfeksi</Text>
                    </View>

                    <View style={{width: 2, height:height/15,backgroundColor:'#FFF',opacity:0.87}}></View>

                    <View style={{alignItems:'center'}}>
                        <Text style={styles.textHijauBold}>{format(this.state.stat_idn.sembuh != undefined ? this.state.stat_idn.sembuh : "")}</Text>
                        <Text style={styles.textHijau}>Sembuh</Text>
                    </View>

                    <View style={{width: 2, height:height/15,backgroundColor:'#FFF',opacity:0.87}}></View>

                    <View style={{alignItems:'center'}}>
                        <Text style={styles.textBiruBold}>{format(this.state.stat_idn.perawatan != undefined ? this.state.stat_idn.perawatan : "")}</Text>
                        <Text style={styles.textBiru}>Dirawat</Text>
                    </View>

                    <View style={{width: 2, height:height/15,backgroundColor:'#FFF',opacity:0.87}}></View>

                    <View style={{alignItems:'center'}}>
                        <Text style={styles.textMerahBold}>{format(this.state.stat_idn.meninggal != undefined ? this.state.stat_idn.meninggal : "")}    </Text>
                        <Text style={styles.textMerah}>Meninggal</Text>
                    </View>
                </View>
            </View>
        )
    }

    render(){

        return(
            <PTRView onRefresh={this._refresh} style={styles.container}>
                <View style={{flex:1}}>
                    <Text style={styles.title}>Status Global</Text>
                    {/* <Button onPress={() => navigation.navigate('Detail')} title="wow"/> */}
                    {this.renderStatusGlobal()}
                    {this.renderIndonesia()}
                    {this.renderLokasi()}
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
    title2:{
        fontSize: theme.ukuran.besar,
        color: theme.colors.putih,
        fontFamily: 'poppins-bold',
        opacity: 0.87,
        paddingLeft: theme.padding.kiri,
        paddingRight: theme.padding.kanan,
        marginTop: 30,
    },
    status:{
        flex:1,
        flexDirection: 'row',
        justifyContent: 'space-between',
        paddingLeft: theme.padding.kiri,
        paddingRight: theme.padding.kanan,
        marginTop: 20
    },
    kartuKuning:{
        flex: 1,
        padding: 2,
        height: height / 4.5 ,
        backgroundColor: theme.colors.kuning,
        marginRight: 7,
        borderRadius: theme.sizes.radius
    },
    kartuHijau:{
        flex: 1,
        padding: 2,
        height: height / 4.5 ,
        backgroundColor: theme.colors.hijau,
        marginRight: 7,
        borderRadius: theme.sizes.radius
    },
    kartuMerah:{
        flex: 1,
        padding: 2,
        height: height / 4.5 ,
        backgroundColor: theme.colors.merah,
        marginRight: 7,
        borderRadius: theme.sizes.radius
    },
    kartuKet:{
        flex: 1,
        alignItems: 'center',
        flexDirection: 'column',
        justifyContent: 'space-evenly',
    },  
    labelCount:{
        color: theme.colors.putih,
        fontSize: theme.ukuran.sedang,
        textAlign: 'center',
        fontFamily: 'poppins-bold',
        marginTop: 10
    },
    labelDesc:{
        color: theme.colors.putih,
        fontSize: theme.ukuran.kecil,
        textAlign: 'center',
        fontFamily: 'poppins',
        marginTop : -5
    },
    icn:{
        width: 40,
        height: 40,
        marginTop: 10
    },
    btnHijau:{
        backgroundColor: theme.colors.hijau,
        marginTop: 20,
        padding: 8,
        borderRadius: theme.sizes.radius
    },
    btnHijauText:{
        color: theme.colors.putih,
        fontSize: theme.ukuran.sedang,
        textAlign: 'center',
        fontFamily: 'poppins-bold'
    },
    card:{
        flex: 1,
        backgroundColor: theme.colors.background_secondary,
        marginTop: 30,
        borderTopLeftRadius: 30,
        borderTopRightRadius: 30
    },
    textKuningBold:{
        color: theme.colors.kuning,
        fontSize: 16,
        fontFamily: "poppins-bold"
    },
    textKuning:{
        color: theme.colors.kuning,
        fontSize: 12,
        fontFamily: "poppins",
        marginTop: -5
    },
    textHijauBold:{
        color: theme.colors.hijau,
        fontSize: 16,
        fontFamily: "poppins-bold"
    },
    textHijau:{
        color: theme.colors.hijau,
        fontSize: 12,
        fontFamily: "poppins",
        marginTop: -5
    },
    textBiruBold:{
        color: theme.colors.biru,
        fontSize: 16,
        fontFamily: "poppins-bold"
    },
    textBiru:{
        color: theme.colors.biru,
        fontSize: 12,
        fontFamily: "poppins",
        marginTop: -5
    },
    textMerahBold:{
        color: theme.colors.merah,
        fontSize: 16,
        fontFamily: "poppins-bold"
    },
    textMerah:{
        color: theme.colors.merah,
        fontSize: 12,
        fontFamily: "poppins",
        marginTop: -5
    },


})

export default Home;
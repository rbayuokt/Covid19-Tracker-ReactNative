import React, { Component } from 'react'
import { Text, StyleSheet, View, Animated, Image, Dimensions, ScrollView, TouchableOpacity ,BackHandler , ToastAndroid} from 'react-native'
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


class Detail extends React.Component{

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
            detail_negara: {},
            isError : false,
            negaranya : "",
            isLoading : true,
        };
        
    }

    _refresh = () => {
        return new Promise((resolve) => {
            this.componentDidMount();
            setTimeout(()=>{resolve()}, 1000)
        });
    }


    //back button
    handleBackButton() {
        // const { route , navigation } = this.props;
        // this.navigation.navigate('Home');
        ToastAndroid.show('Selalu Cuci Tanganmu', ToastAndroid.SHORT);

        return true;
    }

    componentWillUnmount() {
        BackHandler.removeEventListener('hardwareBackPress', this.handleBackButton);
    }

    componentDidMount(){
        BackHandler.addEventListener('hardwareBackPress', this.handleBackButton);

        const { params } = this.props.route;
        const pilneg = params ? params.pilneg : null;
        var negara = pilneg;

        if(pilneg == "Indonesia" || pilneg == "indonesia"){
            var url = "https://indonesia-covid-19.mathdro.id/api";

            axios.get(url)
            .then(res => {
                const datana = res.data;
                this.setState({ 
                    detail_negara : datana,
                    isLoading: false,
                    negaranya : pilneg
                });

                this.refs.loading.show(this.state.isLoading);
                
            })
            
        }else{
            var url = "https://covid19.mathdro.id/api/countries/"+negara;

            //tampilkan loading
            this.refs.loading.show(this.state.isLoading);
    
            axios.get(url)
            .then(res=>{
                    const datana = res.data;
    
                    this.setState({
                        detail_negara : datana,
                        isLoading: false
                    });
    
                    //update state loading
                    this.refs.loading.show(this.state.isLoading);
    
            })
            .catch(err=>{
    
                this.setState({
                    isError : true, 
                    negaranya : negara,
                    isLoading: false,
                });
    
                //update state loading
                this.refs.loading.show(this.state.isLoading);

            })
        }
        
    }

    render(){
        const isOk = this.state.isError;

        if(this.state.negaranya == "Indonesia" || this.state.negaranya == "indonesia"){
            return(
            <PTRView onRefresh={this._refresh} style={styles.container}>
                <Loading ref="loading"/>
                <View>
                    <Text style={styles.title}>Last Update</Text>
                    <Text style={styles.subtitle}>{moment(Date(this.state.detail_negara.lastUpdate)).format('DD - MMMM - YYYY')}</Text>

                    <View style={styles.rapih}>
                        <View style={styles.kartuKuning} >
                            <View>
                                <Text style={styles.labelDesc}>Terinfeksi</Text>
                                <Text style={styles.labelCount}>{format(this.state.detail_negara.jumlahKasus != undefined ? this.state.detail_negara.jumlahKasus : "")}</Text>
                            </View>
                            <Image source={require('../assets/images/masker.png')} style={styles.icn} />
                        </View>

                        <View style={styles.kartuHijau} >
                            <View>
                                <Text style={styles.labelDesc}>Sembuh</Text>
                                <Text style={styles.labelCount}>{format(this.state.detail_negara.sembuh != undefined ? this.state.detail_negara.sembuh : "")}</Text>
                            </View>
                            <Image source={require('../assets/images/sembuh.png')} style={styles.icn} />
                        </View>

                        <View style={styles.kartuMerah} >
                            <View>
                                <Text style={styles.labelDesc}>Meninggal</Text>
                                <Text style={styles.labelCount}>{format(this.state.detail_negara.meninggal != undefined ? this.state.detail_negara.meninggal : "")}</Text>
                            </View>
                            <Image source={require('../assets/images/mati.png')} style={styles.icn} />
                        </View>
                    </View>
                </View>
            </PTRView>
            )
        }else{
            if(this.state.isError == false){
                return (
                    <PTRView onRefresh={this._refresh} style={styles.container}>
                        <Loading ref="loading"/>
                        <View>
                            <Text style={styles.title}>Last Update</Text>
                            <Text style={styles.subtitle}>{moment(Date(this.state.detail_negara.lastUpdate)).format('DD - MMMM - YYYY')}</Text>
        
                            <View style={styles.rapih}>
                                <View style={styles.kartuKuning} >
                                    <View>
                                        <Text style={styles.labelDesc}>Terinfeksi</Text>
                                        <Text style={styles.labelCount}>{format(this.state.detail_negara.confirmed != undefined ? this.state.detail_negara.confirmed.value : "")}</Text>
                                    </View>
                                    <Image source={require('../assets/images/masker.png')} style={styles.icn} />
                                </View>
        
                                <View style={styles.kartuHijau} >
                                    <View>
                                        <Text style={styles.labelDesc}>Sembuh</Text>
                                        <Text style={styles.labelCount}>{format(this.state.detail_negara.recovered != undefined ? this.state.detail_negara.recovered.value : "")}</Text>
                                    </View>
                                    <Image source={require('../assets/images/sembuh.png')} style={styles.icn} />
                                </View>
        
                                <View style={styles.kartuMerah} >
                                    <View>
                                        <Text style={styles.labelDesc}>Meninggal</Text>
                                        <Text style={styles.labelCount}>{format(this.state.detail_negara.deaths != undefined ? this.state.detail_negara.deaths.value : "")}</Text>
                                    </View>
                                    <Image source={require('../assets/images/mati.png')} style={styles.icn} />
                                </View>
                            </View>
                        </View>
                    </PTRView>
                )
            }else{
                return(
                    <View style={styles.containerErr}>
                        <Loading ref="loading"/>
                        <Image source={require('../assets/images/bacteria.png')} style={styles.icnErr} />
                        <Text style={styles.errorTitle}>{this.state.negaranya}</Text>
                        <Text style={styles.errorSubTitle}>Tidak Terdaftar Pada JHU Database</Text>
                    </View>
                )
            }
        }
        

    }
}

const styles = StyleSheet.create({
    container:{
        flex: 1,
        backgroundColor: theme.colors.background
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
    containerErr:{
        flex: 1,
        backgroundColor: theme.colors.background,
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: -100
    },
    errorTitle:{
        fontSize: theme.ukuran.besar,
        color: theme.colors.putih,
        fontFamily: 'poppins-bold',
        opacity: 0.87,
        paddingLeft: theme.padding.kiri,
        paddingRight: theme.padding.kanan,
        marginTop: 30,
        textAlign: 'center'
    },
    errorSubTitle:{
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
    subtitle:{
        fontSize: theme.ukuran.kecil,
        color: theme.colors.putih,
        fontFamily: 'poppins',
        opacity: 0.67,
        paddingLeft: theme.padding.kiri,
        paddingRight: theme.padding.kanan,
    },
    rapih:{
        marginTop: 20,
        marginLeft: theme.padding.kiri,
        marginRight: theme.padding.kanan
    },
    kartuKuning:{
        flex: 1,
        backgroundColor: theme.colors.kuning,
        padding: 8,
        flexDirection: 'row',
        justifyContent: 'space-between',
        paddingRight: theme.padding.kanan,
        paddingLeft: theme.padding.kiri,
        borderRadius: theme.sizes.radius,
        alignItems: 'center'
    },
    kartuHijau:{
        flex: 1,
        backgroundColor: theme.colors.hijau,
        padding: 8,
        flexDirection: 'row',
        justifyContent: 'space-between',
        paddingRight: theme.padding.kanan,
        paddingLeft: theme.padding.kiri,
        borderRadius: theme.sizes.radius,
        alignItems: 'center',
        marginTop: 20
    },
    kartuMerah:{
        flex: 1,
        backgroundColor: theme.colors.merah,
        padding: 8,
        flexDirection: 'row',
        justifyContent: 'space-between',
        paddingRight: theme.padding.kanan,
        paddingLeft: theme.padding.kiri,
        borderRadius: theme.sizes.radius,
        alignItems: 'center',
        marginTop: 20
    },
    labelCount:{
        fontFamily: 'poppins-bold',
        color: theme.colors.putih,
        fontSize: 30,
        marginTop: -5
    },
    labelDesc:{
        fontFamily: 'poppins',
        color: theme.colors.putih,
        fontSize: theme.ukuran.medium,
        marginTop: 10
    }
});

export default Detail;
import React,{useEffect,useState} from 'react'
import { StyleSheet,View, SafeAreaView, ScrollView,Platform, Alert } from 'react-native';

import {Text} from 'react-native-elements';
import { AuthProvider, useAuth } from '../Auth';
import { Button,TextInput,Card,Title,Paragraph, ActivityIndicator } from 'react-native-paper';
import DateTimePicker from '@react-native-community/datetimepicker';
import { UrlHost } from './Server';


function PantallaReservacion({route,navigation}) {
    
    const { status, userToken } = useAuth();
    const {idTur} = route.params;
    const [cantidad, setCantidad] = useState('');
    const [email, setEmail] = useState('');
    const [cedula, setCedula] = useState('');
    const [nombres, setNombres] = useState('');
    const [apellidos, setApellidos] = useState('');
    const [telefono, setTelefono] = useState('');
    const [isLoading, setLoading] = useState(true);
    const [cupos, setcupos] = useState(0);

    //obtener usuario 
    const getUser = async () => {
        try {
          const response = await fetch(UrlHost+'obtener-usuario/'+userToken,{
            headers: {
                'Accept': 'application/json, text/plain, */*',  // It can be used to overcome cors errors
                'Content-Type': 'application/json'
              }
          });
          const json = await response.json();
          setEmail(json.email);
          setCedula(json.cedula);
          setNombres(json.nombres);
          setApellidos(json.apellidos);
          setTelefono(json.telefono);
        } catch (error) {
          console.error(error);
        } finally {
          setLoading(false);
        }
    }


    const getTurismo = async () => {
        try {
          const response = await fetch(UrlHost+'turismos-detalle/'+idTur,{
            headers: {
                'Accept': 'application/json, text/plain, */*',  // It can be used to overcome cors errors
                'Content-Type': 'application/json'
              }
          });
          const json = await response.json();
          setcupos(json.cupos);
        } catch (error) {
          console.error(error);
        } finally {
          setLoading(false);
        }
    }

     function validar() {
        if(cantidad.length==0 || parseInt(cantidad)<=0 || cedula.length==0 || nombres.length==0 || apellidos.length==0 || telefono.length==0){
           return  false; 
        }
        return  true;
    }

    async function enviarReservacion(){
        if(validar()){
            try {
                const fechaDesde=date.getFullYear()+'-'+ date.getMonth()+ "-" +date.getDate();
                const fechaHasta=hasta.getFullYear()+"-"+ hasta.getMonth()+"-"+hasta.getDate();
                const url=UrlHost+'enviar-reservacion/'+userToken+'/'+idTur+'/'+fechaDesde+'/'+fechaHasta+'/'+cantidad+'/'+cedula+'/'+nombres+'/'+apellidos+'/'+telefono;
                console.log(url)
                const response = await fetch(url,{
                    headers: {
                        'Accept': 'application/json, text/plain, */*',  // It can be used to overcome cors errors
                        'Content-Type': 'application/json'
                      }
                  });
                
                    const json = await response.json();
                    console.log(json)
                    if(json=='success'){
                        alert('Su reservación se envio correctamente.');
                        navigation.goBack();
                    }else{
                        alert('Algo salió mal, vuelva intentarlo.');
                    }
                
              } catch (error) {
                console.error(error);
              } finally {
                
              }
        }else{
            alert('Complete todos los campos');
        }
        
    }
   
    

   //fecha
    const [date, setDate] = useState(new Date());
    const [hasta, setHasta] = useState(new Date());
    const [show, setShow] = useState(false);
    const [show2, setShow2] = useState(false);
    const [mode, setMode] = useState('date');


    const onChange = (event, selectedDate) => {
        const currentDate = selectedDate || date;
        setShow(Platform.OS === 'ios');
        setDate(currentDate);
        console.log(currentDate)
    };

    const onChangeHasta = (event, selectedDate) => {
        const currentDate = selectedDate || hasta;
        setShow2(Platform.OS === 'ios');
        setHasta(currentDate);
    };

    const showMode = (currentMode) => {
        setShow(true);
        setMode(currentMode);
      };
    const showModew = (currentMode) => {
        setShow2(true);
        setMode(currentMode);
      };
    
    const showDatepicker = () => {
        showMode('date');
      };
    
      const showTimepicker = () => {
        showModew('date');
      };

    useEffect(() => {
        getUser();
        getTurismo();
    }, []);
 


    return (

    <SafeAreaView >
        <ScrollView>
          
        <View style={{ margin:10 }}>
        
        {
            userToken==null?
            <Button style={{ margin:10 }} color="#1B5E20" icon="login" mode="outlined" onPress={() =>navigation.navigate('Login')}>
                Iniciar sessión para realizar reservación
            </Button> :
            <View>
                <Card>
                <Card.Title title="Información de reservación" subtitle="Complete todos los campos" />
                
                <Card.Content>
                    <Text>Cupos disponibles: {cupos}</Text>
                    <Text></Text>
                <View>
                    <Button onPress={showDatepicker} color="green" mode="outlined">DESDE: {date.toDateString()}</Button>
                </View>
                <Text></Text>
                <View>
                    <Button onPress={showTimepicker} color="green"  mode="outlined">HASTA: {hasta.toDateString()}</Button>
                </View>
               
                {show && (
                    <DateTimePicker
                    testID="dateTimePicker2"
                    value={date}
                    mode="date"
                    display="default"
                    onChange={onChange}
                    />
                )}

                {show2 && (
                    <DateTimePicker
                    testID="dateTimePicker1"
                    value={hasta}
                    mode="date"
                    display="default"
                    onChange={onChangeHasta}
                    />
                )}
                    
                    <Text></Text>
                    <TextInput
                    label="Cantidad de personas"
                    value={cantidad}
                    mode="outlined"
                    keyboardType="numeric"
                    onChangeText={cantidad => setCantidad(cantidad)}
                    />
                </Card.Content>
                    {
                        isLoading?<ActivityIndicator/>:
                        <View>
                            <Card.Title title="Información de cliente" subtitle="Complete todos los campos" />
                                <Card.Content>
                                    <TextInput
                                    label="Email"
                                    mode="outlined"
                                    value={email}
                                    disabled={email?true:false}
                                    keyboardType="email-address"
                                    onChangeText={email => setEmail(email)}
                                    />
                                    <Text></Text>
                                    <TextInput
                                    label="Cédula"
                                    mode="outlined"
                                    keyboardType="numeric"
                                    value={cedula}
                                    onChangeText={cedula => setCedula(cedula)}
                                    />
                                    <Text></Text>
                                    <TextInput
                                    label="Nombres"
                                    mode="outlined"
                                    value={nombres}
                                    
                                    
                                    onChangeText={nombres => 
                                            {
                                                var RegExpression = /^[a-zA-Z\s]*$/;  
                                                if (RegExpression.test(nombres)) {
                                                    setNombres(nombres)
                                                }
                                            }
                                        }
                                        
                                    />
                                    <Text></Text>
                                    <TextInput
                                    label="Apellidos"
                                    mode="outlined"
                                    value={apellidos}
                                    
                                    onChangeText={apellidos => 
                                        {
                                            // validacion de caracteres, solo letras y espaciado
                                            var RegExpression = /^[a-zA-Z\s]*$/;  
                                            if (RegExpression.test(apellidos)) {
                                                setApellidos(apellidos)
                                            }
                                        }
                                       
                                    }
                                    />
                                    <Text></Text>
                                    <TextInput
                                    label="Teléfono"
                                    mode="outlined"
                                    keyboardType="phone-pad"
                                    value={telefono}
                                    onChangeText={telefono => setTelefono(telefono)}
                                    />
                                </Card.Content>
                                <Card.Actions>
                                    <Button color="red" mode="outlined" onPress={()=>navigation.goBack()}>Cancelar</Button>
                                    {
                                        cupos>0?<Button mode="contained" style={{ marginLeft:15 }} color="green" onPress={()=>enviarReservacion()}>Reservar</Button>:
                                        <Button mode="contained" style={{ marginLeft:15 }} color="red" onPress={()=>alert('No existe cupos par reservar')}>Reservar</Button>
                                    }
                                    
                                </Card.Actions>
                        </View>
                    }
                

            </Card>
                
                
            </View>
            

        }
            
        </View>
        
        </ScrollView>
    </SafeAreaView>
    )
}

export default PantallaReservacion

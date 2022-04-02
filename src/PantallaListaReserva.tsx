import React, { useEffect, useState } from 'react';
import { StyleSheet, Text, SafeAreaView, ScrollView, StatusBar,ActivityIndicator, View } from 'react-native';
import { ListItem } from 'react-native-elements'
import { Avatar,Drawer,Searchbar,Banner} from 'react-native-paper';
import { UrlHost } from './Server';
import { AuthProvider, useAuth } from '../Auth';
// import { Button} from 'react-native';
import { DataTable } from 'react-native-paper';
import { BottomSheet, Button,Input } from 'react-native-elements';

function Mensaje(){
    const [visible, setVisible] = React.useState(true);
    return (
        <Banner
            visible={visible}
            actions={[
                {
                label: 'CERRAR',
                onPress: () => setVisible(false),
                }
            ]}
            icon={({size}) => (
                <Avatar.Icon size={54} icon="information-off"  />
            )}>
            Lo siento, no tienes lugares.
        </Banner>
    )
}


export default function PantallaListaReserva({route,navigation}) {
    const { status, userToken } = useAuth();
    
    const { idTur, nombreTur } = route.params;
    navigation.setOptions({title:nombreTur});
    const [isVisible, setIsVisible] = useState(false);

    const [cupos, setcupos] = useState('');
    
    
    const [isLoading, setLoading] = useState(true);
    const [data, setData] = useState([]);
  
    const getTurismos = async () => {
       try {
        const response = await fetch(UrlHost+'mis-lista-lugares/'+idTur,{
          headers: {
            'Accept': 'application/json, text/plain, */*',  // It can be used to overcome cors errors
            'Content-Type': 'application/json'
          }
        });
        const json = await response.json();
        console.log(json)
        setData(json);
        
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    }
  
    useEffect(() => {
        getTurismos();
    }, []);


    const cambiarEstado = async (idReserva) => {
        try {
         const response = await fetch(UrlHost+'cambiar-estado-lugar/'+idReserva,{
          headers: {
            'Accept': 'application/json, text/plain, */*',  // It can be used to overcome cors errors
            'Content-Type': 'application/json'
          }
         });
         const json = await response.json();
         getTurismos();
         
       } catch (error) {
         console.error(error);
       } finally {
         setLoading(false);
       }
     }
     
     
     const list = [
      {
        title: 'Actualizar',
        containerStyle: { backgroundColor: 'blue' },
        titleStyle: { color: 'white' },
        onPress: () => guardarCupos(),
      },
       {
         title: 'Cancelar',
         containerStyle: { backgroundColor: 'red' },
         titleStyle: { color: 'white' },
         onPress: () => setIsVisible(false),
       },
     ];

     async function  actualizarCupos(){
      
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
        alert(error);
      } finally {
        setLoading(false);
      }

       setIsVisible(true);
     }

     async function guardarCupos(){
      
      await updateCupos();
       setIsVisible(false);
       
     }


     const updateCupos = async () => {
      //  alert(cupos)
      try {
       const response = await fetch(UrlHost+'actualizar-cupo-turismo/'+idTur+"/"+cupos,{
        headers: {
          'Accept': 'application/json, text/plain, */*',  // It can be used to overcome cors errors
          'Content-Type': 'application/json'
        }
       });
       const json = await response.json();
       getTurismos();
       
     } catch (error) {
       alert(error);
     } finally {
       setLoading(false);
     }
   }
    return (
        
        <SafeAreaView>
        <ScrollView>
        <Button
          title="Actualizar cupos"
          onPress={() => actualizarCupos()}
        />
        <BottomSheet modalProps={{}} isVisible={isVisible}>
              <ListItem
                key={'0001a'}
              >
                <ListItem.Content>
                  <ListItem.Title >{'Cupos actuales'}</ListItem.Title>
                  <Input
                  value={cupos.toString()}
                    placeholder='Ingrese cantidad de cupos disponibles'
                    onChangeText={(e)=>setcupos(e)}
                  />
                </ListItem.Content>
              </ListItem>

            {list.map((l, i) => (
              <ListItem
                key={i}
                containerStyle={l.containerStyle}
                onPress={l.onPress}
              >
                <ListItem.Content>
                  <ListItem.Title style={l.titleStyle}>{l.title}</ListItem.Title>
                </ListItem.Content>
              </ListItem>
            ))}
          </BottomSheet>
        {
            
            isLoading?<ActivityIndicator/>:
            data.length>0?
            
            data.map((l, i) => (
              <>
              
                <ListItem key={i} bottomDivider>
                    
                    {/* <Avatar.Image source={{uri: l.foto}} /> */}
                    <ListItem.Content>
                        <ListItem.Title>{'Cliente: '+l.apellidos} {l.nombres}</ListItem.Title>
                        <ListItem.Subtitle>{'Fecha inicio: '+l.fecha_inicio}</ListItem.Subtitle>
                        <ListItem.Subtitle>{'Fecha final: '+l.fecha_final}</ListItem.Subtitle>
                        <ListItem.Subtitle>{'Cantidad personas:  '+l.cantidad_personas}</ListItem.Subtitle>
                        {/* <ListItem.Subtitle>{'Estado: '+l.estado}</ListItem.Subtitle> */}
                        <ListItem.Subtitle>{'Cédula: '+l.cedula}</ListItem.Subtitle>
                        <ListItem.Subtitle>{'Teléfono: '+l.telefono}</ListItem.Subtitle>
                        <ListItem.Subtitle>{'Edad: '+l.edad}</ListItem.Subtitle>
                        <ListItem.Subtitle>{'Cupos: '+l.cupos}</ListItem.Subtitle>
                        <ListItem.Subtitle>
                            <View>
                            <DataTable>
                              <DataTable.Row>
                                <DataTable.Cell>
                                <Button title="Aceptado" disabled={l.estado==1?true:false} color="green" onPress={()=>cambiarEstado(l.id)}></Button>
                                </DataTable.Cell>
                                <DataTable.Cell >
                                  {'  '}
                                </DataTable.Cell>
                                <DataTable.Cell >
                                <Button title="Rechazar" disabled={l.estado==0?true:false} color="red" onPress={()=>cambiarEstado(l.id)}></Button>
                                </DataTable.Cell>
                                
                              </DataTable.Row>
                            </DataTable>

                            </View>


                        </ListItem.Subtitle>
                    </ListItem.Content>
                    {/* <ListItem.Chevron /> */}
                </ListItem>
                
                </>
            )):<Mensaje/>
                
        }
        
      </ScrollView>
    </SafeAreaView>
    )
}

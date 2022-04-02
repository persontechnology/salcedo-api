import React, { useEffect, useState } from 'react';
import { StyleSheet, Text, SafeAreaView, ScrollView, StatusBar,ActivityIndicator, View } from 'react-native';
import { ListItem } from 'react-native-elements'
import { Avatar,Drawer,Searchbar,Banner} from 'react-native-paper';
import { UrlHost } from './Server';
import { AuthProvider, useAuth } from '../Auth';


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
            Lo siento, no existe lugares turisticos en esta categoría.
        </Banner>
    )
}


function PantallaMisReservaciones({route,navigation}) {
    const { status, userToken } = useAuth();

    const [isLoading, setLoading] = useState(true);
    const [data, setData] = useState([]);
  
    const getTurismos = async () => {
       try {
        const response = await fetch(UrlHost+'mis-reservaciones/'+userToken,{
            headers: {
                'Accept': 'application/json, text/plain, */*',  // It can be used to overcome cors errors
                'Content-Type': 'application/json'
              }
        });
        const json = await response.json();
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





    return (
        
        <SafeAreaView>
        <ScrollView>
        {
            
            isLoading?<ActivityIndicator/>:
            data.length>0?
            
            data.map((l, i) => (
                <ListItem key={i} bottomDivider onPress={() => navigation.navigate('MyCarousel',{idTur:l.id,nombreTur:l.nombre})}>
                    
                    <Avatar.Image source={{uri: l.foto}} />
                    <ListItem.Content>
                        <ListItem.Title>{l.nombre}</ListItem.Title>
                        <ListItem.Subtitle>{l.direccion}</ListItem.Subtitle>
                        
                        {
                            l.fecha?<ListItem.Subtitle>Fecha reservación:{l.fecha}</ListItem.Subtitle>:<></>
                        }
                        <ListItem.Subtitle>{'Estado: '+(l.estado==0?'Enviado':'Aceptado')}</ListItem.Subtitle>
                    </ListItem.Content>
                    <ListItem.Chevron />
                </ListItem>
            )):<Mensaje/>
                
        }
        
      </ScrollView>
    </SafeAreaView>
    )
}

export default PantallaMisReservaciones

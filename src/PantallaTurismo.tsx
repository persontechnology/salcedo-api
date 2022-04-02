import React, { useEffect, useState } from 'react';
import { View ,SafeAreaView, ScrollView} from 'react-native';
import { ListItem } from 'react-native-elements'
import { ActivityIndicator,Avatar,Banner} from 'react-native-paper';
import { UrlHost } from './Server';


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

function PantallaTurismo({route,navigation}) {

    const { idCat, nombreCat } = route.params;
    navigation.setOptions({ title: nombreCat })

    const [isLoading, setLoading] = useState(true);
    const [data, setData] = useState([]);
  
    const getTurismos = async () => {
       try {
        const response = await fetch(UrlHost+'turismos/'+idCat,{
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
                            l.sitioweb?<ListItem.Subtitle>{l.sitioweb}</ListItem.Subtitle>:<></>
                        }
                        
                    </ListItem.Content>
                    <ListItem.Chevron />
                </ListItem>
            )):<Mensaje/>
                
        }
        
      </ScrollView>
    </SafeAreaView>
    )
}

export default PantallaTurismo

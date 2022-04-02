import React, { useEffect, useState } from 'react';
import { StyleSheet, Text, SafeAreaView, ScrollView, StatusBar,ActivityIndicator, View } from 'react-native';
import { ListItem } from 'react-native-elements'
import { Avatar,Drawer,Searchbar} from 'react-native-paper';
import { UrlHost } from './Server';

const PantallaInicio = ({route,navigation}) => {


    const [isLoading, setLoading] = useState(true);
    const [buscador,setBuscador]=useState('');
    const [filtro,setFiltro]=useState([]);
    const [data, setData] = useState([]);
  
    const getCategorias = async () => {
       try {
        const response = await fetch(UrlHost+'categorias',{
            headers: {
                'Accept': 'application/json, text/plain, */*',  // It can be used to overcome cors errors
                'Content-Type': 'application/json'
              }
        });
        const json = await response.json();
        setData(json);
        setFiltro(json);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    }
  
    useEffect(() => {
        getCategorias();
    }, []);

  
    const buscadorFuncionFiltro=(texto)=>{
        if(texto){
            const nuevoData=data.filter(function(item){
                const itemData=item.nombre?item.nombre.toUpperCase():''.toUpperCase();
                const textoData=texto.toUpperCase();
                return itemData.indexOf(textoData)>-1;
            })
            setFiltro(nuevoData)
            setBuscador(texto)
        }else{
            setFiltro(data);
            setBuscador(texto);
        }
    }
  
    return (
        
        <SafeAreaView >
      <ScrollView>
            {/* <Drawer.Item
                style={{ backgroundColor: '#2E7D32' }}
                icon="star"
                label="CATEGORIAS"
            /> */}

                <Searchbar
                    placeholder="Buscar"
                    onChangeText={(texto)=>buscadorFuncionFiltro(texto)}
                    value={buscador}
                />
             
        {
            isLoading?<ActivityIndicator/>:
           
            filtro.map((l, i) => (
                <ListItem key={i} bottomDivider onPress={() => navigation.navigate('Turismos',{idCat:l.id,nombreCat:l.nombre})}>
                    <Avatar.Image source={{uri: l.foto}} />
                    <ListItem.Content>
                        <ListItem.Title>{l.nombre}</ListItem.Title>
                        <ListItem.Subtitle>{l.descripcion}</ListItem.Subtitle>
                    </ListItem.Content>
                    <ListItem.Chevron />
                </ListItem>
            ))
        }
       </ScrollView>
    </SafeAreaView>
    );
}


export default PantallaInicio;

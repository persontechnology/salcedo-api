import React,{ useEffect, useState} from 'react'
import { View,ActivityIndicator,SafeAreaView, ScrollView,Text } from 'react-native';
import { UrlHost } from './Server';
import { ListItem, Avatar, Divider } from 'react-native-elements'
import { Button,TextInput } from 'react-native-paper';

import { AuthProvider, useAuth } from '../Auth';


function PantallaComentarios({route,navigation}) {

    const { status, userToken } = useAuth();
    const { idTur,idUser} = route.params;
    navigation.setOptions({title:'Comentarios'})

    const [isLoading, setLoading] = useState(true);
    const [data, setData] = useState([]);
    const [text, setText] = React.useState('');

    

    const getTurismos = async () => {
      try {
        const response = await fetch(UrlHost+'comentarios/'+idTur,{
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

    

   async function enviarComentario(){
        try {
          const response = await fetch(UrlHost+'enviar-comentario/'+idTur+'/'+userToken+'/'+text,{
            headers: {
              'Accept': 'application/json, text/plain, */*',  // It can be used to overcome cors errors
              'Content-Type': 'application/json'
            }
          });
          // const json = await response.json();
          // setData(data.concat(json))
          // setData(data=>data.concat(json))
          getTurismos()
        } catch (error) {
          console.error(error);
        } finally {
          alert('Gracias por su comentario')
        }
    }

    useEffect(() => {
      getTurismos();
  }, []);
  
    return (
      <View>
        <SafeAreaView>
          <ScrollView>

{
  userToken==null?
  <Button style={{ margin:10 }} color="#1B5E20" icon="login" mode="outlined" onPress={() =>navigation.navigate('Login')}>
    Iniciar sessión para comentar
  </Button> :
  <>
  <Text style={{ margin:10 }}>Deja tu comentario {userToken}</Text>
  <TextInput
    style={{ margin:10 }}
    label="Tu comentario.."
    value={text}
    underlineColor="#1B5E20"
    selectionColor="#1B5E20"
    outlineColor="#1B5E20"
    // multiline={true}
    maxLength={120}
    onChangeText={text => setText(text)}
  />
    <Button style={{ margin:10 }} color="#1B5E20" icon="comment" mode="contained" onPress={() => enviarComentario()}>
    comentar
  </Button>
  </>
}
          
          
          
            {
              isLoading?<ActivityIndicator size="small" color="#0000ff" />:
              data.map((l, i) => (
                <ListItem key={l.id} bottomDivider>
                  <Avatar
                  rounded
                  title={l.user.foto}
                  source={{ uri: l.user.foto }}
                />
                  <ListItem.Content>
                    <ListItem.Title>{l.user.name}</ListItem.Title>
                    <ListItem.Subtitle>
                      {l.comentario}
                    </ListItem.Subtitle>
                    <ListItem.Subtitle>
                      {l.fecha}
                    </ListItem.Subtitle>
                  </ListItem.Content>
                </ListItem>
              ))
            }
        </ScrollView>
        </SafeAreaView>
    </View>
    )
}

export default PantallaComentarios

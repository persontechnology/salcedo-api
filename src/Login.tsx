import React from 'react'
import { Button, View} from 'react-native';
import { Text } from 'react-native-elements';
import { AuthProvider, useAuth } from '../Auth/index';
import { ActivityIndicator, Divider, TextInput } from 'react-native-paper';
import { UrlHost } from './Server';
import * as WebBrowser from 'expo-web-browser';


function Login({route,navigation}) {
  const { signOut } = useAuth();
  const { status, userToken } = useAuth();
  const { signIn } = useAuth();
  const [email, setEmail] = React.useState('');
  const [password, setPassword] = React.useState('');
  const [isLoading, setLoading] = React.useState(false);

  const registrarIn = async (email,password) => {
    setLoading(true);
    try {
     const response = await fetch(UrlHost+'registrousuario/'+email+"/"+password,{
      headers: {
        'Accept': 'application/json, text/plain, */*',  // It can be used to overcome cors errors
        'Content-Type': 'application/json'
      },
     });
     const json = await response.json();
     alert('Registro exitoso');
   } catch (error) {
     console.error(error);
   } finally {
     setLoading(false);
   }
 }

const _handlePress = () => {
  var u=UrlHost.split('app');

  WebBrowser.openBrowserAsync(u[0]+"admin/forgot");
};

  return (
    <AuthProvider>
    <View style={{ flex:1,justifyContent:'center',margin:10 }}>
    {
      userToken == null ? 
      isLoading?<ActivityIndicator/>:
      <View>

        <TextInput
          label="Email"
          value={email}
          mode='outlined'
          onChangeText={text => setEmail(text)}
        />  
        <TextInput
          label="Password"
          value={password}
          mode='outlined'
          secureTextEntry
          onChangeText={text => setPassword(text)}
        />  
        <Text></Text>
        <Divider></Divider>
        <Text></Text>
        <Button color="green" title="INGRESAR" onPress={() => signIn(email,password)} />
        <Text></Text>
        <Button color="blue" title="REGISTRAR" onPress={() => registrarIn(email,password)} />
      
        <Text onPress={_handlePress} style={{ marginTop:15 }}>¿Olvidaste tu contraseña? Haz click aquí'</Text>
      </View>
       : 
      <View>
        <Text h3>Bienvenido</Text>
        <Text h4>{userToken}</Text>
        <Text></Text>
        <Button title="Continuar" color="green" onPress={()=>navigation.navigate('Inicio')}></Button>
        <Text></Text>
        <Button title="Salir" color="red" onPress={signOut}></Button>
      </View>

    }
    </View>
    </AuthProvider>
  );
}

export default Login

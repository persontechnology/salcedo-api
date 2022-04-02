import * as React from 'react';
import { Text, View, StyleSheet, Button } from 'react-native';
import { AuthProvider, useAuth } from './Auth';
import { Divider, TextInput } from 'react-native-paper';


const LogOutButton = () => {
  const { signOut } = useAuth();
  return <Button title="SALIR" onPress={signOut} />;
};

const LogInButton = () => {
  const { signIn } = useAuth();
  const [email, setEmail] = React.useState('');
  const [password, setPassword] = React.useState('');


  return (
    <>
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
    <Button title="INGRESAR" onPress={() => signIn(email,password)} />
    </>
  )
};
const Main = () => {
  const { status, userToken } = useAuth();

  return (
    <View style={{ flex:1,alignContent:'center',justifyContent:'center',margin:25 }}>
      <Text>Acceder al sistema</Text>
      <View>
        {
          userToken==null?<LogInButton />:<LogOutButton />
        }
      </View>
    </View>
  );
};

export default function App() {
  return (
    <AuthProvider>
      <Main />
    </AuthProvider>
  );
}


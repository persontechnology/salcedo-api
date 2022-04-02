import React from 'react'
import { Button, View,Text } from 'react-native';
import { createDrawerNavigator } from '@react-navigation/drawer';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import PantallaInicio from './src/PantallaInicio';
import PantallaTurismo from './src/PantallaTurismo';
import MyCarousel from './src/MyCarousel';
import PantallaComentarios from './src/PantallaComentarios';
import { AuthProvider, useAuth } from './Auth';
import { Divider, TextInput } from 'react-native-paper';
import Login from './src/Login';
import PantallaReservacion from './src/PantallaReservacion';
import PantallaMisReservaciones from './src/PantallaMisReservaciones';
import PantallaMisLugares from './src/PantallaMisLugares';
import PantallaListaReserva from './src/PantallaListaReserva';
import AcercaDe from './src/AcercaDe';

const Drawer = createDrawerNavigator();
const Stack = createNativeStackNavigator();


function Root() {
  const { status, userToken } = useAuth();

  return (
    <Drawer.Navigator>
      <Drawer.Screen name="Inicio" component={PantallaInicio} />
      {
        userToken!=null?
        <>
          <Stack.Screen name="MisReservacion" options={{ title:'Mis reservaciones' }} component={PantallaMisReservaciones} />
          <Stack.Screen name="MisLugares" options={{ title:'Mis lugares' }} component={PantallaMisLugares} />
          
        </>
        :<></>
      }
      <>
      <Drawer.Screen name="Login" component={Login} />
      <Drawer.Screen name="AcercaDe" options={{ title:'Acerca de la APP' }} component={AcercaDe} />
      </>
    </Drawer.Navigator>
  );
}



function App() {
 
  return (
    <AuthProvider>
    <NavigationContainer>
    <Stack.Navigator>
      <Stack.Screen
        name="Root"
        component={Root}
        options={{ headerShown: false }}
      />
      <Stack.Screen name="Turismos" component={PantallaTurismo} />
      <Stack.Screen name="MyCarousel" component={MyCarousel} />
      <Stack.Screen name="Login" component={Login} />
      <Stack.Screen name="Comentarios" component={PantallaComentarios} />
      <Stack.Screen name="Reservacion" options={{ title:'Realizar reservación' }} component={PantallaReservacion} />
      <Stack.Screen name="ListaReservaciones" options={{ title:'Lista de reservas' }} component={PantallaListaReserva} />
      
    </Stack.Navigator>
  </NavigationContainer> 
  </AuthProvider>
  )
}

export default App
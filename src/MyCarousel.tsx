import React, {useRef, useState, useEffect} from 'react';
import Carousel, {ParallaxImage} from 'react-native-snap-carousel';
import {
  View,
  
  Dimensions,
  StyleSheet,
  TouchableOpacity,
  Platform,
  Linking,
  useWindowDimensions,
  SafeAreaView, ScrollView
} from 'react-native';
import { Avatar,List,Divider,Button } from 'react-native-paper';
import RenderHtml from 'react-native-render-html';
import { Text,ListItem,Icon } from 'react-native-elements';


import { DataTable,Card,ActivityIndicator } from 'react-native-paper';
import { UrlHost } from './Server';

import { AuthProvider, useAuth } from '../Auth';


const {width: screenWidth} = Dimensions.get('window');

function MyCarousel({route,navigation}) {

  
  
  const { idTur, nombreTur } = route.params;
  navigation.setOptions({title:nombreTur});
  const carouselRef = useRef(null);

  const goForward = () => {
    carouselRef.current.snapToNext();
  };
  const goBack = () => {
    carouselRef.current.snapToPrev();
  };

  const [isLoading, setLoading] = useState(true);
  const [data, setData] = useState([]);

  const getTurismos = async () => {
    try {
      const response = await fetch(UrlHost+'turismos-detalle/'+idTur,{
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

  const { width } = useWindowDimensions();

  const renderItem = ({item, index}, parallaxProps) => {
    return (
      <View style={styles.item}>
        <ParallaxImage
          source={{uri: item.foto}}
          containerStyle={styles.imageContainer}
          style={styles.image}
          parallaxFactor={0.4}
          {...parallaxProps}
        />
      </View>
    );
  };

 const SitioWeb=()=>{
    return (
      <ListItem key={data.id} onPress={()=>{Linking.openURL(data.sitioweb).catch(err=>{alert('no')})}} bottomDivider>
        <Icon name='rowing' />
        <ListItem.Content>
          <ListItem.Title>{data.sitioweb}</ListItem.Title>
          <ListItem.Subtitle>sitio web</ListItem.Subtitle>

        </ListItem.Content>
        <ListItem.Chevron />
      </ListItem>
    )
 }

 const Telefono=()=>{
  return (
  <>
  <ListItem key={data.id} onPress={()=>{Linking.openURL('https://api.whatsapp.com/send?phone='+data.telefono).catch(err=>{alert('no')})}} bottomDivider>
    <Icon name='phone' />
    <ListItem.Content>
      <ListItem.Title>{data.telefono}</ListItem.Title>
      <ListItem.Subtitle>Teléfono</ListItem.Subtitle>

    </ListItem.Content>
    <ListItem.Chevron />
    
  </ListItem>
    <Text></Text>
  </>
  )
}

const Mapa=()=>{
  return (
    <Button icon="map-marker"  mode="outlined" onPress={() => {Linking.openURL('http://maps.google.com/maps?q='+data.latitud+','+data.longitud)}}>
      Ver ubicación
    </Button>
  )
}
const Comentario=()=>{
  return(
    <Button color="green" icon="comment-processing-outline" style={{ marginTop:5 }} mode="outlined" 
    onPress={() => navigation.navigate('Comentarios',{idTur:data.id,idUser:data.user.id})}>
      {data.comentarios}
    </Button>
  )
}

const Reservacion=()=>{
  return(
    <Button icon="application-export" color="green" style={{ marginTop:5 }} mode="outlined" 
    onPress={() => navigation.navigate('Reservacion',{idTur:data.id})}>
      Reservar lugar
    </Button>
  )
}

const Detalle=()=>{
  return (
    <View style={styles.container}>

        { data.galerias.length>0?
        <>
          <Carousel
            ref={carouselRef}
            sliderWidth={screenWidth}
            sliderHeight={screenWidth}
            itemWidth={screenWidth - 60}
            data={data.galerias}
            renderItem={renderItem}
            hasParallaxImages={true}
            autoplay={true}
            enableMomentum={false}
            lockScrollWhileSnapping={true}
            loop={true}
          />
          <DataTable>
            <DataTable.Header>
              <DataTable.Title>
              </DataTable.Title>
              <DataTable.Title>
              </DataTable.Title>
              <DataTable.Title>
                <TouchableOpacity onPress={goBack}>
                <Avatar.Icon size={24} icon="arrow-left" style={{ backgroundColor:'white' }} />
              </TouchableOpacity>
              </DataTable.Title>
              <DataTable.Title numeric>
                <TouchableOpacity onPress={goForward}>
                <Avatar.Icon size={24} icon="arrow-right" style={{ backgroundColor:'white' }} />
              </TouchableOpacity>
              </DataTable.Title>
              <DataTable.Title>
              </DataTable.Title>
              <DataTable.Title>
              </DataTable.Title>
            </DataTable.Header>
          </DataTable>
          </>:<></>
          
        } 
          <Card>

          <Card.Title
            title={data.nombre}
            subtitle={data.direccion}
            left={(props) => <Avatar.Image size={34} source={{ uri:data.foto }} />}
            right={(props) => <Comentario/>}
          />
            <Card.Content>

              <List.Item
              title={data.user.name}
              description={data.user.email}
              left={props => <List.Icon {...props} icon="account" />}
            />
            <Divider/>
              {
                data.sitioweb?<SitioWeb/>:<></>
              }

              {
                data.telefono?<Telefono/>:<></>
              }

              {
                data.latitud?<Mapa/>:<></>
              }
              
            <Reservacion />
            </Card.Content>
            
          </Card>
          <Divider /> 
          <Card>
            <Card.Title title="Detalle del lugar"/>
          <RenderHtml
            source={{ html:data.detalle }}
          />
          </Card>
        </View>
  )
}

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={styles.scrollView}>
        {
          isLoading?<ActivityIndicator/>:
          <Detalle></Detalle>
        }
        
      </ScrollView>
    </SafeAreaView>

  );
}

export default MyCarousel


const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginTop:2,
    backgroundColor:'white'
  },
  scrollView: {
    marginHorizontal: 2,
    backgroundColor:'white'
  },
  item: {
    width: screenWidth - 60,
    height: screenWidth - 60,
  },
  imageContainer: {
    flex: 1,
    marginBottom: Platform.select({ios: 0, android: 1}), // Prevent a random Android rendering issue
    backgroundColor: 'white',
    borderRadius: 8,
  },
  image: {
    ...StyleSheet.absoluteFillObject,
    resizeMode: 'cover',
  },
});
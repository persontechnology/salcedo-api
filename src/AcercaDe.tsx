import React from 'react'
import { Card, Title, Paragraph } from 'react-native-paper';
import { Button, View} from 'react-native';
export default function AcercaDe({route,navigation}) {

    navigation.setOptions('Acerca de la APP');
  return (
    <View style={{ flex:1,justifyContent:'center',margin:10 }}>
        
        <Card>
        <Card.Content>
        <Title>APP TURISMO SALCEDO</Title>
        <Paragraph>
            Esta aplicación está diseñada con la finalidad de promocionar lugares turísticos del cantón SALCEDO.
        </Paragraph>
        <Paragraph>
            
        </Paragraph>
        </Card.Content>
        <Card.Content>
            
        <Paragraph>
            Copyright © 2022 Alex Cayancela. Todos los derechos reservados.
        </Paragraph>
        <Paragraph>
            
        </Paragraph>
        </Card.Content>
        <Card.Content>
        <Paragraph>
            Soporte: +593 983326478 / +593 969075934
        </Paragraph>
        <Paragraph>
            
        </Paragraph>
        </Card.Content>
        <Card.Content>
        <Paragraph>
            Versión: (1.0)
        </Paragraph>
        </Card.Content>
    </Card>
    </View>
  )
}

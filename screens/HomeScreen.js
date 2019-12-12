import React from 'react'
import { View, StyleSheet } from 'react-native'
import { User } from "../stores"
import { Button,Text,Container,Body } from "native-base"
import { observer } from "mobx-react"

@observer
export default class HomeScreen extends React.Component {

  render(){
    return (
      <Container>
        <Body>
        <View style={styles.container}>
            <Button onPress={() => { User.teste = User.teste+1}}>
              <Text>Increment! { User.teste }</Text>
            </Button>

          </View>
        </Body>
      </Container>
    );
  }
}

HomeScreen.navigationOptions = {
  header: null,
};



const styles = StyleSheet.create({
  container:{
    flex: 1,
    padding: 20,
    width:"100%"
  }
});

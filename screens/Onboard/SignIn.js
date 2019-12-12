import React from 'react'
import { View } from 'react-native'
import { User } from "../../stores"
import { Button,Text,Container,Body } from "native-base"
import { observer } from "mobx-react"
import styles from "../../styles/Onboard/Onboard.styles"

@observer
export default class SignIn extends React.Component {

  render(){
    return (
      <Container>
        <Body>
          <View style={styles.container}>
            <Button onPress={() => { User.testeFunc()}}>
                <Text>Increment {User.teste}</Text>
            </Button>
          </View>
        </Body>
      </Container>
    );
  }
}

SignIn.navigationOptions = {
  header: null,
};


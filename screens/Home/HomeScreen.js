import React from 'react'
import { View, StyleSheet } from 'react-native'
import { User } from "../../stores"
import { Button,Text,Container,Body } from "native-base"
import { observer } from "mobx-react"
import styles from "../../styles/Home/Home.styles"

@observer
export default class HomeScreen extends React.Component {

  render(){
    return (
      <Container>
        <Body>
          <View style={styles.container}>


          </View>
        </Body>
      </Container>
    );
  }
}

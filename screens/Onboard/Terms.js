import React from "react";
import { Image , TouchableOpacity} from "react-native";
import {
  Text,
  Container,
  Body,
  Content
} from "native-base";
import { observer } from "mobx-react";
import styles from "../../styles/Onboard/Onboard.styles";
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'

@observer
export default class Terms extends React.Component {

  render() {
    const logo = require("../../assets/images/logo.png");
    return (
      <Container>
        <Body style={styles.body}>
          <KeyboardAwareScrollView enableOnAndroid>
            <Content contentContainerStyle={styles.container}>
              <Image style={styles.logo} source={logo} />
              <TouchableOpacity onPress={() => { this.props.navigation.navigate("SignUp") }}>
                <Text>Continue Signup</Text>
              </TouchableOpacity>
              <Text>Lorem ipsum</Text>
            </Content>
          </KeyboardAwareScrollView>
        </Body>
      </Container>
    );
  }
}

Terms.navigationOptions = {
  header: null
};

import React from "react";
import { Image } from "react-native";
import { User } from "../../stores";
import {
  Button,
  Text,
  Container,
  Body,
  Form,
  Item,
  Input,
  Content,
  Label,
  View,
  Spinner
} from "native-base";
import { observer } from "mobx-react";
import styles from "../../styles/Onboard/Onboard.styles";

@observer
export default class SignIn extends React.Component {
  submitLogin() {
    User.login();
  }

  render() {
    const logo = require("../../assets/images/logo.png");
    return (
      <Container>
        <Body style={styles.body}>
          <Content contentContainerStyle={styles.container}>
            <Image style={styles.logo} source={logo} />
            <View style={styles.form}>
              <Form>
                <Item stackedLabel>
                  <Label>Username</Label>
                  <Input
                    onChangeText={value => (User.signInForm.email = value)}
                    returnKeyType={"next"}
                    onSubmitEditing={() => {
                      this.refs._passwordInput.wrappedInstance.focus();
                    }}
                    blurOnSubmit={false}
                  />
                </Item>
                <Item stackedLabel>
                  <Label>Password</Label>
                  <Input
                    ref="_passwordInput"
                    onChangeText={value => (User.signInForm.password = value)}
                    onSubmitEditing={() => {
                      this.submitLogin();
                    }}
                    secureTextEntry
                  />
                </Item>
              </Form>
              <View style={styles.containerButtons}>
                <Button
                  bordered
                  block
                  primary
                  disabled={User.signInForm.isLoading}
                  onPress={() => {
                    this.submitLogin();
                  }}
                >
                  {User.signInForm.isLoading && (
                    <Spinner width="30" color="blue"/>
                  )}
                  <Text>Login</Text>
                </Button>
                <Text style={styles.orText}>Or</Text>
                <Button bordered transparent block dark>
                  <Text>Sign up</Text>
                </Button>
              </View>
            </View>
          </Content>
        </Body>
      </Container>
    );
  }
}

SignIn.navigationOptions = {
  header: null
};

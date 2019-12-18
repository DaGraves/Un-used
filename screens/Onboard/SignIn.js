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
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'
import firebase from 'firebase';

@observer
export default class SignIn extends React.Component {
  async submitLogin() {
    try{
      const res = await User.login();

    }catch(e){
      console.log(e);
    }
  }

  componentDidMount(){
    firebase.auth().onAuthStateChanged( async (savedUser) => {
      if(savedUser){
        const user = await User.getCurrentUser()
        if(user){
          this.props.navigation.navigate("Home")
        }
      }
      User.signInForm.isLoadingSavedUser = false

    })
  }

  render() {
    const logo = require("../../assets/images/logo.png");
    return (
      <Container>
        <Body style={styles.body}>
          <KeyboardAwareScrollView enableOnAndroid>
            <Content contentContainerStyle={styles.container}>
              <Image style={styles.logo} source={logo} />
              {User.signInForm.isLoadingSavedUser && (
                <Spinner width="50" color="blue"/>
              )}

              {!User.signInForm.isLoadingSavedUser && (
                <View style={styles.form}>
                  <Form>
                    <Item stackedLabel>
                      <Label>Email</Label>
                      <Input
                        onChangeText={value => (User.signInForm.email = value)}
                        keyboardType="email-address"
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
                      <Text>Login</Text>
                      {User.signInForm.isLoading && (
                        <Spinner width="30" color="blue"/>
                      )}
                    </Button>
                    <Text style={styles.orText}>Or</Text>
                    <Button bordered transparent block dark onPress={() => {
                      this.props.navigation.navigate("SignUp")
                    }}>
                      <Text>Sign up</Text>
                    </Button>
                  </View>
                </View>
              )}

            </Content>
          </KeyboardAwareScrollView>

        </Body>
      </Container>
    );
  }
}

SignIn.navigationOptions = {
  header: null
};

import React from "react";
import { Image,TouchableOpacity, KeyboardAvoidingView} from "react-native";
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
  Spinner,
  Thumbnail
} from "native-base";
import { observer } from "mobx-react";
import styles from "../../styles/Onboard/Onboard.styles";
import * as Permissions from 'expo-permissions';
import * as ImagePicker from 'expo-image-picker';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'

@observer
export default class SignUp extends React.Component {
  async submitRegister() {
    try{
      const res = await User.register();
      if(res.user){
        this.props.navigation.navigate("Home")
      }

    }catch(e){
      console.log(e);
    }
  }

  openLibrary = async () => {
    const { status } = await Permissions.askAsync(Permissions.CAMERA_ROLL)
    if (status === 'granted') {
      const image = await ImagePicker.launchImageLibraryAsync()
      if(!image.cancelled){
        User.signUpForm.photo = image
      }
    }
  }

  render() {
    const logo = require("../../assets/images/logo.png");
    return (
      <Container>
        <Body style={styles.body}>
          <KeyboardAwareScrollView enableOnAndroid>
            <Content contentContainerStyle={styles.container}>
              <View style={styles.form}>
                <TouchableOpacity
                  style={styles.avatarContainer}
                  onPress={this.openLibrary}
                >
                  <Thumbnail
                    style={styles.avatarImage}
                    source={{ uri: User.signUpForm.photo ? User.signUpForm.photo.uri :"" }}
                  />
                  <Text>Upload Photo</Text>
                </TouchableOpacity>
                <Form>
                  <Item stackedLabel>
                    <Label>Email</Label>
                    <Input
                      onChangeText={value => (User.signUpForm.email = value)}
                      returnKeyType={"next"}
                      keyboardType="email-address"
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
                      onChangeText={value => (User.signUpForm.password = value)}
                      onSubmitEditing={() => {
                        this.refs._usernameInput.wrappedInstance.focus();
                      }}
                      secureTextEntry
                    />
                  </Item>

                  <Item stackedLabel>
                    <Label>Username</Label>
                    <Input
                      ref="_usernameInput"
                      onChangeText={value => (User.signUpForm.username = value)}
                      onSubmitEditing={() => {
                        this.refs._bioInput.wrappedInstance.focus();
                      }}
                    />
                  </Item>

                  <Item stackedLabel>
                    <Label>Bio</Label>
                    <Input
                      ref="_bioInput"
                      onChangeText={value => (User.signUpForm.bio = value)}
                      onSubmitEditing={() => {
                        this.submitRegister();
                      }}
                    />
                  </Item>


                </Form>
                <View style={styles.containerButtons}>
                  <Button
                    bordered
                    block
                    primary
                    disabled={User.signUpForm.isLoading}
                    onPress={() => {
                      this.submitRegister();
                    }}
                  >
                    <Text>Register</Text>
                    {User.signUpForm.isLoading && (
                      <Spinner width="30" color="blue" />
                    )}
                  </Button>
                  <Text style={styles.orText}>Already have an account?</Text>
                  <Button
                    bordered
                    transparent
                    block
                    dark
                    onPress={() => {
                      this.props.navigation.navigate("SignIn");
                    }}
                  >
                    <Text>Sign In</Text>
                  </Button>
                </View>
              </View>
            </Content>
          </KeyboardAwareScrollView>
        </Body>
      </Container>
    );
  }
}

SignUp.navigationOptions = {
  header: null
};

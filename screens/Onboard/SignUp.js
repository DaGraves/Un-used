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
  Thumbnail,
  CheckBox,
  ListItem,
  Right
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
                      value={User.signUpForm.email}
                      onSubmitEditing={() => {
                        this.refs._emailPaypalInput.wrappedInstance.focus();
                      }}
                      blurOnSubmit={false}
                    />
                  </Item>

                  <Item stackedLabel>
                    <Label>Paypal Email</Label>
                      <View style={styles.row}>
                        <Input
                          style={{flex:1}}
                          ref="_emailPaypalInput"
                          onChangeText={value => (User.signUpForm.emailPaypal = value)}
                          returnKeyType={"next"}
                          value={User.signUpForm.emailPaypal}
                          keyboardType="email-address"
                          onSubmitEditing={() => {
                            this.refs._passwordInput.wrappedInstance.focus();
                          }}
                          blurOnSubmit={false}
                        />
                        <TouchableOpacity style={{flexShrink:1,justifyContent:"flex-end",alignSelf:"flex-end"}} onPress={() => { User.signUpForm.emailPaypal = User.signUpForm.email} } >
                          <Text style={{fontSize:12}}>Use same email</Text>
                        </TouchableOpacity>
                      </View>

                  </Item>

                  <Item stackedLabel>
                    <Label>Password</Label>
                    <Input
                      ref="_passwordInput"
                      value={User.signUpForm.password}
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
                      value={User.signUpForm.username}
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
                      value={User.signUpForm.bio}
                      onSubmitEditing={() => {
                        this.submitRegister();
                      }}
                    />
                  </Item>

                  <ListItem>
                    <CheckBox checked={User.signUpForm.terms} onPress={() => {User.signUpForm.terms = !User.signUpForm.terms } }/>
                    <Body>
                    <TouchableOpacity onPress={() => { this.props.navigation.navigate("Terms") }}>
                      <Text>Terms and Condition</Text>
                    </TouchableOpacity>
                    </Body>
                  </ListItem>

                </Form>
                <View style={styles.containerButtons}>
                  <Button
                    bordered
                    block
                    primary
                    disabled={User.signUpForm.isLoading || !User.signUpForm.terms}
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

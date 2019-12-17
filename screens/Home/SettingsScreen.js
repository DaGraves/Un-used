import React from "react";
import { ExpoConfigView } from "@expo/samples";
import { observer } from "mobx-react";
import { View, Text } from "react-native";
import { User } from "../../stores";
import styles from "../../styles/Home/Home.styles";
import { Button, Container, Body } from "native-base";
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'
@observer
export default class SettingsScreen extends React.Component {

  constructor(props){
    super(props)
    this.logout.bind(this)
  }
  async logout() {
    try {
      const res = await User.logout();
      console.log(this.props);

      this.props.navigation.navigate("SignIn")
    } catch (e) {
      console.log(e);
    }
  }

  render() {
    return (
      <Container>
        <Body style={styles.body}>
          <KeyboardAwareScrollView enableOnAndroid>
            <View>
              <Button onPress={() => this.logout()}>
                <Text>Logout</Text>
              </Button>
              <ExpoConfigView />
            </View>
          </KeyboardAwareScrollView>
        </Body>
      </Container>
    );
  }
}

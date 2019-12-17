import React from "react";
import { View, StyleSheet, TouchableOpacity } from "react-native";
import { User } from "../../stores";
import { Button, Text, Container, Body, Spinner, Content } from "native-base";
import { observer } from "mobx-react";
import styles from "../../styles/Home/Post.styles";
import { Camera } from "expo-camera";
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'

@observer
export default class PostScreen extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      type: "",
      hasPermissions: false,
      finishedLoading: false
    };
  }

  async componentDidMount() {
    const { status } = await Camera.requestPermissionsAsync();
    console.log(status);

    this.setState({
      hasPermissions: status === "granted",
      finishedLoading: true
    });
  }

  render() {
    return (
      <Container>
        <Body style={styles.body}>
          <KeyboardAwareScrollView enableOnAndroid>
            <Content contentContainerStyle={styles.container}>
              {!this.state.finishedLoading && (
                <View
                  style={{ alignContent: "center", justifyContent: "center" }}
                >
                  <Spinner width="100" color="blue" />
                </View>
              )}
              {this.state.finishedLoading && (
                <Camera style={{ flex: 1 }} type={this.state.type}>
                  <View style={styles.cameraWrapper}>
                    <TouchableOpacity
                      style={styles.changeType}
                      onPress={() => {
                        this.setState(prevState => {
                          prevState.type === Camera.Constants.Type.back
                            ? Camera.Constants.Type.front
                            : Camera.Constants.Type.back;
                        });
                      }}
                    >
                      <Text style={styles.flip}>Flip</Text>
                    </TouchableOpacity>
                  </View>
                </Camera>
              )}
            </Content>
          </KeyboardAwareScrollView>
        </Body>
      </Container>
    );
  }
}

PostScreen.navigationOptions = {
  header: null
};

import React from "react";
import { View, StyleSheet, TouchableOpacity, Dimensions } from "react-native";
import { Post } from "../../../stores";
import {
  Button,
  Text,
  Container,
  Body,
  Spinner,
  Content,
  Icon
} from "native-base";
import { observer } from "mobx-react";
import styles from "../../../styles/Home/Post.styles";
import { Camera } from "expo-camera";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import * as Permissions from "expo-permissions";
import * as ImagePicker from "expo-image-picker";
@observer
class PostScreen extends React.Component {
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
    this.setState({
      hasPermissions: status === "granted",
      finishedLoading: true
    });
  }

  rotateCamera() {
    this.setState({
      type:
        this.state.type === Camera.Constants.Type.back
          ? Camera.Constants.Type.front
          : Camera.Constants.Type.back
    });
  }

  async openLibrary() {
    const { status } = await Permissions.askAsync(Permissions.CAMERA_ROLL);
    if (status === "granted") {
      const image = await ImagePicker.launchImageLibraryAsync();
      if (!image.cancelled) {
        Post.createPostForm.uploadPicture = image;
        this.props.navigation.navigate("Confirm");
      }
    }
  }

  async takePicture() {
    try {
      Post.createPostForm.isLoadingPicture = true;
      let photo = await this.camera.takePictureAsync();
      Post.createPostForm.uploadPicture = photo;
      Post.createPostForm.isLoadingPicture = false;
      this.props.navigation.navigate("Confirm");
    } catch (e) {
      alert(e);
    }
  }
  render() {
    return (
      <Container>
        <Body style={styles.body}>
          <KeyboardAwareScrollView
            enableOnAndroid
            contentContainerStyle={styles.kav}
          >
            <Content contentContainerStyle={styles.container}>
              {!this.state.finishedLoading && this.state.hasPermissions && (
                <View
                  style={{ alignContent: "center", justifyContent: "center" }}
                >
                  <Spinner width="100" color="blue" />
                </View>
              )}
              {this.state.finishedLoading && !this.state.hasPermissions && (
                <View
                  style={{ alignContent: "center", justifyContent: "center" }}
                >
                  <Text>
                    Please give the application permissions to use the camera
                  </Text>
                </View>
              )}
              {this.state.finishedLoading && this.state.hasPermissions && (
                <View style={styles.cameraWrapper}>
                  <Camera
                    style={[styles.camera]}
                    type={this.state.type}
                    ref={ref => {
                      this.camera = ref;
                    }}
                  />
                  {Post.createPostForm.isLoadingPicture && (
                    <View
                      style={styles.isLoadingPicture}
                    >
                      <Spinner color="white" />
                    </View>
                  )}

                  <View style={styles.cameraActionsBottomWrapper}>
                    <TouchableOpacity
                      disabled={Post.createPostForm.isLoadingPicture}
                      style={styles.cameraActionsBottomIconWrapper}
                      onPress={() => this.rotateCamera()}
                    >
                      <Icon
                        name="rotate-left"
                        type="FontAwesome"
                        style={styles.cameraActionsBottomIcon}
                      />
                    </TouchableOpacity>

                    <TouchableOpacity
                      disabled={Post.createPostForm.isLoadingPicture}
                      style={styles.takePictureWrapper}
                      onPress={() => {
                        this.takePicture();
                      }}
                    >
                      <Icon
                        name="circle-outline"
                        type="MaterialCommunityIcons"
                        style={{ color: "#fff" }}
                        style={styles.takePicture}
                      />
                    </TouchableOpacity>

                    <TouchableOpacity
                      disabled={Post.createPostForm.isLoadingPicture}
                      style={styles.cameraActionsBottomIconWrapper}
                      onPress={() => this.openLibrary()}
                    >
                      <Icon
                        name="file-outline"
                        type="MaterialCommunityIcons"
                        style={styles.cameraActionsBottomIcon}
                      />
                    </TouchableOpacity>
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

PostScreen.navigationOptions = {
  header: null,
  tabBarVisible: false
};

export default PostScreen;

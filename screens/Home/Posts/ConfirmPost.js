import React from "react";
import {
  View,
  StyleSheet,
  TouchableOpacity,
  Dimensions,
  Image
} from "react-native";
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
class ConfirmPost extends React.Component {
  render() {
    return (
      <Container>
        <Body style={styles.body}>
          <KeyboardAwareScrollView
            enableOnAndroid
            contentContainerStyle={styles.kav}
          >
            <Content contentContainerStyle={styles.container}>
              <View style={styles.cameraWrapper}>
                <Image
                  style={styles.uploadImage}
                  source={{ uri: Post.uploadPicture.uri }}
                  loadingIndicatorSource={<Spinner color="blue" width="50" />}
                />
                <View style={styles.cameraActionsBottomWrapper}>
                  <TouchableOpacity
                    style={styles.cameraActionsBottomIconWrapper}
                    onPress={() => this.props.navigation.goBack()}
                  >
                    <Text style={styles.confirmActionText}>Cancel</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={styles.cameraActionsBottomIconWrapper}
                    onPress={() => this.props.navigation.goBack()}
                  >
                    <Text style={styles.confirmActionText}>Confirm</Text>
                  </TouchableOpacity>
                </View>
              </View>
            </Content>
          </KeyboardAwareScrollView>
        </Body>
      </Container>
    );
  }
}

ConfirmPost.navigationOptions = {
  header: null
};

export default ConfirmPost;

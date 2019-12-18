import React from "react";
import {
  View,
  StyleSheet,
  TouchableOpacity,
  Dimensions,
  Image,
  Alert
} from "react-native";
import { Post } from "../../../stores";
import {
  Button,
  Text,
  Container,
  Body,
  Spinner,
  Content,
  Form,
  Item,
  Label,
  Input,
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
  async uploadPost() {
    try {
      const res = Post.createPost();
      // TODO implement better toast messages
      Alert.alert("Post created!", "Post was successfully created", [
        { text: "OK", onPress: () => this.props.navigation.navigate("Home") }
      ]);
    } catch (e) {
      alert(e);
    }
  }
  componentDidMount() {
    if (!Post.createPostForm.uploadPicture) {
      this.props.navigation.goBack();
    }
  }

  render() {
    return (
      <Container>
        <Body style={styles.body}>
          <Content contentContainerStyle={styles.container}>
            {Boolean(Post.createPostForm.uploadPicture) && (
              <>
                <View style={{ flexGrow: 1 }}>
                  <Image
                    style={styles.uploadImage}
                    resizeMode={"contain"}
                    source={{ uri: Post.createPostForm.uploadPicture.uri }}
                    loadingIndicatorSource={<Spinner color="blue" width="50" />}
                  />
                </View>
                <View style={{ flexShrink: 1 }}>
                  <Form style={{ paddingHorizontal: 20 }}>
                    <Item stackedLabel>
                      <Label>Description</Label>
                      <Input
                        onChangeText={value =>
                          (Post.createPostForm.description = value)
                        }
                      />
                    </Item>
                  </Form>
                </View>
              </>
            )}

            {!Boolean(Post.createPostForm.uploadPicture) && (
              <Spinner
                color="blue"
                width="50"
                style={{ alignSelf: "center" }}
              />
            )}
            <View style={styles.confirmActionsBottomWrapper}>
              <Button
                danger
                disabled={Post.createPostForm.isLoading}
                style={styles.cameraActionsBottomIconWrapper}
                onPress={() => this.props.navigation.goBack()}
              >
                <Text style={styles.confirmActionText}>Cancel</Text>
              </Button>
              <Button
                primary
                disabled={Post.createPostForm.isLoading}
                style={styles.cameraActionsBottomIconWrapper}
                onPress={() => this.uploadPost()}
              >
                <Text style={styles.confirmActionText}>Confirm</Text>
                {Post.createPostForm.isLoading && (
                  <Spinner width="30" color="blue" />
                )}
              </Button>
            </View>
          </Content>
        </Body>
      </Container>
    );
  }
}

export default ConfirmPost;

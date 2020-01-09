import React from "react";
import { ExpoConfigView } from "@expo/samples";
import { observer } from "mobx-react";
import { View, Text, FlatList, Image, Dimensions } from "react-native";
import { User, Post } from "../../stores";
import styles from "../../styles/User/Profile.styles";
import { Button, Container, Body, Content, Thumbnail } from "native-base";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import moment from "moment";
import PostItem from "../../components/PostItem";
import AppHeader from "../../components/AppHeader";
import { withNavigationFocus, StackActions } from "react-navigation";

@observer
class UserProfile extends React.Component {
  constructor(props) {
    super(props);
  }

  async componentWillMount() {
    this.focusListener = this.props.navigation.addListener("didFocus", async() => {
      if (!User.selectedUser.uid) {
        User.selectedUser = await User.getCurrentUser();
      }
      this.getPosts();
    });
    this.completeTransition();
  }

  completeTransition() {
    const { navigation } = this.props;
    const parent = navigation.dangerouslyGetParent();
    navigation.dispatch(
      StackActions.completeTransition({
        key: parent.state.key,
        toChildKey: parent.state.routes[parent.state.index].key
      })
    );
  }

  componentWillUnmount() {
    // Remove the event listener
    this.focusListener.remove();
    User.selectedUser = {
      uid: "",
      email: "",
      username: "",
      bio: "",
      photo: "",
      token: null,
      followers: [],
      following: []
    };
  }

  getPosts() {
    Post.getPosts({
      uid: User.selectedUser.uid,
      date: null
    });
  }

  renderList = row => {
    return (
      <PostItem
        key={row.id}
        showProfile={false}
        showActions={false}
        user={User.user}
        post={row}
        preview
        imageHeight={(Dimensions.get("window").height * 0.55) / 3}
        cardStyles={{
          flex: 1,
          maxWidth: Dimensions.get("window").width / 3 - 15, // Width / 3 - (marginLeft and marginRight for the components)
          justifyContent: "center",
          alignSelf: "center",
          alignItems: "center",
          margin: 5,
          marginLeft: 10
        }}
      />
    );
  };

  writeTitle() {
    if (User.selectedUser.uid === User.user.uid) {
      return "My profile";
    }
    return User.selectedUser.username;
  }

  render() {
    return (
      <Container>
        <AppHeader title={this.writeTitle()} />
        <Body style={styles.body}>
          <Content contentContainerStyle={styles.container}>
          <View style={styles.headerRow}>
            <View style={[styles.center,{alignItems:"center",alignContent:"center"}]}>
              <Thumbnail source={{ uri: User.selectedUser.photoUrl }} />
            </View>
            <View style={styles.center}>
              <Text style={styles.bold}>{Post.postList.length}</Text>
              <Text>posts</Text>
            </View>
            <View style={styles.center}>
              <Text style={styles.bold}>{User.selectedUser.followers > 0 ? User.selectedUser.followers : "0"}</Text>
              <Text>followers</Text>
            </View>
            <View style={styles.center}>
              <Text style={styles.bold}>{User.selectedUser.following > 0 ? User.selectedUser.following : "0"}</Text>
              <Text>following</Text>
            </View>
          </View>

          <View style={[styles.headerRowText,{flexDirection:"column"}]}>
            <Text>{User.selectedUser.username}</Text>
            <Text>{User.selectedUser.bio}</Text>
          </View>



            {!Post.isLoadingPostList && Post.postList.length === 0 && (
              <Text style={{ marginTop: 10, alignSelf: "center" }}>
                No Posts were found
              </Text>
            )}
            <FlatList
              numColumns={3}
              onRefresh={() => {
                this.getPosts();
              }}
              refreshing={Post.isLoadingPostList}
              data={Post.postList}
              keyExtractor={item => JSON.stringify(item.id)}
              renderItem={({ item }) => this.renderList(item)}
              style={{ flex: 1 }}
            />
          </Content>
        </Body>
      </Container>
    );
  }
}

UserProfile.navigationOptions = {
  header: null
};

export default withNavigationFocus(UserProfile);

import React from "react";
import { ExpoConfigView } from "@expo/samples";
import { observer } from "mobx-react";
import { View, Text, FlatList, Image, Dimensions } from "react-native";
import { User, Post } from "../../stores";
import styles from "../../styles/User/Activity.styles";
import { Button, Container, Body, Content } from "native-base";
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

  componentWillMount() {
    this.focusListener = this.props.navigation.addListener("didFocus", () => {
      if (!User.selectedUser.uid) {
        User.selectedUser = User.user;
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
        imageHeight={(Dimensions.get("window").height * 0.55)/3}
        cardStyles={{
          flex: 1,
          maxWidth: Dimensions.get("window").width / 3 - 10, // Width / 3 - (marginLeft and marginRight for the components)
          justifyContent: "center",
          alignItems: "center",
          margin: 5
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
              keyExtractor={item => item.id}
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

import React from "react";
import {
  View,
  StyleSheet,
  Image,
  ScrollView,
  RefreshControl
} from "react-native";
import { User, Post } from "../../stores";
import {
  Button,
  Text,
  Container,
  Card,
  CardItem,
  Thumbnail,
  Icon,
  Left,
  Body,
  Right
} from "native-base";
import { observer } from "mobx-react";
import styles from "../../styles/Home/Home.styles";
import PostItem from "../../components/PostItem";
import { withNavigationFocus, StackActions} from "react-navigation";

@observer
class HomeScreen extends React.Component {
  async componentWillMount() {
    this.focusListener = this.props.navigation.addListener(
      "didFocus",
      async () => {
        Post.isLoadingPostList = true
        await User.getCurrentUser();
        await Post.getPosts();
      }
    );
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
  }

  render() {
    return (
      <Container>
        <Body>
          <ScrollView
            contentContainerStyle={styles.container}
            refreshControl={
              <RefreshControl
                refreshing={Post.isLoadingPostList}
                onRefresh={async () => {
                  await Post.getPosts();
                }}
              />
            }
          >
            {!Post.isLoadingPostList && Post.postList.length === 0 && (
              <Text>No Posts were found</Text>
            )}
            {!Post.isLoadingPostList && Post.postList.map(row => (
              <PostItem key={row.id} user={User.user} post={row} />
            ))}
          </ScrollView>
        </Body>
      </Container>
    );
  }
}

export default withNavigationFocus(HomeScreen)
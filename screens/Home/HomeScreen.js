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
@observer
export default class HomeScreen extends React.Component {

  async componentDidMount() {

    await Post.getPosts();
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
            {Post.postList.map(row => (
              <PostItem key={row.id} row={row} />
            ))}
          </ScrollView>
        </Body>
      </Container>
    );
  }
}

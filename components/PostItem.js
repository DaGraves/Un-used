import React from "react";
import {
  View,
  StyleSheet,
  Image,
  Dimensions,
  TouchableOpacity
} from "react-native";
import { User, Post } from "../stores";
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
  Right,
  Spinner
} from "native-base";
import moment from "moment";

export default function PostItem(props) {
  const post = props.post;
  const user = props.user;
  const isCompetition = props.isCompetition
  const imageHeight = Dimensions.get("window").height * 0.55;
  const likesList = isCompetition ? post.likesDay : post.likes
  const hasUserLiked = likesList ? likesList.includes(user.uid) : false;
  const likesNumber = likesList ? likesList.length : 0

  return (
    <Card style={{ width: "100%" }}>
      <CardItem>
        <Left>
          <Thumbnail source={{ uri: post.photo }} />
          <Body>
            <Text>{post.username}</Text>
            <Text note>{moment(post.date).format("ll")}</Text>
          </Body>
        </Left>
      </CardItem>
      <CardItem cardBody bordered>
        <Image
          source={{ uri: post.postPhoto }}
          resizeMode="stretch"
          loadingIndicatorSource={<Spinner color="blue" width="50" />}
          style={{ width: 100, minHeight: imageHeight, flex: 1 }}
        />
      </CardItem>
      <CardItem bordered>
        <Text>{post.postDescription}</Text>
      </CardItem>
      <CardItem bordered>
        <Left>
          <TouchableOpacity
            transparent
            onPress={async () => {
              Post.likePost(post);
            }}
          >
            <Icon
              type="Ionicons"
              style={{ color: "black" }}
              name={hasUserLiked ? "ios-heart" : "ios-heart-empty"}
            />
          </TouchableOpacity>
          <Text>{likesNumber} likes</Text>
        </Left>
      </CardItem>
    </Card>
  );
}

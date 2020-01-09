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
import LightBoxImage from "./LightBoxImage"

export default function PostItem(props) {
  const post = props.post;
  const user = props.user;
  const isCompetition = props.isCompetition;
  const imageHeight =
    typeof props.imageHeight === "undefined"
      ? Dimensions.get("window").height * 0.55
      : props.imageHeight;
  const likesList = isCompetition ? post.likesDay : post.likes;
  const hasUserLiked = likesList ? likesList.includes(user.uid) : false;
  const likesNumber = isCompetition ? post.likesDayCount : post.likesCount;
  const postedCurrentDay = moment(post.date)
    .startOf("day")
    .isSame(moment().startOf("day"));
  const showActions =
    typeof props.showActions === "undefined" ? true : Boolean(props.actions);
  const showProfile =
    typeof props.showProfile === "undefined" ? true : Boolean(props.actions);
  return (
    <Card
      style={[
        {
          width: "100%"
        },
        props.cardStyles
      ]}
    >
      {showProfile && (
        <CardItem>
          <Left>
            <Thumbnail source={{ uri: post.photo }} />
            <Body>
              <Text>{post.username}</Text>
              <Text note>{moment(post.timestamp).format("ll")}</Text>
            </Body>
          </Left>
        </CardItem>
      )}

      <CardItem cardBody bordered>
        {!props.preview && (
          <Image
            source={{ uri: post.postPhoto }}
            resizeMode="contain"
            loadingIndicatorSource={<Spinner color="blue" width="50" />}
            style={{ width: 100, minHeight: imageHeight, flex: 1 }}
          />
        )}
        {props.preview && (
          <LightBoxImage
            height={imageHeight}
            source={{
              uri: post.postPhoto
            }}
          />
        )}
      </CardItem>
      {showActions && (
        <React.Fragment>
          <CardItem bordered>
            <Text>{post.postDescription}</Text>
          </CardItem>
          {typeof props.position !== "undefined" && (
            <CardItem bordered>
              <Text>Position: {props.position}</Text>
            </CardItem>
          )}
          <CardItem bordered>
            <Left>
              <TouchableOpacity
                transparent
                disabled={isCompetition && !postedCurrentDay}
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
        </React.Fragment>
      )}
    </Card>
  );
}

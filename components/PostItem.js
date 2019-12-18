import React from "react";
import { View, StyleSheet, Image, Dimensions } from "react-native";
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
import moment from "moment"

export default function PostItem(props) {
  const row = props.row
  const imageHeight = Dimensions.get('window').height*0.55
  return (
    <Card style={{width:"100%"}}>
      <CardItem>
        <Left>
          <Thumbnail source={{ uri: row.photo }} />
          <Body>
            <Text>{row.username}</Text>
            <Text note>{moment(row.date).format("ll")}</Text>
          </Body>
        </Left>
      </CardItem>
      <CardItem cardBody bordered>
        <Image
          source={{ uri: row.postPhoto }}
          resizeMode="contain"
          loadingIndicatorSource={<Spinner color="blue" width="50" />}
          style={{ width: 100,minHeight:imageHeight, flex: 1 }}
        />
      </CardItem>
      <CardItem bordered>
        <Text>{row.postDescription}</Text>
      </CardItem>
      <CardItem bordered>
        <Left>
          <Button transparent>
            <Icon type="Ionicons" name="ios-heart-empty" />
          </Button>
        </Left>
      </CardItem>
    </Card>
  );
}

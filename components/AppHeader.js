import React from "react";
import {
  Container,
  Header,
  Left,
  Body,
  Right,
  Button,
  Icon,
  Title
} from "native-base";
import { withNavigation } from 'react-navigation';


const DefaultBody = (title) => (
  <Body style={{flex:1,alignItems:"center"}}>
    <Title>{title}</Title>
  </Body>
)

const DefaultLeft = (back) => (
  <Left style={{flexShrink:1,flex:null}}>
    <Button transparent onPress={back}>
      <Icon name="arrow-back" />
    </Button>
  </Left>
)

const DefaultRight = () => (
  <Right style={{flexShrink:1,flex:null}}>
    <Button transparent>
      <Icon name="menu" />
    </Button>
  </Right>
)

const AppHeader = (props) => {

  const back = () => {props.navigation.goBack(null)}
  const title = props.title || "Taux"
  const body = props.Body ? props.Body : DefaultBody(title)
  const left = props.Left ? props.Left : DefaultLeft(back)
  const right = props.Right ? props.Right : DefaultRight()

  return (
    <Header style={{flexDirection:"row"}}>
      {left}
      {body}
      {right}
    </Header>
  );
}


export default withNavigation(AppHeader)
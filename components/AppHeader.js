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

const AppHeader = (props) => {
  return (
    <Header>
      <Left>
        <Button transparent onPress={() => {props.navigation.goBack(null)}}>
          <Icon name="arrow-back" />
        </Button>
      </Left>
      <Body>
        <Title>Header</Title>
      </Body>
      <Right>
        <Button transparent>
          <Icon name="menu" />
        </Button>
      </Right>
    </Header>
  );
}


export default withNavigation(AppHeader)
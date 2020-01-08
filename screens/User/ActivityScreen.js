import React from "react";
import { ExpoConfigView } from "@expo/samples";
import { observer } from "mobx-react";
import { View, Text, FlatList, Image } from "react-native";
import { User, Activity } from "../../stores";
import styles from "../../styles/User/Activity.styles";
import { Button, Container, Body,Content } from "native-base";
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'
import moment from "moment"
@observer
export default class ActivityScreen extends React.Component {

  constructor(props){
    super(props)
  }

  componentDidMount(){
    Activity.getActivity()
  }

  renderList = (item) => {
    const actions = {
      UNLIKE:"Unliked",
      LIKE:"Liked"
    }

    return (
      <View style={[styles.row, styles.space]}>
        <Image style={styles.roundImage} source={{uri: item.likerPhoto}}/>
        <View style={[styles.container, styles.left]}>
          <Text style={styles.bold}>{item.likerName}</Text>
          <Text style={styles.gray}>{actions[item.type]} Your Photo</Text>
          <Text style={[styles.gray, styles.small]}>{moment(item.timestamp).format('ll')}</Text>
        </View>
        <Image style={styles.roundImage} source={{uri: item.postPhoto}}/>
      </View>
    )
  }

  render() {
    return (
      <Container>
        <Body style={styles.body}>
          <KeyboardAwareScrollView
            enableOnAndroid
            contentContainerStyle={styles.kav}>
            <Content contentContainerStyle={styles.container}>
              <FlatList
                onRefresh={async () => {
                  await this.getPosts();
                }}
                refreshing={Activity.isLoadingActivityList}
                data={Activity.activityList}
                keyExtractor={(item) => item.id}
                renderItem={({ item }) => this.renderList(item)}
                style={{flex:1}}
              />
            </Content>
          </KeyboardAwareScrollView>
        </Body>
      </Container>
    );
  }
}

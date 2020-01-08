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
  DatePicker,
  Right
} from "native-base";
import { observer } from "mobx-react";
import styles from "../../styles/Home/Home.styles";
import PostItem from "../../components/PostItem";
import AppHeader from "../../components/AppHeader";
import moment from "moment";
import _ from "lodash"
import { withNavigationFocus, StackActions} from "react-navigation";
@observer
class LeaderBoard extends React.Component {

  constructor(props){
    super(props)
    Post.isLoadingPostList = true
  }

  async componentWillMount() {
    this.focusListener = this.props.navigation.addListener("didFocus",async () => {
      Post.isLoadingPostList = true
      await User.getCurrentUser();
      await this.getPosts();
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
    Post.postDateFilter = new Date()
  }

  async getPosts() {
    await Post.getPosts({
      date:Post.postDateFilter,
      isCompetition:true,
      orderBy: [
        {
          field: "likesDayCount",
          order: "desc"
        }
      ]
    });
  }

  writeDate(date) {
    date = date || Post.postDateFilter;
    if (!date) {
      return "Select date";
    }
    return moment(date).format("YYYY-MM-DD");
  }

  render() {
    const likeNumbersOrdered = _.orderBy(_.uniq(_.map(Post.postList, 'likesDayCount')),"likesDayCount","desc")
    const likeNumbersKeyVal = {...likeNumbersOrdered}
    return (
      <Container>
        <AppHeader
          Body={
            <Body style={{ flexGrow: 1, alignItems: "center" }}>
              <DatePicker
                defaultDate={new Date()}
                maximumDate={new Date()}
                locale={"en"}
                timeZoneOffsetInMinutes={undefined}
                modalTransparent={false}
                animationType={"fade"}
                androidMode={"default"}
                placeHolderText={this.writeDate()}
                textStyle={{ color: "white" }}
                value={Post.postDateFilter}
                formatChosenDate={this.writeDate}
                placeHolderTextStyle={{ color: "white" }}
                onDateChange={async value => {
                  Post.postDateFilter = value;
                  await this.getPosts();
                }}
                disabled={false}
              />
            </Body>
          }
        />
        <Body>
          <ScrollView
            contentContainerStyle={styles.container}
            refreshControl={
              <RefreshControl
                refreshing={Post.isLoadingPostList}
                onRefresh={async () => {
                  await this.getPosts();
                }}
              />
            }
          >
            {!Post.isLoadingPostList && Post.postList.length === 0 && <Text>No Posts were found</Text>}
            {!Post.isLoadingPostList &&
              Post.postList.map(row => {
                const pos = (likeNumbersKeyVal[row.likesDayCount]) || 0
                return (
                  <PostItem
                    key={row.id}
                    user={User.user}
                    post={row}
                    position={ pos + 1}
                    isCompetition
                  />
                )
              }
            )}
          </ScrollView>
        </Body>
      </Container>
    );
  }
}

LeaderBoard.navigationOptions = {
  header: null
};

export default withNavigationFocus(LeaderBoard)
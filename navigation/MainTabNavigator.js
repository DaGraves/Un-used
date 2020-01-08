import React from "react";
import { Platform, View, Text } from "react-native";
import { createStackNavigator } from "react-navigation-stack";
import { createBottomTabNavigator } from "react-navigation-tabs";
import AppHeader from "../components/AppHeader";
import PodiumFilled from "../assets/images/podium_filled.svg"
import Podium from "../assets/images/podium.svg"

import TabBarIcon from "../components/TabBarIcon";
import HomeScreen from "../screens/Home/HomeScreen";
import LeaderBoard from "../screens/Home/LeaderBoard";
import PostScreen from "../screens/Home/Posts/PostScreen";
import ConfirmPost from "../screens/Home/Posts/ConfirmPost";
import ActivityScreen from "../screens/User/ActivityScreen";
import UserProfile from "../screens/User/UserProfile";
import SettingsScreen from "../screens/Home/SettingsScreen";
import { SvgUri } from 'react-native-svg';


const HomeStack = createStackNavigator(
  {
    Home: HomeScreen
  },
  {
    defaultNavigationOptions:{
      header:<AppHeader/>
    },
    navigationOptions: {
      tabBarLabel: <View />,
      tabBarIcon: ({ focused }) => (
        <TabBarIcon
          focused={focused}
          type="MaterialCommunityIcons"
          name={`home${focused ? "" : "-outline"}`}
        />
      )
    }
  }
);

const LeaderBoardStack = createStackNavigator(
  {
    LeaderBoard: LeaderBoard
  },
  {
    defaultNavigationOptions:{
      header:<AppHeader/>
    },
    navigationOptions: {
      tabBarLabel: <View />,
      tabBarIcon: ({ focused }) => {

        const ComponentTest = focused ? PodiumFilled : Podium
        return (
            <ComponentTest
              width="100%"
              height="100%"
            />
        )
      }

    }
  }
);

const ActivityStack = createStackNavigator(
  {
    Activity: ActivityScreen
  },
  {
    defaultNavigationOptions: {
      header: <AppHeader />
    },
    navigationOptions: {
      tabBarLabel: <View />,
      tabBarIcon: ({ focused }) => (
        <TabBarIcon
          focused={focused}
          type="Ionicons"
          name={focused ? "ios-heart" : "ios-heart-empty"}
        />
      )
    }
  }
);

const PostStack = createStackNavigator(
  {
    Post:PostScreen,
    Confirm:ConfirmPost
  },
  {
    defaultNavigationOptions: {
      header: <AppHeader />
    },
    navigationOptions: ({ navigation }) => {
      const state = navigation.state
      const currentRoute = state.routes[state.index]
      return {
        tabBarVisible:!["Post"].includes(currentRoute.routeName),
        tabBarLabel: <View/>,
        tabBarIcon: ({ focused }) => (
          <TabBarIcon
            focused={focused}
            type={"Ionicons"}
            name={`ios-add-circle${focused ? "" : "-outline"}`}
          />
        )
      }
    }
  }
);

const UserStack = createStackNavigator(
  {
    UserProfile: UserProfile
  },
  {
    defaultNavigationOptions:{
      header:<AppHeader/>
    },
    navigationOptions: {
      tabBarLabel: <View />,
      tabBarIcon: ({ focused }) => (
        <TabBarIcon
          focused={focused}
          type="FontAwesome"
          name={`user${focused ? "" : "-o"}`}
        />
      )
    }
  }
);

const tabNavigator = createBottomTabNavigator({
  HomeStack,
  LeaderBoardStack,
  ActivityStack,
  PostStack,
  UserStack
});

export default tabNavigator;

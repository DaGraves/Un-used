import React from "react";
import { Platform, View } from "react-native";
import { createStackNavigator } from "react-navigation-stack";
import { createBottomTabNavigator } from "react-navigation-tabs";
import AppHeader from "../components/AppHeader";

import TabBarIcon from "../components/TabBarIcon";
import HomeScreen from "../screens/Home/HomeScreen";
import PostScreen from "../screens/Home/PostScreen";
import SettingsScreen from "../screens/Home/SettingsScreen";

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

const SearchStack = createStackNavigator(
  {
    Search: SettingsScreen
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
          type={focused ? "FontAwesome" : "Feather"}
          name="search"
        />
      )
    }
  }
);

const PostStack = createStackNavigator(
  {
    Post: PostScreen
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
          type={"Ionicons"}
          name={`ios-add-circle${focused ? "" : "-outline"}`}
        />
      )
    }
  }
);

const SettingsStack = createStackNavigator(
  {
    Settings: SettingsScreen
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
          type="MaterialCommunityIcons"
          name={`settings${focused ? "" : "-outline"}`}
        />
      )
    }
  }
);

const tabNavigator = createBottomTabNavigator({
  HomeStack,
  SearchStack,
  PostStack,
  SettingsStack
});

tabNavigator.path = "";

export default tabNavigator;

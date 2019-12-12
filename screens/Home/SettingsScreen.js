import React from 'react';
import { ExpoConfigView } from '@expo/samples';
import { observer } from "mobx-react"
import { View, Text } from "react-native"
import { User } from "../../stores"
import styles from "../../styles/Home/Home.styles"

@observer
export default class SettingsScreen extends React.Component {

  render(){
    return (
      <View>
        <ExpoConfigView />
      </View>
    );
  }
}

SettingsScreen.navigationOptions = {
  title: 'app.json',
};

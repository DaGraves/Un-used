import { StyleSheet, Dimensions } from 'react-native'
import globalStyles from "../global.styles"

const styles = StyleSheet.create({
  ...globalStyles,
  container:{
    ...globalStyles.container,
    alignItems:"center",
    padding:20
  }
});

export default styles
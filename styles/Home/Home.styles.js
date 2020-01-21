import { StyleSheet, Dimensions } from 'react-native'
import globalStyles from "../global.styles"

const styles = StyleSheet.create({
  ...globalStyles,
  container:{
    ...globalStyles.container,
    alignItems:"center",
    padding:20
  },
  circlePrize:{
    width:40,
    height:40,
    borderRadius:20,
    backgroundColor:"#ccc",
    alignContent:"center",
    alignItems:"center",
    justifyContent:"center"
  }
});

export default styles
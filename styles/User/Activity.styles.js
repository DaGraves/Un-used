import { StyleSheet, Dimensions } from 'react-native'
import globalStyles from "../global.styles"

const styles = StyleSheet.create({
  ...globalStyles,
  body: {
    flexGrow:1,
  },
  container: {
    flexGrow: 1,
    width: Dimensions.get("window").width,
  },
  space: {
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  left: {
    alignItems: 'flex-start',
  },
  bold: {
    fontWeight: 'bold',
  },
  white: {
    color: '#fff',
  },
  gray: {
    color: '#adadad',
  },
  small: {
    fontSize: 10,
  },
  roundImage: {
    width: 40,
    height: 40,
    borderRadius: 20,
    margin: 10,
    backgroundColor: '#adadad'
  }
});

export default styles
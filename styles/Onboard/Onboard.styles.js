import { StyleSheet } from "react-native";
import globalStyles from "../global.styles";

const styles = StyleSheet.create({
  ...globalStyles,
  container: {
    ...globalStyles.container,
    padding: 50,
    alignItems: "center",
    justifyContent: "center"
  },
  form: {
    ...globalStyles.form,
    flex: 2,
    alignContent:"center",
  },
  logo: {
    flex: 1,
    width: "100%",
    resizeMode: "contain"
  },
  containerButtons:{
    marginTop:10
  },
  orText: {
    marginVertical: 10,
    alignSelf: "center"
  },
  avatarContainer:{
    alignItems:"center",
  },
  avatarImage:{
    backgroundColor: '#adadad'
  }
});

export default styles;

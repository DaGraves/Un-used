import { StyleSheet } from "react-native";
import globalStyles from "../global.styles";

const styles = StyleSheet.create({
  ...globalStyles,
  container: {
    ...globalStyles.container,
    alignItems: "center",
    justifyContent: "center"
  },
  form: {
    ...globalStyles.form,
    flex: 2
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
  }
});

export default styles;

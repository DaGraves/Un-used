import { StyleSheet, Dimensions } from "react-native";

const styles = StyleSheet.create({
  body: {
    width: "100%",
    flex: 1,
    paddingTop: 30
  },
  container: {
    flexGrow: 1,
    width: Dimensions.get("window").width
  },
  form:{
    width:"100%",
  },
  row:{
    flexDirection:"row"
  },
  column:{
    flexDirection:"column"
  }
});

export default styles;

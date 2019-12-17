import { StyleSheet, Dimensions } from "react-native";
import globalStyles from "../global.styles";

const styles = StyleSheet.create({
  ...globalStyles,
  cameraWrapper: {
    flex: 1,
    backgroundColor: "transparent",
    flexDirection: "row"
  },
  changeType: {
    flex: 0.1,
    alignSelf: "flex-end",
    alignItems: "center"
  },
  flip: {
    fontSize: 18,
    marginBottom: 10,
    color: "white"
  },
  container: {
    flex: 1,
    width: Dimensions.get("window").width,
    height:Dimensions.get("window").height *0.9
  },
  body: {
    width: "100%",
    flex: 1,
    paddingTop: 0
  },
});

export default styles;

import { StyleSheet, Dimensions } from "react-native";
import globalStyles from "../global.styles";

const styles = StyleSheet.create({
  ...globalStyles,
  body: {
  },
  kav:{
    flex: 1,
  },
  container: {
    flex: 1,
    width: Dimensions.get("window").width,
  },
  cameraActionsWrapper: {
    flex: 1,
    backgroundColor: "transparent",
    flexDirection: "row",
    padding:20,
  },
  changeType: {
    flexShrink: 1,
    alignSelf: "flex-start",
    marginLeft:"auto",
  },
  cameraWrapper:{
    flex:1
  },
  camera:{
    flex:7,
  },
  uploadImage:{
    flex:7,
  },
  flip: {
    fontSize: 18,
    marginBottom: 10,
    color: "white",
    alignSelf:"flex-end"
  },

  cameraActionsBottomWrapper: {
    position:"absolute",
    bottom:0,
    left:0,
    flex:3,
    padding:10,
    backgroundColor: "rgba(0,0,0,0.7)",
    width: Dimensions.get("window").width,
    alignContent:"center",
    justifyContent:"center",
    flexDirection:"row"
  },

  takePictureWrapper: {
    justifyContent:"center",
    flexGrow:1
  },

  cameraActionsBottomIconWrapper: {
    justifyContent:"center",
    alignContent:"center",
    flex:1,
    textAlign:"center"
  },

  cameraActionsBottomIcon: {
    fontSize: 25,
    color: "white",
    alignSelf:"center",
  },

  takePicture: {
    fontSize: 75,
    color: "white",
    alignSelf:"center",
  },

  confirmActionText:{
    color:"white",
    alignSelf:"center"
  }
});

export default styles;

import { StyleSheet, Dimensions } from "react-native";
import globalStyles from "../global.styles";

const styles = StyleSheet.create({
  ...globalStyles,
  body: {
    flexGrow:1,
  },
  container: {
    flexGrow: 1,
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
    flex:1,
  },
  camera:{
    flexGrow:1,
  },
  isLoadingPicture:{
    position: "absolute",
    top:"40%",
    alignSelf: "center",
    margin:"auto",
    justifyContent:"center",
    width:100
  },
  uploadImage:{
    flexGrow:1,
    width: Dimensions.get("window").width
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

  confirmActionsBottomWrapper: {
    bottom:0,
    flexShrink:3,
    padding:10,
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
    textAlign:"center",
    marginHorizontal:10
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
  },
  headerContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  reportButton: {
    color: 'white',
    borderWidth: 1,
    borderColor: 'white',
    padding: 4,
    borderRadius: 3,
    textAlign: 'center',
    margin: 10,
    alignSelf: 'flex-end',
    shadowOffset: {
      width: 0,
      height: 0,
    },
    shadowRadius: 1.5,
    shadowColor: 'black',
    shadowOpacity: 0.8,
  },
  closeButton: {
    fontSize: 35,
    color: 'white',
    lineHeight: 40,
    width: 40,
    textAlign: 'center',
    shadowOffset: {
      width: 0,
      height: 0,
    },
    shadowRadius: 1.5,
    shadowColor: 'black',
    shadowOpacity: 0.8,
  },
});

export default styles;

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
  space: {
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  headerRow: {
    ...globalStyles.row,
    paddingHorizontal: 20,
    marginTop:20,
    alignItems: "center",
    justifyContent: "space-between",
  },
  headerRowText: {
    paddingHorizontal: 20,
    marginVertical:10,
    alignItems: "flex-start",
    justifyContent: "space-between",
  },
});

export default styles;

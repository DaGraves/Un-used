import React from "react";
import { View, Text, Image, TouchableOpacity } from "react-native";
import Lightbox from "react-native-lightbox";
import styles from "../styles/Home/Post.styles";
import FullWidthImage from "react-native-fullwidth-image";
import { Spinner } from "native-base";
const activeProps = {
  resizeMode: "contain",
  flex: 1,
  width: null,
  backgroundColor: "red"
};

const LightBoxHeader = ({ close }) => {
  return (
    <View style={styles.headerContainer}>
      <TouchableOpacity onPress={close}>
        <Text style={styles.closeButton}>×</Text>
      </TouchableOpacity>
    </View>
  );
};

class LightBoxImage extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      isOpen: false
    };
  }
  render() {
    const { source, style, height, ...others } = this.props;

    let imgStyles = {
      resizeMode: "contain",
      backgroundColor: "red",
      height: height,
      width: 100
    };
    if (this.state.isOpen) {
      imgStyles = activeProps;
    }
    return (
      <Lightbox
        style={{ flex: 1 }}
        springConfig={{ overshootClamping: true }}
        onOpen={() => {
          this.setState({ isOpen: true });
        }}
        onClose={() => {
          this.setState({ isOpen: false });
        }}
        renderHeader={close => <LightBoxHeader close={close} {...others} />}
      >
        <FullWidthImage
          source={source}
          height={height}
          loadingIndicatorSource={<Spinner color="blue" width="50" />}
          style={{
            width: "100%",
            height: "100%"
          }}
          resizeMode={this.state.isOpen ? "contain" : "cover"}
          ratio={1}
        />
      </Lightbox>
    );
  }
}

export default LightBoxImage;

import React from "react"
import PropTypes from "prop-types"
import { Animated, View, StyleSheet, Image, Easing } from "react-native"
import Icon from "react-native-vector-icons/Entypo"

// ----------------------------------------------------------------------------

export default class NetworkImage extends React.Component {
  static propTypes = {
    uri: PropTypes.string,
    style: PropTypes.any,
    coverStyle: PropTypes.any,
    aspectRatio: PropTypes.number,
    renderCover: PropTypes.func,
    renderImage: PropTypes.func,
  }

  static defaultProps = {}

  // -------------------------------------

  state = {
    shouldAnimateOnLoad: false,
    loadDidFail: false,
    iconOpacity: new Animated.Value(1),
    coverOpacity: new Animated.Value(1),
  }

  // -----------------------------------

  startIconAnimation = () => {
    const { iconOpacity } = this.state
    Animated.loop(
      Animated.sequence([
        Animated.timing(iconOpacity, {
          toValue: 0.7,
          easing: Easing.ease,
          duration: 500,
        }),
        Animated.timing(iconOpacity, {
          toValue: 1,
          easing: Easing.ease,
          duration: 500,
        }),
      ])
    ).start()
  }

  stopIconAnimation = () => {
    const { iconOpacity } = this.state
    Animated.timing(iconOpacity).stop()
  }

  onProgress = ({ nativeEvent: { loaded, total } }) => {
    const { shouldAnimateOnLoad } = this.state
    if (!shouldAnimateOnLoad && loaded < total) {
      this.setState({ shouldAnimateOnLoad: true })
    }
  }

  onLoad = () => {
    const { shouldAnimateOnLoad, coverOpacity } = this.state
    if (shouldAnimateOnLoad) {
      this.setState({ shouldAnimateOnLoad: false })
      Animated.timing(coverOpacity, {
        toValue: 0,
        duration: 250,
      }).start()
    } else {
      Animated.timing(coverOpacity, {
        toValue: 0,
        duration: 0,
      }).start()
    }
  }

  onError = () => {
    this.setState({
      loadDidFail: true,
    })
  }

  // -------------------------------------

  renderCover = () => {
    const { renderCover } = this.props
    const { iconOpacity, loadDidFail } = this.state

    if (renderCover) {
      return renderCover(loadDidFail)
    } else {
      const iconName = loadDidFail ? "circle-with-cross" : "image-inverted"
      return (
        <Animated.View style={[{ opacity: iconOpacity }, styles.iconContainer]}>
          <Icon style={styles.icon} name={iconName} size={120} />
        </Animated.View>
      )
    }
  }

  // -------------------------------------

  renderImage = () => {
    const { uri, renderImage } = this.props

    const imageProps = {
      resizeMode: "contain",
      style: styles.image,
      source: { uri },
      onLoadStart: event => this.startIconAnimation(),
      onLoadEnd: event => this.stopIconAnimation(),
      onProgress: event => this.onProgress(event),
      onLoad: event => this.onLoad(event),
      onError: event => this.onError(event),
    }

    if (renderImage) {
      return renderImage(imageProps)
    } else {
      return <Image {...imageProps} />
    }
  }

  // -----------------------------------

  render() {
    const { style, coverStyle, uri, aspectRatio } = this.props
    const { coverOpacity } = this.state

    const aspectRatioStyle = {}
    if (aspectRatio) {
      aspectRatioStyle.aspectRatio = aspectRatio
    }

    let content
    if (uri) {
      content = (
        <View style={[styles.root, aspectRatioStyle, style]}>
          {this.renderImage()}

          <Animated.View
            style={[styles.cover, coverStyle, { opacity: coverOpacity }]}
          >
            {this.renderCover()}
          </Animated.View>
        </View>
      )
    } else {
      content = (
        <View style={[styles.root, aspectRatioStyle, style]}>
          <Icon style={styles.icon} name="circle-with-cross" size={120} />
        </View>
      )
    }

    return content
  }
}

// ----------------------------------------------------------------------------

const styles = StyleSheet.create({
  root: {
    flex: 1,
    justifyContent: "center",
    alignItems: "stretch",
  },
  image: {
    flex: 1,
  },
  cover: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: "center",
    overflow: "hidden",
  },
  iconContainer: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: "center",
    backgroundColor: "transparent",
  },
  icon: {
    color: "#e4e4e4",
    alignSelf: "center",
  },
})

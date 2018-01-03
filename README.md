# react-native-network-image

React native component which show an image derived from an uri, with loading cover animation and error cover if a network error occurred.



Features:

* Uses a render cover prop (which is better than a higher order component).
* Uses a render image prop (which is better than a higher order component).
* Provides an animation during image loading.
* Provides an error icon if loading fails.
* Provides custom image aspect ratio.



## Installation

```
npm install @discontinuity/react-native-network-image
```

## Usage

```js
export class MyImageComponent extends React.Component {
 import React from "react"
 import {
  View,
 } from "react-native"

 import FastImage from "react-native-fast-image"
 import NetworkImage from "@discontinuity/react-native-network-image"
  

  render() {
    const { item } = this.props
    const WIDTH = Dimensions.get("window").width
    const aspectRatio = WIDTH / (WIDTH * 0.5)

    return (
        <View>
          <NetworkImage
            coverStyle={{ backgroundColor: "#f8f8f8" }}
            renderImage={imageProps => {
              return <FastImage {...imageProps}/>
            }}
            uri={item.image}
            aspectRatio={aspectRatio}
          />
       </View>
    )
  }
}
```

## Props

| Name        | Description                      | Default |
| ----------- | -------------------------------- | ------- |
| uri         | Image uri                        | `""`    |
| style       | Container style                  | {}      |
| coverStyle  | Custom style for image cover     | {}      |
| aspectRatio | Image aspect ratio               |         |
| renderCover | The function to render the cover |         |
| renderImage | The function to render the image |         |

## Credits

Copyright (c) 2018 Discontinuity s.r.l.
Available under the MIT license.

# [react-native-animated-pull-to-refresh](https://www.npmjs.com/package/react-native-animated-pull-to-refresh)
[![Build Status](https://travis-ci.org/joemccann/dillinger.svg?branch=master)](https://travis-ci.org/joemccann/dillinger)
![Supports Android and iOS](https://img.shields.io/badge/platforms-android%20|%20ios-lightgrey.svg?style=flat-square)
[![License](http://img.shields.io/:license-mit-blue.svg?style=flat-square)](https://github.com/Blitz-Mobile-Apps/react-native-animated-pull-to-refresh/blob/master/LICENSE)
[![NPM](https://img.shields.io/npm/dm/react-native-animated-pull-to-refresh)](https://www.npmjs.com/package/react-native-animated-pull-to-refresh)
[![Version](https://img.shields.io/npm/v/react-native-animated-pull-to-refresh)](https://www.npmjs.com/package/react-native-animated-pull-to-refresh)

React-Native-Animated-Pull-To-Refresh is an open source package which is developed to provide a custom pull to refresh feature to the developers. It is pretty easy to use, go through the documentation to help you get started.

### Installation
##### First Step:
If you prefer **npm**,
```sh
$ npm install react-native-animated-pull-to-refresh --save
```
If you prefer **yarn**,
```sh
$ yarn add react-native-animated-pull-to-refresh
```
##### Second Step:
Lottie by **Airbnb** needs to be installed. For more details, visit: https://github.com/react-native-community/lottie-react-native
```sh
$ npm i --save lottie-react-native
$ npm i --save lottie-ios@3.1.8
```
or
```sh
$ yarn add lottie-react-native
$ yarn add lottie-ios@3.1.8
```
Additional for iOS:
```sh
$ cd ios
$ pod install
```

### Demo
#### Scrollview 
![](https://raw.githubusercontent.com/Blitz-Mobile-Apps/react-native-animated-pull-to-refresh/master/gifs/scrollview.gif)

#### FlatList with multiple animations 
![](https://raw.githubusercontent.com/Blitz-Mobile-Apps/react-native-animated-pull-to-refresh/master/gifs/flatlist.gif)

### Usage
More examples can be found under the **examples** folder.
```jsx
import React from 'react';
import { Text, View, Dimensions, ScrollView, FlatList } from 'react-native' 
import AnimatedPullToRefresh from 'react-native-animated-pull-to-refresh'

 const vw = Dimensions.get('window').width * 0.01
 const vh = Dimensions.get('window').height * 0.01

class App extends React.Component {


  constructor(props) {
    super(props)
    this.state = {
      mockData: [
        'Test 1', 'Test 2', 'Test 3', 'Test 4', 'Test 5', 'Test 6', 'Test 7', 'Test 8', 'Test 9', 'Test 10',
        'Test 11', 'Test 12', 'Test 13', 'Test 14', 'Test 15', 'Test 16', 'Test 17', 'Test 18', 'Test 19', 'Test 20'
      ],
      isRefreshing: false,
    }

  }


  componentDidMount() {
    setTimeout(this.onRefresh)
  }


  _renderItem = (title, key) => {

    return <View style={{
        paddingHorizontal: 8,
        paddingVertical: 10,
        justifyContent: 'center',
        borderWidth: 0.2
    }}
        key={key}
    >
        <Text>{title}</Text>
    </View>
}


  _renderList = () => {

    return this.state.mockData.map((title, index) => {
      return this._renderItem(title, index)
    })
  }


  onRefresh = () => {

    this.setState({ isRefreshing: true });
 
    setTimeout(() => {
      this.setState({ isRefreshing: false });
    }, 3000);

  }

  render() {
    return (

      <AnimatedPullToRefresh
        isRefreshing={this.state.isRefreshing}
        onRefresh={this.onRefresh}
        pullHeight={10 * vh}
        backgroundColor={'#5DADE2'}
        renderElement={
            <ScrollView>
                {
                    this._renderList()
                }
            </ScrollView>
        } 
        duration={2500}

        pullAnimationSource={yourAnimation}
        startRefreshAnimationSource={yourAnimation}
        refreshAnimationSource={yourAnimation}
        endRefreshAnimationSource={yourAnimation}

      />

    );
  }

};

export default App;
```
### More Props
| Name      | Description | Accepted Values | Platform (ios or android) | Required 
| :----:       |    :----:   |     :----: |     :----: |     :----: |
| isRefreshing      | A boolean indicating whether to start the animation or not       | boolean  | both | Yes
| onRefresh   | A callback function which triggers the refresh.| A call back function  | both | Yes
| pullHeight   | Height of the refreshing area.( or Pull Distance )| number  | both | No
| backgroundColor   | Color to set as the background of refreshing area| Any Hex  | both | No
| renderElement   | React-Native element to render, such as ScrollView or FlatList | ScrollView or FlatList  | both | Yes
| duration   | Duration for the animation running while refreshing| number  | both | No
| pullAnimationSource   | Animation which will run when pulling the view down| Animation json  | both | Yes
| startRefreshAnimationSource   |Animation which will run after the view is pulled down and released| Animation json  | both | Yes
| refreshAnimationSource   | Animation which will run while refreshing| Animation json  | both | Yes
| endRefreshAnimationSource   | Animation which will run when refreshing is changed to false| Animation json  | both | Yes

### Todos
We aim to make this package even more robust and powerful by adding following features in the upcoming releases:
 - Refresh area background color change as we pull it down or release


License
----

- [MIT](https://github.com/Blitz-Mobile-Apps/react-native-animated-pull-to-refresh/blob/master/LICENSE)
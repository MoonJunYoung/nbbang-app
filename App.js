import React from "react";
import {
  BackHandler,
  StyleSheet,
  View,
  Platform,
  Linking,
  Share,
} from "react-native";
import { WebView } from "react-native-webview";
import { StatusBar } from "expo-status-bar";
import Constants from "expo-constants";

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: Constants.statusBarHeight,
  },
});

class App extends React.Component {
  constructor(props) {
    super(props);
    this.webview = React.createRef();
    this.state = {
      currentUrl: "https://nbbang.life/",
      canGoBack: false,
    };
  }

  componentDidMount() {
    BackHandler.addEventListener("hardwareBackPress", this.handleBackPress);
  }

  componentWillUnmount() {
    BackHandler.removeEventListener("hardwareBackPress", this.handleBackPress);
  }

  handleBackPress = () => {
    const { currentUrl, canGoBack } = this.state;

    if (
      currentUrl === "https://nbbang.life/sign-in" ||
      currentUrl === "https://nbbang.life/sign-up"
    ) {
      this.setState({ currentUrl: "https://nbbang.life/signd" });
      return true;
    }

    if (canGoBack) {
      this.webview.current.goBack();
    } else {
      BackHandler.exitApp();
    }
    return true;
  };

  handleNavigationStateChange = (navState) => {
    const newUrl = navState.url;

    if (
      newUrl === "https://nbbang.life/" ||
      newUrl === "https://nbbang.life/signd"
    ) {
      this.setState({ currentUrl: newUrl, canGoBack: false });
    } else {
      this.setState({ currentUrl: newUrl, canGoBack: navState.canGoBack });
    }
  };

  habdleIntentRequest = (event) => {
    if (event.url.startsWith("https")) {
      return true;
    } else if (
      Platform.OS === "android" &&
      Linking.canOpenURL(event.url) &&
      event.url.startsWith("intent")
    ) {
      Linking.openURL(event.url.substring(7));
      return false;
    } else if (
      Platform.OS === "android" &&
      Linking.canOpenURL(event.url) &&
      event.url.startsWith("kakaotalk")
    ) {
      Linking.openURL(event.url);
      return false;
    } else {
      console.log(`Could not open URL: ${event.url}`);
      return false;
    }
  };

  handleMessage = async (event) => {
    console.log(event, "5325932=63840135308932410-3914=129=3921=95=");
    const { data } = event.nativeEvent;
    try {
      const message = JSON.parse(data);
      if (message.type === "share") {
        await Share.share({
          message: message.content,
        });
      }
    } catch (e) {
      console.log("Error", "Failed to parse message from WebView");
    }
  };

  render() {
    return (
      <View style={styles.container}>
        <StatusBar backgroundColor="white" style="dark" />
        <WebView
          source={{ uri: this.state.currentUrl }}
          ref={this.webview}
          onNavigationStateChange={this.handleNavigationStateChange}
          userAgent="Mozilla/5.0 (Linux; Android 10; K) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/125.0.0.0 Mobile Safari/537.36"
          originWhitelist={["intent", "https", "kakaotalk"]}
          onShouldStartLoadWithRequest={this.habdleIntentRequest}
          onMessage={this.handleMessage}
        />
      </View>
    );
  }
}

export default App;

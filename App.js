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
  webViewWrapper: {
    flex: 1,
  },
});

class App extends React.Component {
  constructor(props) {
    super(props);
    this.webview = React.createRef();
    this.state = {
      currentUrl: "https://nbbang.shop/",
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
      currentUrl === "https://nbbang.shop/sign-in" ||
      currentUrl === "https://nbbang.shop/sign-up"
    ) {
      this.setState({ currentUrl: "https://nbbang.shop/signd" });
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
      newUrl === "https://nbbang.shop/" ||
      newUrl === "https://nbbang.shop/signd"
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

  renderWebView() {
    const { currentUrl } = this.state;
    const webViewCommon = {
      source: { uri: currentUrl },
      ref: this.webview,
      onNavigationStateChange: this.handleNavigationStateChange,
      userAgent:
        "Mozilla/5.0 (Linux; Android 10; K) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/125.0.0.0 Mobile Safari/537.36",
      originWhitelist: ["intent", "https", "kakaotalk"],
      onShouldStartLoadWithRequest: this.habdleIntentRequest,
      onMessage: this.handleMessage,
    };

    // Android도 WebView 자체 스크롤을 씁니다. ScrollView로 문서 높이만큼 WebView를 키우면
    // position:fixed 모달이 뷰포트 밖에 그려져 보이지 않는 문제가 납니다.
    // pullToRefreshEnabled는 iOS 전용이라 Android에서는 새로고침은 메뉴/내비로 처리합니다.
    return (
      <WebView
        {...webViewCommon}
        style={styles.webViewWrapper}
        pullToRefreshEnabled={Platform.OS === "ios"}
      />
    );
  }

  render() {
    return (
      <View style={styles.container}>
        <StatusBar backgroundColor="white" style="dark" />
        {this.renderWebView()}
      </View>
    );
  }
}

export default App;

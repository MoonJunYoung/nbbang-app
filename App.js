import React from "react";
import {
  BackHandler,
  StyleSheet,
  View,
  Platform,
  Linking,
  Share,
  ScrollView,
  RefreshControl,
  Dimensions,
} from "react-native";
import { WebView } from "react-native-webview";
import { StatusBar } from "expo-status-bar";
import Constants from "expo-constants";

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: Constants.statusBarHeight,
    backgroundColor: "white",
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
      refreshing: false,
      webScrollY: 0,
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
      if (message?.type === "scroll") {
        const nextY = typeof message?.y === "number" ? message.y : 0;
        if (nextY !== this.state.webScrollY) {
          this.setState({ webScrollY: nextY });
        }
        return;
      }
      if (message.type === "share") {
        await Share.share({
          message: message.content,
        });
      }
    } catch (e) {
      console.log("Error", "Failed to parse message from WebView");
    }
  };

  handleRefresh = () => {
    this.setState({ refreshing: true });
    this.webview.current?.reload();
  };

  handleLoadEnd = () => {
    this.setState({ refreshing: false });
  };

  renderWebView() {
    const { currentUrl, refreshing, webScrollY } = this.state;
    const refreshEnabled = !refreshing && webScrollY <= 1;
    const injectedJavaScript = `
      (function () {
        var ticking = false;
        var lastY = -1;

        function getScrollYFromDocument() {
          var se = document.scrollingElement || document.documentElement || document.body;
          var y = 0;
          if (se && typeof se.scrollTop === 'number') y = se.scrollTop;
          // window.scrollY가 더 큰 경우가 있어 같이 반영
          if (typeof window.scrollY === 'number') y = Math.max(y, window.scrollY);
          if (document.documentElement && typeof document.documentElement.scrollTop === 'number') {
            y = Math.max(y, document.documentElement.scrollTop);
          }
          if (document.body && typeof document.body.scrollTop === 'number') {
            y = Math.max(y, document.body.scrollTop);
          }
          return y || 0;
        }

        // 사이트가 window가 아니라 특정 컨테이너(overflow:auto)를 스크롤로 쓰는 경우 대응
        function getScrollableAncestorY(el) {
          try {
            var cur = el;
            while (cur && cur !== document.documentElement && cur !== document.body) {
              if (cur && typeof cur.scrollTop === 'number' && cur.scrollHeight > cur.clientHeight) {
                var style = window.getComputedStyle(cur);
                var overflowY = style ? style.overflowY : '';
                if (overflowY === 'auto' || overflowY === 'scroll') {
                  return cur.scrollTop || 0;
                }
              }
              cur = cur.parentElement;
            }
          } catch (e) {}
          return null;
        }

        function postScroll() {
          try {
            var docY = getScrollYFromDocument();
            // 마지막 scroll 이벤트 타겟 기준으로 더 정확한 값이 있으면 반영
            var y = docY;
            if (window.__rn_lastScrollTarget) {
              var targetY = getScrollableAncestorY(window.__rn_lastScrollTarget);
              if (typeof targetY === 'number') y = Math.max(y, targetY);
            }
            if (y === lastY) return;
            lastY = y;
            window.ReactNativeWebView.postMessage(JSON.stringify({ type: "scroll", y: y }));
          } catch (e) {}
        }

        // capture 단계로 받아서(가능하면) 타겟을 확보
        window.addEventListener("scroll", function (e) {
          try {
            if (e && e.target) window.__rn_lastScrollTarget = e.target;
          } catch (err) {}
          if (ticking) return;
          ticking = true;
          window.requestAnimationFrame(function () {
            ticking = false;
            postScroll();
          });
        }, { passive: true, capture: true });

        // 일부 브라우저/레이아웃에서 scroll 이벤트가 덜 오는 케이스 보완
        window.addEventListener("touchmove", function () {
          if (ticking) return;
          ticking = true;
          window.requestAnimationFrame(function () {
            ticking = false;
            postScroll();
          });
        }, { passive: true });

        postScroll();
      })();
      true;
    `;
    const webViewCommon = {
      source: { uri: currentUrl },
      ref: this.webview,
      onNavigationStateChange: this.handleNavigationStateChange,
      onLoadEnd: this.handleLoadEnd,
      userAgent:
        "Mozilla/5.0 (Linux; Android 10; K) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/125.0.0.0 Mobile Safari/537.36",
      originWhitelist: ["intent", "https", "kakaotalk"],
      onShouldStartLoadWithRequest: this.habdleIntentRequest,
      onMessage: this.handleMessage,
      injectedJavaScript,
    };

    if (Platform.OS === "ios") {
      return (
        <WebView
          {...webViewCommon}
          style={styles.webViewWrapper}
          pullToRefreshEnabled={refreshEnabled}
        />
      );
    }

    // Android: 네이티브 pullToRefresh 미지원 → ScrollView+RefreshControl.
    // WebView 높이는 화면 한 장만 쓰고(문서 전체 높이 X) 페이지 스크롤은 WebView 내부에서 처리해
    // position:fixed 모달이 깨지지 않게 합니다.
    const { height: windowHeight } = Dimensions.get("window");
    const webViewHeight = windowHeight - Constants.statusBarHeight;

    return (
      <ScrollView
        style={styles.webViewWrapper}
        contentContainerStyle={{ flexGrow: 1, minHeight: webViewHeight }}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={this.handleRefresh}
            enabled={refreshEnabled}
          />
        }
        nestedScrollEnabled
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
        overScrollMode="never"
      >
        <WebView
          {...webViewCommon}
          style={{ height: webViewHeight }}
          nestedScrollEnabled
        />
      </ScrollView>
    );
  }

  render() {
    return (
      <View style={styles.container}>
        <StatusBar
          backgroundColor="white"
          style="dark"
          translucent={false}
        />
        {this.renderWebView()}
      </View>
    );
  }
}

export default App;

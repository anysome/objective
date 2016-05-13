/**
 * Created by Layman(http://github.com/anysome) on 16/4/13.
 */

import React from 'react';
import {StyleSheet, Navigator, TouchableOpacity, View, Text, PixelRatio} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';

import {colors, styles} from '../app';

export default class NavigatorWithBar extends React.Component {

  constructor(props) {
    super(props);
  }

  render() {
    return (
      <Navigator
        debugOverlay={false}
        navigationBar={<Navigator.NavigationBar
                                routeMapper={new NavigationBarRouteMapper()}
                                style={style.navBar}/> }
        initialRoute={{
                    component: this.props.component,
                    navigationBarHidden: this.props.navigationBarHidden,
                    title: this.props.navigationBarHidden ? '' : this.props.title,
                    passProps: {
                        frame: this.props.frame
                    }
                }}
        renderScene={(route, navigator) => {
                    return <View style={[style.scene, route.navigationBarHidden && style.sceneHidden]}>
                        <route.component title={route.title} navigator={navigator} {...route.passProps}/>
                    </View>
             }}
      />
    );
  }
}

class NavigationBarRouteMapper {

  LeftButton(route, navigator, index, navState) {
    let btnText = route.leftButtonIcon ? route.leftButtonIcon :
      route.leftButtonTitle ? <Text style={[style.navBarText, styles.link]}>{route.leftButtonTitle}</Text> :
        index === 0 ? null :
          <Icon name="chevron-left" size={24} color={colors.accent}/>;
    return (
      <TouchableOpacity style={style.navBarLeftButton}
                        onPress={() => {route.onLeftButtonPress ? route.onLeftButtonPress() : navigator.pop();} }>
        {btnText}
      </TouchableOpacity>
    );
  }

  RightButton(route, navigator, index, navState) {
    let btnText = route.rightButtonIcon ? route.rightButtonIcon :
      route.rightButtonTitle ? <Text style={[style.navBarText, styles.link]}>{route.rightButtonTitle}</Text>
        : <Icon name="android-more-vertical" size={24} color={colors.accent}/>;
    return route.onRightButtonPress ? (
      <TouchableOpacity style={style.navBarRightButton}
                        onPress={()=> route.onRightButtonPress()}>
        {btnText}
      </TouchableOpacity>
    ) : null;
  }

  Title(route, navigator, index, navState) {
    return <Text style={style.navBarTitleText}>{route.title}</Text>;
  }
}

const style = StyleSheet.create({
  navigation: {
    backgroundColor: colors.light2
  },
  navBar: {
    height: 45,
    alignItems: 'center',
    borderBottomColor: colors.border,
    borderBottomWidth: 1 / PixelRatio.get()
  },
  scene: {
    flex: 1,
    marginTop: 45,
    backgroundColor: colors.light2
  },
  sceneHidden: {
    marginTop: 0
  },
  navBarText: {
    fontSize: 14,
  },
  navBarLeftButton: {
    paddingTop: 10,
    paddingLeft: 10
  },
  navBarRightButton: {
    paddingTop: 10,
    paddingRight: 10
  },
  navBarTitleText: {
    flex: 1,
    fontSize: 16,
    marginTop: 10,
    textAlignVertical: 'center',
    color: colors.dark1
  }
});

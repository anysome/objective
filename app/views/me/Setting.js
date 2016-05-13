/**
 * Created by Layman(http://github.com/anysome) on 16/3/4.
 */
import React from 'react';
import {StyleSheet, ScrollView, View, Text, TouchableOpacity, Linking} from 'react-native';

import {analytics, styles, colors, airloy} from '../../app';

export default class Setting extends React.Component {

  constructor(props) {
    super(props);
    this.sourceLink = 'https://github.com/anysome/objective';
  }

  _logout() {
    airloy.auth.logout();
    analytics.onProfileSignOff();
  }

  _linkClick() {
    Linking.canOpenURL(this.sourceLink).then(supported => {
      if (supported) {
        Linking.openURL(this.sourceLink);
      } else {
        console.log('Don\'t know how to open URI: ' + this.sourceLink);
      }
    });
  }

  render() {
    return (
      <ScrollView>
        <TouchableOpacity style={styles.row} activeOpacity={0.5} onPress={this._logout}>
          <Text style={style.link}>退出</Text>
        </TouchableOpacity>
        <View style={styles.row}>
          <View>
            <Text>APP 代码全部开源, 欢迎上去提需求反馈或做些改进.</Text>
            <TouchableOpacity activeOpacity={0.5} onPress={() => this._linkClick()}>
              <Text style={styles.link}>{this.sourceLink}</Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    );
  }
}

const style = StyleSheet.create({
  link: {
    flex: 1,
    fontSize: 16,
    color: colors.dark1,
    textAlign: 'center'
  }
});

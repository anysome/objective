/**
 * Created by Layman(http://github.com/anysome) on 16/5/1.
 */

import React from 'react'
import {View, StyleSheet, TouchableOpacity, TouchableWithoutFeedback, Text, PixelRatio, BackAndroid} from 'react-native'
import RootSiblings from 'react-native-root-siblings'

import {colors} from '../views/styles'

const style = StyleSheet.create({
  container: {
    top: 0,
    right: 0,
    bottom: 0,
    left: 0,
    flexDirection: 'column',
    justifyContent: 'flex-end'
  },
  flex: {
    flex: 1,
    backgroundColor: 'black',
    opacity: 0.4,
  },
  row: {
    height: 50,
    backgroundColor: 'white',
    alignItems: 'center',
    justifyContent: 'center',
    borderBottomWidth: 1 / PixelRatio.get(),
    borderBottomColor: colors.border
  },
  brace: {
    height: 7,
    backgroundColor: colors.bright1
  },
  close: {
    height: 50,
    backgroundColor: 'white',
    alignItems: 'center',
    justifyContent: 'center',
    borderTopWidth: 1 / PixelRatio.get(),
    borderTopColor: colors.border
  }
});


let sheet = null;

function _closeSheet() {
  sheet && removeBack() && sheet.destroy() || (sheet = null);
}

function _androidBack() {
  sheet && sheet.destroy() || (sheet = null);
  return true;
}

function removeBack() {
  BackAndroid.removeEventListener('hardwareBackPress', _androidBack);
  return true;
}

export default class ActionSheet {

  static showActionSheetWithOptions(config, callback) {
    let options = [];
    config.options.forEach((option, i) => {
      i === config.cancelButtonIndex ? (
        options.push(
          <View key={'brace-' + i} style={style.brace} />
        ),
        options.push(
          <TouchableOpacity key={'option-' + i} style={style.close} activeOpacity={0.8} onPress={_closeSheet}>
            <Text style={{color: config.tintColor, fontWeight: 'bold'}}>{option}</Text>
          </TouchableOpacity>
        ) ):
        options.push(
          <TouchableOpacity key={'option-' + i} style={style.row} activeOpacity={0.8} onPress={() => {
            _closeSheet();
            callback(i);
          }}>
            <Text style={{color: i === config.destructiveButtonIndex ? colors.accent : config.tintColor}}>{option}</Text>
          </TouchableOpacity>
        );
    });
    sheet || ( BackAndroid.addEventListener('hardwareBackPress', _androidBack),
      sheet = new RootSiblings(
        <View style={style.container}>
          <TouchableWithoutFeedback onPress={_closeSheet}>
            <View style={style.flex}></View>
          </TouchableWithoutFeedback>
          {options}
        </View>
      )
    );
  }

  static showShareActionSheetWithOptions(options, failureCallback, successCallback) {
    // TODO
  }

};

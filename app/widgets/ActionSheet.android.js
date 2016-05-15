/**
 * Created by Layman(http://github.com/anysome) on 16/5/1.
 */

import React from 'react'
import {View, StyleSheet, TouchableOpacity, TouchableWithoutFeedback, Text, PixelRatio} from 'react-native'
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
    height: 45,
    backgroundColor: colors.light1,
    alignItems: 'center',
    justifyContent: 'center',
    borderBottomWidth: 1 / PixelRatio.get(),
    borderBottomColor: colors.border
  },
  close: {
    height: 45,
    backgroundColor: colors.light1,
    alignItems: 'center',
    justifyContent: 'center'
  }
});


let sheet = null;

function _closeSheet() {
  sheet && sheet.destroy() || (sheet = null);
}

export default class ActionSheet {

  static showActionSheetWithOptions(config: Object, callback: Function) {
    let options = [];
    config.options.forEach((option, i) => {
      i === config.cancelButtonIndex ?
        options.push(
          <TouchableOpacity key={'option-' + i} style={style.close} activeOpacity={0.8} onPress={_closeSheet}>
            <Text style={{color: config.tintColor, fontWeight: 'bold'}}>{option}</Text>
          </TouchableOpacity>
        ) :
        options.push(
          <TouchableOpacity key={'option-' + i} style={style.row} activeOpacity={0.8} onPress={() => {
            callback(i);
            _closeSheet();
          }}>
            <Text style={{color: i === config.destructiveButtonIndex ? colors.accent : config.tintColor}}>{option}</Text>
          </TouchableOpacity>
        );
    });
    sheet || (
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

  static showShareActionSheetWithOptions(options: Object, failureCallback: Function, successCallback: Function) {
    // TODO
  }

};

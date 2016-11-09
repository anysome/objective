/**
 * Created by Layman <anysome@gmail.com> (http://github.com/anysome) on 2016/11/9.
 */
import React from 'react';
import {View, StyleSheet, Image, Text} from 'react-native';
import {colors} from '../../app';

export default class Login extends React.Component {
  render() {
    return (
      <View style={style.container}>
        <Text style={style.title}>Login</Text>
      </View>
    );
  }
}

const style = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.light2,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center'
  },
  title: {
    fontSize: 40,
    fontWeight: 'bold'
  }
});

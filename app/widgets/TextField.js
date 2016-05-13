/**
 * Created by Layman(http://github.com/anysome) on 16/3/3.
 */
import React from 'react'
import {TextInput, StyleSheet} from 'react-native'
import {colors} from '../app'

export default class TextField extends React.Component {

  constructor(props) {
    let {onChangeText, flat, ...others} = props;
    super(others);
    this._input = null;
    this.value = '';
    this.onChangeText = onChangeText;
    this.flat = flat;
  }

  _changeText(text) {
    this.value = text;
    this.onChangeText && this.onChangeText(text);
  }

  focus() {
    this._input.focus();
  }

  render() {
    let style = this.flat ? styles.flat : styles.round;
    return <TextInput autoCapitalize='none'
                      autoCorrect={false}
                      clearButtonMode="while-editing"
                      placeholderTextColor={colors.light3}
                      ref={(c) => this._input = c}
      {...this.props}
                      onChangeText={(text)=>this._changeText(text)}
                      style={[style, this.props.style]}/>;
  }
}

const styles = StyleSheet.create({
  flat: {
    height: 40,
    marginTop: 5,
    color: colors.accent,
    backgroundColor: colors.light1
  },
  round: {
    height: 40,
    marginTop: 10,
    color: colors.accent,
    borderWidth: 1,
    borderColor: colors.light3,
    borderRadius: 5,
    backgroundColor: colors.light1,
    paddingLeft: 8,
    paddingRight: 8
  }
});

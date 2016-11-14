/**
 * Created by Layman(http://github.com/anysome) on 16/3/3.
 */
import React from 'react'
import {TextInput, StyleSheet} from 'react-native'
import {colors} from '../views/styles'

export default class TextField extends React.Component {

  constructor(props) {
    super(props);
    this._input = null;
    this.value = '';
    this.onChangeText = props.onChangeText;
    this.flat = props.flat;
  }

  _changeText(text) {
    this.value = text;
    this.onChangeText && this.onChangeText(text);
  }

  focus() {
    this._input.focus();
  }

  blur() {
    this._input.blur();
  }

  render() {
    let style = this.flat ? styles.flat : styles.round;
    return <TextInput autoCapitalize='none'
                      autoCorrect={false}
                      clearButtonMode="while-editing"
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
    color: colors.dark1,
    backgroundColor: 'white',
    fontSize: 20
  },
  round: {
    height: 40,
    marginTop: 10,
    color: colors.dark1,
    borderWidth: 1,
    borderColor: colors.bright2,
    borderRadius: 5,
    backgroundColor: 'white',
    paddingLeft: 8,
    paddingRight: 8,
    fontSize: 20
  }
});

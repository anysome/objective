/**
 * Created by Layman(http://github.com/anysome) on 16/3/6.
 */
import React from 'react';
import {StyleSheet} from 'react-native';
import Picker from 'react-native-wheel-picker';

import {colors} from '../views/styles';

export default class OptionsPicker extends React.Component {

  constructor(props) {
    let {visible, onValueChange, options, ...others} = props;
    super(others);
    this.onValueChange = onValueChange;
    this.options = options;
    this.others = others;
  }

  _renderOptions() {
    let children = [];
    for (let [key, value] of this.options) {
      // react-native-wheel-picker need int
      children.push(<Picker.Item key={key} label={value} value={parseInt(key)}/>);
    }
    return children;
  }

  _onValueChange(value) {
    // I need string
    this.onValueChange('' + value);
  }

  render() {
    let picker = null;
    if (this.props.visible) {
      picker = (
        <Picker {...this.others}
          style={style.picker}
          textSize={14}
          otherTextColor={colors.dark1}
          currentTextColor={colors.accent}
          selectedValue={parseInt(this.props.selectedValue)}
          onValueChange={value => this._onValueChange(value)} >
          {this._renderOptions()}
        </Picker>
      );
    }
    return picker;
  }
};

const style = StyleSheet.create({
  picker: {
    height: 150
  }
});

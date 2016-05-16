/**
 * Created by Layman(http://github.com/anysome) on 16/3/6.
 */
import React from 'react';
import Picker from 'react-native-wheel-picker';

import Objective from '../logic/Objective';
import {colors} from '../views/styles';

export default class PriorityPicker extends React.Component {

  constructor(props) {
    let {visible, small, ...others} = props;
    super(others);
    this.others = others;
    this.small = small;
  }

  _renderOptions() {
    let children = [];
    for (let [key, value] of Objective.priority) {
      if (this.small && (key < 1 || key > 3)) continue;
      children.push(<Picker.Item key={key} label={value} value={key} />);
    }
    return children;
  }

  render() {
    let picker = null;
    if (this.props.visible) {
      picker = (
        <Picker {...this.others}
          style={{height: this.small ? 120 : 150}}
          textSize={14}
          otherTextColor={colors.dark1}
          currentTextColor={colors.accent}
          selectedValue={this.props.selectedValue}>
          {this._renderOptions()}
        </Picker>
      );
    }
    return picker;
  }
};

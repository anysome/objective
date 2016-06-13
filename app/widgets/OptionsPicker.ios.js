/**
 * Created by Layman(http://github.com/anysome) on 16/3/6.
 */
import React from 'react';
import {Picker} from 'react-native';

export default class OptionsPicker extends React.Component {

  constructor(props) {
    super(props);
    let {options, ...others} = props;
    this.options = options;
    this.others = others;
  }

  _renderOptions() {
    let children = [];
    for (let [key, value] of this.options) {
      children.push(<Picker.Item key={key} label={value} value={key}/>);
    }
    return children;
  }

  render() {
    let picker = null;
    if (this.props.visible) {
      picker = (
        <Picker {...this.others} selectedValue={this.props.selectedValue}>
          {this._renderOptions()}
        </Picker>
      );
    }
    return picker;
  }
}

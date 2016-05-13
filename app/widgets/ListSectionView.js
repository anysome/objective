/**
 * Created by Layman(http://github.com/anysome) on 16/2/28.
 */
'use strict';
import React from 'react'
import {StyleSheet, TouchableOpacity, View, Text} from 'react-native'
import {colors} from '../app'

class DataSource {

  constructor(args) {
    this.id = args.id;
    this.name = args.name;
    this.datas = new Map();
    this._collapsed = false;
    this._rowIds = [];
  }

  [Symbol.iterator]() {
    return this.datas.values();
  }

  push(rowData) {
    this.datas.set(rowData.id, rowData);
    this._rowIds.push(rowData.id);
  }

  getRow(rowId) {
    //console.log('get row data === ' + JSON.stringify(this.datas.get(rowId)));
    return this.datas.get(rowId);
  }

  clear() {
    this.datas.clear();
    this._rowIds = [];
  }

  collapse() {
    this._collapsed = true;
  }

  expose() {
    this._collapsed = false;
  }

  get rowIds() {
    if (this._collapsed) {
      return [];
    } else {
      return this._rowIds;
    }
  }
}

export default class ListSectionView extends React.Component {

  static DataSource = DataSource;

  constructor(props) {
    super(props);
    this.state = {
      collapsed: false
    };
  }

  _opPress() {
    if (this.state.collapsed) {
      this.props.data.expose();
      this.setState({
        collapsed: false
      });
    } else {
      this.props.data.collapse();
      this.setState({
        collapsed: true
      });
    }
    this.props.onPress && this.props.onPress();
  }

  render() {
    // let icon = this.state.collapsed ? 'arrow-right-b' : 'arrow-down-b';
    return (
      //<TouchableOpacity onPress={()=>this._opPress()}>
      //<Icon name={icon} size={16} color={colors.light3} />
      <View style={[style.row, this.props.style]}>
        <Text style={style.title}>{this.props.data.name}</Text>
        <Text style={style.icon}>{this.props.data._rowIds.length}</Text>
      </View>
      //</TouchableOpacity>
    );
  }
}

const style = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingLeft: 24,
    paddingRight: 16,
    height: 35,
    backgroundColor: colors.light2
  },
  title: {
    flex: 1,
    marginRight: 8,
    color: colors.dark1,
    textAlign: 'right'
  },
  icon: {
    color: colors.border
  }
});

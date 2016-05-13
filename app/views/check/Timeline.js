/**
 * Created by Layman(http://github.com/anysome) on 16/3/16.
 */
import React from 'react';
import {StyleSheet, ScrollView, View, Text, ListView, PixelRatio} from 'react-native';
import moment from 'moment';

import {analytics, styles, colors, airloy, api, toast, L} from '../../app';

export default class Timeline extends React.Component {

  constructor(props) {
    let {data, ...others} = props;
    super(others);
    this.checkDaily = data;
    this.state = {
      dataSource: new ListView.DataSource({
        rowHasChanged: (row1, row2) => row1 !== row2
      })
    };
  }

  componentDidMount() {
    analytics.onPageStart('page_check_timeline');
    this.reload();
  }

  async reload() {
    let result = await airloy.net.httpGet(api.target.track, {id: this.checkDaily.checkTargetId});
    if (result.success) {
      this.setState({
        dataSource: this.state.dataSource.cloneWithRows(result.info)
      });
    } else {
      toast(L(result.message));
    }
  }

  _renderRow(rowData, sectionId, rowId) {
    return (
      <View style={style.row}>
        <Text style={style.progress}>+ {rowData.times}</Text>
        <Text style={style.progress}>{rowData.total}</Text>
        <Text style={style.hint}>{moment(rowData.checkTime).calendar()}</Text>
      </View>
    );
  }

  render() {
    return (
      <ScrollView>
        <Text style={style.title}>{this.checkDaily.title}</Text>
        <ListView
          initialListSize={10} pageSize={5}
          dataSource={this.state.dataSource}
          renderRow={(rowData, sectionId, rowId) => this._renderRow(rowData, sectionId, rowId)}
        />
      </ScrollView>
    );
  }
}


const style = StyleSheet.create({
  title: {
    margin: 10,
    color: colors.dark2,
    fontSize: 20,
    fontWeight: 'bold',
    textAlign: 'center'
  },
  row: {
    flex: 1,
    flexDirection: 'row',
    height: 35,
    paddingLeft: 16,
    paddingRight: 16,
    alignItems: 'center',
    borderBottomWidth: 1 / PixelRatio.get(),
    borderBottomColor: colors.light2,
    backgroundColor: colors.light1
  },
  round: {
    marginLeft: 20,
    marginRight: 20,
    width: 32,
    borderWidth: 5,
    borderColor: colors.accent,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  progress: {
    color: colors.dark1,
    width: 60,
    fontSize: 14,
    textAlign: 'center'
  },
  hint: {
    color: colors.border,
    fontSize: 12
  }
});

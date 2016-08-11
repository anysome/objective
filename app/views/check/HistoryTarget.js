/**
 * Created by Layman <anysome@gmail.com> (http://github.com/anysome) on 16/7/4.
 */
import React from 'react';
import {StyleSheet, ScrollView, View, Text, Image, TouchableOpacity,
  RefreshControl, ListView, PixelRatio} from 'react-native';
import moment from 'moment';

import objective from '../../logic/Objective';
import {analytics, config, airloy, styles, colors, api, L, toast} from '../../app';
import ListSource from '../../logic/ListSource';
import ActionSheet from '../../widgets/ActionSheet';

import Calendar from './Calendar';
import Timeline from './Timeline';
import Edit from './Edit';

export default class HistoryTarget extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      isRefreshing: true,
      dataSource: new ListView.DataSource({
        rowHasChanged: (row1, row2) => row1 !== row2
      })
    };
    this.listSource = new ListSource();
    this._renderRow = this._renderRow.bind(this);
  }

  componentDidMount() {
    this.reload();
  }

  async reload() {
    this.setState({
      isRefreshing: true
    });
    let result = await airloy.net.httpGet(api.target.list.history);
    if (result.success) {
      this.listSource = new ListSource(result.info);
      this.setState({
        isRefreshing: false,
        dataSource: this.state.dataSource.cloneWithRows(this.listSource.datas)
      });
    } else {
      // event emit will unmount this component
      result.message !== 'error.request.auth' && this.setState({
        isRefreshing: false
      });
      toast(L(result.message));
    }
  }

  _pressRow(rowData) {
    ActionSheet.showActionSheetWithOptions({
        options: ['打卡日历', '前进路线', '修改目标', '取消'],
        cancelButtonIndex: 3,
        tintColor: colors.dark1
      },
      async(buttonIndex) => {
        switch (buttonIndex) {
          case 3:
            break;
          case 2:
            this.props.navigator.push({
              title: '修改目标',
              component: Edit,
              rightButtonIcon: this.props.nextIcon,
              passProps: {
                data: rowData
              }
            });
            break;
          case 1:
            this.props.navigator.push({
              title: '前进路线',
              component: Timeline,
              passProps: {
                targetId: rowData.id,
                title: rowData.title
              }
            });
            break;
          default:
            this.props.navigator.push({
              title: '打卡日历',
              component: Calendar,
              passProps: {
                target: rowData
              }
            });
        }
      }
    );
  }

  _transform(target) {
    return {
      priorityColor: objective.getPriorityColor(target.priority),
      title: target.title,
      detail: target.detail,
      times: target.requiredAmount,
      unitName: objective.getUnitName(target.unit),
      frequencyName: objective.getFrequencyName(target.frequency),
      dateStart: target.dateStart,
      dateEnd: target.dateEnd
    };
  }

  _renderRow(rowData, sectionId, rowId, highlightRow) {
    var transform = this._transform(rowData);
    return (
      <TouchableOpacity style={[style.container, {borderLeftColor: transform.priorityColor}]}
                        onPress={() => this._pressRow(rowData)}>
        <Text style={styles.title}>{transform.title}</Text>
        <Text style={styles.text}>{transform.detail}</Text>
        <Text style={styles.hint}>
          {transform.frequencyName} {transform.times} {transform.unitName}
        </Text>
        <View style={style.containerF}>
          <Text style={styles.text}>{moment(transform.dateStart).format('YYYY-MM-DD')}</Text>
          <Text style={styles.text}>{moment(transform.dateEnd).format('YYYY-MM-DD')}</Text>
        </View>
      </TouchableOpacity>
    );
  }

  render() {
    return (
      <View style={styles.flex}>
        <ListView initialListSize={10}
                  pageSize={5}
                  dataSource={this.state.dataSource}
                  renderRow={this._renderRow}
                  refreshControl={<RefreshControl refreshing={this.state.isRefreshing}
                                                             onRefresh={() => this.reload()}
                                                             tintColor={colors.accent}
                                                             title="加载中..."
                                                             colors={['#ff0000', '#00ff00', '#0000ff']}
                                                             progressBackgroundColor="#EBEBEB" />}
        />
      </View>
    );
  }
}



const style = StyleSheet.create({
  container: {
    flexDirection: 'column',
    flex: 1,
    marginTop: 20,
    paddingTop: 4,
    paddingLeft: 10,
    paddingRight: 16,
    backgroundColor: colors.light1,
    borderLeftWidth: 6,
    borderLeftColor: colors.border,
    borderTopWidth: 1 / PixelRatio.get(),
    borderTopColor: colors.light3,
    borderBottomWidth: 1 / PixelRatio.get(),
    borderBottomColor: colors.light3
  },
  containerF: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingBottom: 8,
    paddingTop: 5,
    marginTop: 5,
    borderTopColor: colors.border,
    borderTopWidth: 1 / PixelRatio.get()
  }
});

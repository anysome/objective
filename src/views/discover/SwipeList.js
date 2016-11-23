/**
 * Created by Layman <anysome@gmail.com> (http://github.com/anysome) on 2016/11/23.
 */

import React from 'react';
import { StyleSheet, RefreshControl, Image, View, Text, TouchableOpacity,
  InteractionManager} from 'react-native';
import SwipeableListView from 'SwipeableListView';
import SwipeableQuickActions from 'SwipeableQuickActions';
import SwipeableQuickActionButton from 'SwipeableQuickActionButton';

import util from '../../libs/Util';
import {airloy, styles, colors, config, api, toast, L} from '../../app';
import Browser from './Browser';

export default class SwipeList extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      isRefreshing: true,
      dataSource: SwipeableListView.getNewDataSource()
    };
    this._renderRow = this._renderRow.bind(this);
  }

  componentDidMount() {
    util.isAndroid() ? InteractionManager.runAfterInteractions(() => this.reload()) : this.reload();
  }

  async reload() {
    this.setState({
      isRefreshing: true
    });
    let result = await airloy.net.httpGet(api.discover.article.list);
    if (result.success) {
      this.setState({
        isRefreshing: false,
        dataSource: this.state.dataSource.cloneWithRows(result.info)
      });
    } else {
      result.message !== 'error.request.auth' && this.setState({
        isRefreshing: false
      });
      toast(L(result.message));
    }
  }

  _pressRow(rowData) {
    this.props.navigator.push({
      title: rowData.title,
      component: Browser,
      passProps: {
        data: rowData
      }
    });
  }

  _renderRow(rowData, sectionId, rowId, highlightRow) {
    return (
      <TouchableOpacity style={styles.row} onPress={() => this._pressRow(rowData)}>
        <View style={styles.containerV}>
          <Text style={styles.title}>{rowData.title}</Text>
          <Text style={style.hint}>{rowData.subTitle}</Text>
        </View>
        <Image source={require('../../../resources/icons/forward.png')} style={styles.iconSmall} />
      </TouchableOpacity>
    );
  }

  render() {
    return <SwipeableListView enableEmptySections={true}
                              renderQuickActions={
                                <SwipeableQuickActions>
                                  <SwipeableQuickActionButton text={"Edit"} style={{backgroundColor: 'blue'}} />
                                  <SwipeableQuickActionButton text={"Remove"} style={{backgroundColor: 'red'}} />
                                </SwipeableQuickActions>
                              }
                     initialListSize={10}
                     pageSize={5}
                     dataSource={this.state.dataSource}
                     renderRow={this._renderRow}
                     refreshControl={<RefreshControl
                       refreshing={this.state.isRefreshing}
                       onRefresh={() => this.reload()}
                       tintColor={colors.accent}
                       title="加载中..."
                       colors={[colors.accent, colors.action]}
                       progressBackgroundColor={colors.bright1} />}

    />;
  }
}


const style = StyleSheet.create({
  hint: {
    flex: 1,
    fontSize: 12,
    color: colors.border
  }
});

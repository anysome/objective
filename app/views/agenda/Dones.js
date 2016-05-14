/**
 * Created by Layman(http://github.com/anysome) on 16/5/14.
 */
import React from 'react';
import {StyleSheet, View, ListView, Text, RefreshControl} from 'react-native';
import moment from 'moment';
import Icon from 'react-native-vector-icons/Ionicons';

import {analytics, airloy, styles, colors, api, toast, L} from '../../app';
import util from '../../libs/Util';
import ListSource from '../../logic/ListSource';
import ListSectionView from '../../widgets/ListSectionView';

export default class Dones extends React.Component {

  constructor(props) {
    super(props);
    this.listSource = null;
    this.circleDay = null;
    this.state = {
      isRefreshing: true,
      dataSource: new ListView.DataSource({
        getSectionHeaderData: (dataBlob, sectionId) => dataBlob[sectionId],
        getRowData: (dataBlob, sectionId, rowId) => dataBlob[sectionId].getRow(rowId),
        rowHasChanged: (row1, row2) => row1 !== row2,
        sectionHeaderHasChanged: (s1, s2) => s1 !== s2
      })
    };
    this._renderRow = this._renderRow.bind(this);
  }

  componentWillUnMount() {
    analytics.onPageEnd('page_dones');
  }

  componentDidMount() {
    analytics.onPageStart('page_dones');
    this.reload();
  }

  async reload() {
    this.setState({
      isRefreshing: true
    });
    let result = await airloy.net.httpGet(api.agenda.done.recent);
    if (result.success) {
      this.listSource = new ListSource(result.info);
      this._sortList();
      this.setState({
        isRefreshing: false
      });
    } else {
      result.message !== 'error.request.auth' && this.setState({
        isRefreshing: false
      });
      toast(L(result.message));
    }
    console.log(' load content list');
  }

  _sortList() {
    let sectionIds = [];
    let sections = [];
    let count = 0, currentSection = null;
    for (let rowData of this.listSource) {
      if ( rowData.today !== this.circleDay ) {
        this.circleDay = rowData.today;
        currentSection = new ListSectionView.DataSource({id: count, name: moment(this.circleDay).format('YYYY-MM-DD')});
        sections.push(currentSection);
        sectionIds.push(count++);
      }
      currentSection.push(rowData);
    }
    this.setState({
      dataSource: this.state.dataSource.cloneWithRowsAndSections(
        sections,
        sectionIds,
        sections.map( section => section.rowIds)
      )
    });
  }

  _renderRow(rowData, sectionId, rowId) {
    return (
      <View style={style.container}>
        <Icon size={28} name='android-checkbox' style={style.icon} color={colors.light3} />
        <View style={style.body}>
          <Text style={styles.text}>{rowData.title}</Text>
          {rowData.detail ? <Text style={style.hint}>{rowData.detail}</Text> : null}
        </View>
        <Text style={styles.hint}>{moment(rowData.doneTime).format('H:mm')}</Text>
      </View>
    );
  }

  _renderSectionHeader(sectionData, sectionId) {
    return <ListSectionView data={sectionData}/>;
  }

  _renderSeparator(sectionId, rowId, adjacentRowHighlighted) {
    return <View key={rowId + '_separator'} style={styles.hr}></View>
  }

  render() {
    return (
      <View style={styles.flex}>
        <ListView
          enableEmptySections={true}
          initialListSize={10}
          pageSize={10}
          dataSource={this.state.dataSource}
          renderRow={(rowData, sectionId, rowId) => this._renderRow(rowData, sectionId, rowId)}
          renderSectionHeader={this._renderSectionHeader}
          renderSeparator={this._renderSeparator}
          refreshControl={
                          <RefreshControl
                            refreshing={this.state.isRefreshing}
                            onRefresh={() => this.reload()}
                            tintColor={colors.accent}
                            title={'加载中...'}
                            colors={['#ff0000', '#00ff00', '#0000ff']}
                            progressBackgroundColor="#EBEBEB"
                          />}
        />
      </View>
    );
  }
}


const style = StyleSheet.create({
  container: {
    flexDirection: 'row',
    flex: 1,
    paddingRight: 16,
    paddingTop: 5,
    paddingBottom: 5,
    alignItems: 'center',
    backgroundColor: colors.light1
  },
  icon: {
    marginLeft: util.isAndroid() ? 16 : 0,
    paddingLeft: util.isAndroid() ? 0 : 16
  },
  body: {
    flex: 1,
    marginLeft: 10,
    marginRight: 5
  },
  hint: {
    marginTop: 2,
    textAlign: 'left',
    fontSize: 12,
    color: colors.border
  },
  tail: {
    alignItems: 'flex-end'
  }
});

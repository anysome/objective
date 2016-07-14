/**
 * Created by Layman <anysome@gmail.com> (http://github.com/anysome) on 16/7/14.
 */
import React from 'react';
import {StyleSheet, ScrollView, View, Text, ListView, Image} from 'react-native';
import moment from 'moment';

import {airloy, styles, colors, api, toast, L} from '../../app';

export default class Happiness extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      reward: {},
      dataSource: new ListView.DataSource({
        rowHasChanged: (row1, row2) => row1 !== row2
      })
    };
  }

  componentDidMount() {
    this.reload();
  }

  async reload() {
    let result = await airloy.net.httpGet(api.me.reward.total, null);
    if (result.success) {
      this.setState({
        reward: result.info
      });
    } else {
      toast(L(result.message));
    }
    let result2 = await airloy.net.httpGet(api.me.reward.recent, null);
    if (result2.success) {
      this.setState({
        dataSource: this.state.dataSource.cloneWithRows(result2.info)
      });
    } else {
      toast(L(result2.message));
    }
  }

  _renderRow(rowData, sectionId, rowId) {
    return (
      <View style={style.container}>
        <Text style={style.score}>{'+' + rowData.score}</Text>
        <View style={styles.containerH}>
          <Text style={styles.text}>{rowData.fruit9}</Text>
          <Image style={style.fruitSmall}
                 source={require('../../../resources/images/Apple64.png')}/>
        </View>
        <View style={styles.containerH}>
          <Text style={styles.text}>{rowData.fruit8}</Text>
          <Image style={style.fruitSmall}
                 source={require('../../../resources/images/Strawberry64.png')}/>
        </View>
        <View style={styles.containerH}>
          <Text style={styles.text}>{rowData.fruit1}</Text>
          <Image style={style.fruitSmall}
                 source={require('../../../resources/images/Pear64.png')}/>
        </View>
        <Text style={styles.hint}>{moment(rowData.today).format('YYYY-MM-DD')}</Text>
      </View>
    );
  }

  _renderSeparator(sectionId, rowId, adjacentRowHighlighted) {
    return <View key={rowId + '_separator'} style={styles.hr}></View>
  }

  render() {
    return (
      <ScrollView>
        <View style={styles.section}>
          <View style={styles.sectionRow}>
            <Text style={style.bigText}>{this.state.reward.score}</Text>
          </View>
          <View style={styles.sectionRow}>
            <View style={style.containerH}>
              <Text style={styles.text}>{this.state.reward.fruit9}</Text>
              <Image style={style.fruit}
                     source={require('../../../resources/images/Apple64.png')}/>
            </View>
            <View style={style.containerH}>
              <Text style={styles.text}>{this.state.reward.fruit8}</Text>
              <Image style={style.fruit}
                     source={require('../../../resources/images/Strawberry64.png')}/>
            </View>
            <View style={style.containerH}>
              <Text style={styles.text}>{this.state.reward.fruit1}</Text>
              <Image style={style.fruit}
                     source={require('../../../resources/images/Pear64.png')}/>
            </View>
          </View>
        </View>
        <ListView style={{marginTop: 20}} enableEmptySections={true}
                  initialListSize={10}
                  pageSize={5}
                  dataSource={this.state.dataSource}
                  renderRow={this._renderRow}
                  renderSeparator={this._renderSeparator}
        />
      </ScrollView>
    );
  }
}


const style = StyleSheet.create({
  container: {
    flexDirection: 'row',
    flex: 1,
    paddingLeft: 16,
    paddingRight: 16,
    height: 40,
    alignItems: 'center',
    backgroundColor: colors.light1
  },
  bigText: {
    color: colors.accent,
    fontSize: 48
  },
  containerH: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center'
  },
  fruit: {
    width: 24,
    height: 24,
    marginLeft: 8
  },
  hint: {
    flex: 1,
    fontSize: 12,
    color: colors.border
  },
  fruitSmall: {
    width: 16,
    height: 16,
    marginLeft: 4
  },
  score: {
    width: 80,
    color: colors.accent,
    fontSize: 14
  }
});

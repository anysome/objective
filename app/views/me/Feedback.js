/**
 * Created by Layman(http://github.com/anysome) on 16/3/4.
 */
import React from 'react';
import {StyleSheet, ScrollView, View, Text, TouchableOpacity, ListView, LayoutAnimation} from 'react-native';
import Button from 'react-native-button';
import moment from 'moment';

import {styles, colors, airloy, api, L, toast} from '../../app';
import util from '../../libs/Util';
import TextArea from '../../widgets/TextArea';
import FeedbackDetail from './FeedbackDetail';

export default class Feedback extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      input: '',
      dataSource: new ListView.DataSource({
        rowHasChanged: (row1, row2) => true
      })
    };
    this.list = [];
    this._input = null;
    this._renderRow = this._renderRow.bind(this);
  }

  componentWillUpdate(props, state) {
    if (this.state.dataSource !== state.dataSource) {
      LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    }
  }

  componentDidMount() {
    this.reload();
  }

  async reload() {
    let result = await airloy.net.httpGet(api.feedback.list, null);
    if (result.success) {
      this.list = result.info;
      this.setState({
        dataSource: this.state.dataSource.cloneWithRows(this.list)
      });
    } else {
      toast(L(result.message));
    }
  }

  async _send() {
    if (this.state.input) {
      let result = await airloy.net.httpPost(api.feedback.add, {
        content: this.state.input,
        from: 'Objective'
      });
      if (result.success) {
        this.list.unshift(result.info);
        this.setState({
          input: '',
          dataSource: this.state.dataSource.cloneWithRows(this.list)
        });
      } else {
        toast(L(result.message));
      }
    } else {
      this._input.focus();
    }
  }

  _toReply(rowData) {
    this.props.navigator.push({
      title: '回复反馈',
      component: FeedbackDetail,
      rightButtonIcon: this.props.nextIcon,
      onRightButtonPress: () => this.removeRow(rowData),
      navigationBarHidden: false,
      passProps: {
        data: rowData,
        onFeedback: (feedback) => this.updateRow(feedback)
      }
    });
  }

  async removeRow(rowData) {
    let result = await airloy.net.httpGet(api.feedback.remove, {id: rowData.id});
    if (result.success) {
      util.removeFromArray(this.list, rowData);
      this.setState({
        dataSource: this.state.dataSource.cloneWithRows(this.list)
      });
      this.props.navigator.pop();
    } else {
      toast(L(result.message));
    }
  }

  updateRow(rowData) {
    this.setState({
      dataSource: this.state.dataSource.cloneWithRows(this.list)
    });
  }

  _renderRow(rowData, sectionId, rowId) {
    return (
      <TouchableOpacity style={style.row} onPress={() => this._toReply(rowData)}>
        <Text style={styles.title}>{rowData.content}</Text>
        <View style={styles.containerF}>
          <Text style={styles.hint}>{rowData.answers + ' 回复'}</Text>
          <Text style={styles.text}>{moment(rowData.createTime).fromNow()}</Text>
        </View>
      </TouchableOpacity>
    );
  }

  _renderSeparator(sectionId, rowId, adjacentRowHighlighted) {
    return <View key={rowId + '_separator'} style={styles.separator}></View>
  }

  render() {
    return (
      <ScrollView style={styles.container} keyboardDismissMode='on-drag'>
                <TextArea
                  ref={(c)=> this._input = c}
                  value={this.state.input}
                  onChangeText={text => this.setState({input:text})}
                  placeholder="行事易，因你更美好！"
                  autoFocus={true}/>
        <Button
          style={styles.buttonText}
          containerStyle={styles.button}
          activeOpacity={0.5}
          onPress={()=>this._send()}>
          反馈
        </Button>
        <ListView style={style.list} initialListSize={10}
                  dataSource={this.state.dataSource}
                  renderRow={this._renderRow}
                  renderSeparator={this._renderSeparator}
        />
      </ScrollView>
    );
  }
}


const style = StyleSheet.create({
  list: {
    marginTop: 20
  },
  row: {
    flexDirection: 'column',
    flex: 1,
    paddingTop: 5,
    paddingBottom: 5
  },
});

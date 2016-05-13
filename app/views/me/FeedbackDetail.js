/**
 * Created by Layman(http://github.com/anysome) on 16/3/13.
 */
import React from 'react';
import {StyleSheet, ScrollView, View, Text, ListView, LayoutAnimation} from 'react-native';
import Button from 'react-native-button';
import moment from 'moment';

import {styles, colors, airloy, api, L, toast} from '../../app';

import TextArea from '../../widgets/TextArea';

export default class FeedbackDetail extends React.Component {

  constructor(props) {
    let {data, nextIcon, ...others} = props;
    super(others);
    this.state = {
      input: '',
      dataSource: new ListView.DataSource({
        rowHasChanged: (row1, row2) => row1 !== row2
      })
    };
    this.feedback = data;
    this.list = [];
    this._input = null;
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
    let result = await airloy.net.httpGet(api.feedback.fellow, {id: this.feedback.id});
    if (result.success) {
      this.list = result.info;
      this.list.unshift(this.feedback);
      this.setState({
        dataSource: this.state.dataSource.cloneWithRows(this.list)
      });
    } else {
      toast(L(result.message));
    }
  }

  async _send() {
    if (this.state.input) {
      let result = await airloy.net.httpPost(api.feedback.answer, {
        feedbackId: this.feedback.id,
        content: this.state.input
      });
      if (result.success) {
        this.list.push(result.info);
        this.feedback.answers++;
        this.props.onFeedback(this.feedback);
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

  _renderRow(rowData, sectionId, rowId) {
    return (
      <View style={style.row}>
        <Text style={styles.title}>{rowData.content}</Text>
        <View style={styles.containerF}>
          <Text style={styles.text}>{rowData.userName}</Text>
          <Text style={styles.hint}>{moment(rowData.createTime).fromNow()}</Text>
        </View>
      </View>
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
                  placeholder="再次感谢..."
                  autoFocus={true}/>
        <Button
          style={styles.buttonText}
          containerStyle={styles.button}
          activeOpacity={0.5}
          onPress={()=>this._send()}>
          回复
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

/**
 * Created by Layman(http://github.com/anysome) on 16/3/4.
 */
import React from 'react';
import {ScrollView, View, Text} from 'react-native';

import {styles, colors} from '../../app';

export default class Message extends React.Component {

  constructor(props) {
    super(props);
  }

  render() {
    return <ScrollView>
      <Text>hello</Text>
    </ScrollView>;
  }
}

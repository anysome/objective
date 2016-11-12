/**
 * Created by Layman <anysome@gmail.com> (http://github.com/anysome) on 16/7/9.
 */
import React from 'react';
import {StyleSheet, WebView, View, Text,
  TouchableOpacity, LayoutAnimation, PixelRatio} from 'react-native';

import {analytics} from '../../app';

export default class Browser extends React.Component {

  componentDidMount() {
    analytics.onPageStart('page_browser');
  }

  componentWillUnmount() {
    analytics.onPageEnd('page_browser');
  }

  render() {
    return (
      <WebView source={{uri: this.props.data.url}} />
    );
  }
}

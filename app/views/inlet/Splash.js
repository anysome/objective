/**
 * Created by Layman(http://github.com/anysome) on 16/2/20.
 */
import React from 'react';
import {View, Text} from 'react-native';
import Animatable from 'react-native-animatable';

export default class Splash extends React.Component {
  render() {
    return (
      <View style={{flex: 1, alignItems: 'center', justifyContent: 'center'}}>
        <View style={{flexDirection: 'row', alignItems: 'center', justifyContent: 'center'}}>
          <View style={{flexDirection:'column'}}>
            <Animatable.Text animation="zoomInUp" duration={1000} style={{fontSize: 30, color: 'red'}}
                             iterationCount={100} direction="alternate">
              重要
            </Animatable.Text>
            <Animatable.Text animation="zoomOutLeft" duration={1000} style={{fontSize: 36, color: 'yellow'}}
                             iterationCount={100} direction="alternate">
              有趣
            </Animatable.Text>
          </View>
          <Text style={{fontSize: 16, margin: 8, color:'gray'}}>
            的事情要
          </Text>
          <View style={{flexDirection:'column'}}>
            <Animatable.Text animation="zoomOutRight" duration={1000} style={{fontSize: 36, color: 'yellow'}}
                             iterationCount={100} direction="alternate">
              经常
            </Animatable.Text>
            <Animatable.Text animation="zoomInDown" duration={1000} style={{fontSize: 30, color: 'red'}}
                             iterationCount={100} direction="alternate">
              反复
            </Animatable.Text>
          </View>
          <Text style={{fontSize: 80, color: 'green'}}>
            做
          </Text>
        </View>
      </View>
    );
  }
}

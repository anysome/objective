/**
 * Created by Layman(http://github.com/anysome) on 16/3/11.
 */
import React from 'react';
import {StyleSheet, ScrollView, View, Text, TouchableOpacity, PixelRatio} from 'react-native';
import { AnimatedCircularProgress } from 'react-native-circular-progress';
import Button from 'react-native-button';

import {analytics, airloy, styles, colors, api, L, toast} from '../../app';
import util from '../../libs/Util';
import Objective from '../../logic/Objective';

import Edit from './Edit';
import Punch from './Punch';
import Calendar from './Calendar';
import Timeline from './Timeline';

export default class Glance extends React.Component {

  constructor(props) {
    let {data, today, nextIcon, ...others} = props;
    super(others);
    this.checkDaily = data;
    this.today = today;
    this.target = null;
    this.expectTotal = 0;
    this.state = {
      summary: '',
      progressText: '我想想...',
      progress: 0,
      tProgress: 0,
      showModal: false
    };
  }

  componentDidMount() {
    let route = this.props.navigator.navigationContext.currentRoute;
    route.rightButtonTitle = '修改';
    route.onRightButtonPress = () => {
      this.target && this.props.navigator.push({
        title: '修改目标',
        component: Edit,
        rightButtonIcon: this.props.nextIcon,
        passProps: {
          data: this.target
        }
      });
    };
    // so many bugs on android T_T
    util.isAndroid() ?
      this.props.navigator.replaceAtIndex(route, -1) :
      this.props.navigator.replace(route);
    analytics.onPageStart('page_check_glance');
    this.reload();
  }

  componentWillUnMount() {
    analytics.onPageEnd('page_check_glance');
  }

  async reload() {
    let str;
    if (this.checkDaily.frequency === '1' &&
      this.checkDaily.unit === '0') {
      str = '每天打卡';
    } else {
      str = `${Objective.getFrequencyName(this.checkDaily.frequency)} ${this.checkDaily.gross} ${Objective.getUnitName(this.checkDaily.unit)}`;
    }
    this.setState({
      summary: str
    });
    let result = await airloy.net.httpGet(api.target.read, {id: this.checkDaily.checkTargetId});
    if (result.success) {
      this.target = result.info;
      this._updateView();
    } else {
      toast(L(result.message));
    }
  }

  _updateView() {
    let dayTotal = (this.target.dateEnd - this.target.dateStart) / 86400000 + 1;

    switch (this.checkDaily.frequency) {
      case '1' :
        this.expectTotal = this.target.times * dayTotal;
        break;
      case '2' :
        this.expectTotal = parseInt(this.target.times * dayTotal / 7);
        break;
      case '3' :
        this.expectTotal = parseInt(this.target.times * dayTotal / 30.4);
        break;
      default:
        this.expectTotal = this.target.times;
    }
    let doneTotal = this.checkDaily.total + this.checkDaily.times;
    let progress = 100 * doneTotal / this.expectTotal;

    let dayLeft = (this.target.dateEnd - this.today) / 86400000 + 1;
    let dayUsedProgress = 100 * (dayTotal - dayLeft) / dayTotal
    this.setState({
      summary: `${this.state.summary}, 剩余 ${dayLeft} 天`,
      tProgress: dayUsedProgress,
      progress: progress,
      progressText: `${doneTotal} / ${this.expectTotal}`
    });
  }

  _toTimeline() {
    this.props.navigator.push({
      title: '前进路线',
      component: Timeline,
      passProps: {
        data: this.checkDaily
      }
    });
  }

  _toCalendar() {
    this.props.navigator.push({
      title: '打卡日历',
      component: Calendar,
      passProps: {
        data: this.checkDaily
      }
    });
  }

  _toPunch() {
    this.setState({
      showModal: true
    });
  }

  _doPunch(checkDaily) {
    if (checkDaily) {
      this.checkDaily = checkDaily;
      let doneTotal = this.checkDaily.total + this.checkDaily.times;
      let progress = 100 * doneTotal / this.expectTotal;
      this.setState({
        showModal: false,
        progress: progress,
        progressText: `${doneTotal} / ${this.expectTotal}`
      });
    } else {
      this.setState({
        showModal: false
      });
    }

  }

  render() {
    return (
      <ScrollView style={style.container}>

        <View>
          <View style={styles.containerC}>
            <AnimatedCircularProgress
              size={200}
              width={15}
              fill={this.state.progress}
              tintColor={colors.accent}
              backgroundColor={colors.light1}>
            </AnimatedCircularProgress>
          </View>
          <View style={style.positionC}>
            <Text style={style.hint}>{this.state.tProgress.toFixed(1)}</Text>
            <Text style={style.progress}>{this.state.progress.toFixed(1)}</Text>
            <Text style={style.hint}>{this.state.progressText}</Text>
          </View>
        </View>
        <View style={styles.containerF}>
          <Button style={style.link} containerStyle={styles.buttonRound}
                  onPress={() => this._toTimeline()}>
            时间轴
          </Button>
          <Button style={style.link} containerStyle={styles.buttonRound}
                  onPress={() => this._toCalendar()}>
            日历卡
          </Button>
        </View>
        <View style={style.row}>
          <Text style={styles.title}>{this.checkDaily.title}</Text>
          <Text style={style.summary}>{this.state.summary}</Text>
        </View>
        <Text style={styles.text}>{this.checkDaily.detail}</Text>
        {this.checkDaily.closed &&
        <View style={styles.row}>
          <Text style={style.hint}>
            今天已完全目标, 可我还想要!
          </Text>
          <TouchableOpacity onPress={() => this._toPunch()}>
            <Text style={style.link}>
              再来一打
            </Text>
          </TouchableOpacity>
        </View>
        }
        <Punch data={this.checkDaily} visible={this.state.showModal}
               onFeedback={(checkDaily) => this._doPunch(checkDaily)}/>
      </ScrollView>
    );
  }

}

const style = StyleSheet.create({
  container: {
    paddingTop: 10,
    paddingLeft: 16,
    paddingRight: 16
  },
  positionC: {
    position: 'absolute',
    height: 200,
    top: 0,
    left: 0,
    right: 0,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'transparent'
  },
  progress: {
    color: colors.accent,
    fontSize: 30,
    fontWeight: 'bold'
  },
  hint: {
    color: colors.border,
    fontSize: 14
  },
  row: {
    marginTop: 10,
    marginBottom: 5,
    paddingTop: 4,
    paddingBottom: 4,
    flexDirection: 'column',
    borderTopWidth: 1 / PixelRatio.get(),
    borderTopColor: colors.border,
    borderBottomWidth: 1 / PixelRatio.get(),
    borderBottomColor: colors.border
  },
  link: {
    fontSize: 12,
    textAlign: 'center',
    color: colors.accent
  },
  summary: {
    paddingTop: 5,
    flex: 1,
    color: colors.dark1,
    fontSize: 16,
    textAlign: 'right'
  }
});

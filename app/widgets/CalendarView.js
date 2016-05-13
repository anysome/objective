/**
 * Created by Layman(http://github.com/anysome) on 16/3/16.
 * Fork from https://github.com/roscoe054/fastui-calendar
 * Modification for styles
 */
import React from 'react'
import {StyleSheet, Text, View, PixelRatio, Dimensions, TouchableOpacity, ListView} from 'react-native'
import moment from 'moment'

import {colors} from '../app'

class CalendarHeader extends React.Component {
  render() {
    const week = ['日', '一', '二', '三', '四', '五', '六']

    return (
      <View style={ [styles.header] }>
        {week.map((day, i) =>
          <View key={i} style={ [styles.headerCell] }>
            <Text style={ [styles.headerText, {color: colors.dark1 }] }>
              {day}
            </Text>
          </View>
        )}
      </View>
    )
  }
}

class MonthBodyCell extends React.Component {
  render() {
    const {dayInfo, onPress} = this.props

    const cellDateStyle = [
      styles.monthBodyCellDate,
      dayInfo.active === 'fill'
        ? styles.activeMonthBodyCellDate
        : dayInfo.active === 'border' ? styles.activeMonthBodyCellDateBorder : null,
    ]

    const cellDateTextStyle = [
      styles.text,
      dayInfo.disabled ? styles.disabledText : null,
      dayInfo.active === 'fill' ? styles.activeMonthBodyCellDateText : null
    ]

    return (
      <TouchableOpacity style={styles.monthBodyCell} activeOpacity={1}
                        onPress={!dayInfo.disabled && onPress ? () => onPress(dayInfo) : null}>
        <View style={cellDateStyle}>
          <Text style={cellDateTextStyle}>
            {dayInfo.holiday ? dayInfo.holiday : dayInfo.dateText}
          </Text>
        </View>
        <Text style={[styles.text, styles.monthBodyCellNoteText]}>
          {dayInfo.note}
        </Text>
      </TouchableOpacity>
    )
  }
}

class MonthBody extends React.Component {
  render() {
    const {displayFormat, year, month, holiday, active, note, onPress} = this.props

    // generate day cell
    let startDay = moment().year(year).month(month).date(1),
      endDay = moment().year(year).month(month).date(1).add(1, 'month'),
      dayCells = {}

    while (endDay.isAfter(startDay, 'day')) {
      dayCells = {
        ...dayCells,
        [startDay.format(displayFormat)]: {
          date: new Date(startDay.startOf('day').valueOf()),
          dateText: startDay.date(),
          disabled: startDay.isBefore(moment().subtract(1, 'day')),
        }
      }
      startDay = startDay.add(1, 'day')
    }

    // add addFeatures
    this.addFeature('holiday', holiday, dayCells)
    this.addFeature('active', active, dayCells)
    this.addFeature('note', note, dayCells)

    // generate blanks
    const blanksNum = moment().year(year).month(month).date(1).day()

    return (
      <View style={styles.monthBody}>
        {Array.apply(0, Array(blanksNum)).map(function (x, i) {
          return <View key={i} style={ [styles.monthBodyCell] }></View>
        })}
        {Object.keys(dayCells).map((date, i) =>
          <MonthBodyCell
            key={i}
            dayInfo={dayCells[date]}
            onPress={onPress}
          />
        )}
      </View>
    )
  }

  addFeature(featureName, featureContent, dayCells) {
    if (featureContent) {
      for (let [date, value] of featureContent) {
        const formatDate = moment(date).format(this.props.displayFormat)
        if (dayCells[formatDate]) {
          dayCells[formatDate][featureName] = value;
        }
      }
      //Object.keys(featureContent).map((date) => {
      //    console.log(' map key from map ');
      //    const formatDate = moment(date).format(this.props.displayFormat)
      //    if(dayCells[formatDate]){
      //        dayCells[formatDate][featureName] = featureContent[date]
      //    }
      //})
    }
  }
}
MonthBody.defaultProps = {
  parseFormat: 'YYYY-M-D',
  displayFormat: 'YYYY-MM-DD'
}

class CalendarView extends React.Component {
  constructor(props) {
    super(props)
    this._list = null;
    this.state = {
      dataSource: new ListView.DataSource({
        rowHasChanged: (r1, r2) => r1 !== r2,
        sectionHeaderHasChanged: (s1, s2) => s1 !== s2
      })
    }
  }

  componentWillMount() {
    let {startDay, endDay} = this.props
    let startTime = moment(startDay)
    let endTime = moment(endDay)

    // generate months
    let months = {}

    while (endTime.isSameOrAfter(startTime, 'day')) {
      const year = startTime.year(),
        month = startTime.month(),
        date = year + '年' + (month + 1) + '月'

      months[date] = {
        date: year + "," + month
      }
      startTime = startTime.add(1, 'month')
    }

    this.setState({
      dataSource: this.state.dataSource.cloneWithRowsAndSections(months),
      loaded: true
    })
  }

  componentDidMount() {
    this.props.scrollTo && this._list.scrollTo(this.props.scrollTo);
  }

  render() {
    return (
      <View style={styles.container}>
        <CalendarHeader />
        <ListView
          ref={c => this._list = c}
          automaticallyAdjustContentInsets={false}
          initialListSize={1}
          showsVerticalScrollIndicator={false}
          dataSource={this.state.dataSource}
          renderSectionHeader={this.renderSectionHeader}
          renderRow={(rowData) => this._renderRow(rowData)}
          renderFooter={this._renderFooter}
        />
      </View>
    )
  }

  _renderFooter() {
    return <View style={styles.spaceV}/>;
  }

  _renderRow(rowData) {
    let ym = rowData.split(',');
    const year = Number(ym[0]),
      month = Number(ym[1])
    return (
      <View>
        <MonthBody year={year} month={month} {...this.props}/>
      </View>
    );
  }

  renderSectionHeader(sectionData, sectionID) {
    return (
      <View style={styles.monthHeader}>
        <Text style={styles.monthHeaderText}>{sectionID}</Text>
      </View>
    )
  }
}
CalendarView.defaultProps = {
  startTime: moment(),
  endTime: moment().add(5, 'month')
}

const sidePadding = 5,
  DateCellSize = (Dimensions.get('window').width - (sidePadding * 2 + 1)) / 7

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingLeft: sidePadding,
    paddingRight: sidePadding,
  },

  // common
  text: {
    fontSize: 14,
    textAlign: 'center',
    color: colors.dark3
  },
  disabledText: {
    color: colors.border,
  },

  // header
  header: {
    flexDirection: 'row',
    height: 15,
    backgroundColor: colors.light2
  },
  headerCell: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerText: {
    fontSize: 10,
  },

  // month header
  monthHeader: {
    height: 40,
    margin: 10,
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
    borderBottomWidth: 1 / PixelRatio.get(),
    borderBottomColor: colors.light3,
    backgroundColor: colors.light2
  },
  monthHeaderText: {
    fontSize: 16,
    color: colors.border
  },

  // month body
  monthBody: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    overflow: 'hidden',
  },

  // month body cell
  monthBodyCell: {
    width: DateCellSize,
    //height: DateCellSize + 15,
    marginTop: 10,
    alignItems: 'center',
  },
  monthBodyCellDate: {
    width: DateCellSize,
    height: 32,
    alignItems: 'center',
    justifyContent: 'center',
  },
  monthBodyCellNoteText: {
    padding: 5,
    color: colors.accent,
    fontSize: 12,
  },
  activeMonthBodyCellDate: {
    width: 32,
    backgroundColor: colors.accent,
    borderRadius: 16,
  },
  activeMonthBodyCellDateBorder: {
    width: 32,
    borderWidth: 2 / PixelRatio.get(),
    borderColor: colors.accent,
    borderRadius: 16,
  },
  activeMonthBodyCellDateText: {
    color: colors.light1,
  },
  spaceV: {
    height: 150
  }
})

module.exports = CalendarView

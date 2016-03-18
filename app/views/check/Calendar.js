/**
 * Created by Layman(http://github.com/anysome) on 16/3/16.
 */
'use strict';

import React, {StyleSheet, Component, ScrollView, View, Text} from 'react-native';
import CalendarView from '/../app/widgets/CalendarView';
import moment from 'moment';

import {styles, colors, airloy, api, toast, L} from '/../app/app';

export default class Calendar extends Component {

    constructor(props) {
        let {data, ...others} = props;
        super(others);
        this.fixTop = 65;
        this.checkDaily = data;
        this.startDay = moment().add(-2, 'month').startOf('month');
        this.endDay = moment().endOf('month');
        this.today = moment();
        this.actives = new Map();
        this.actives.set(new Date().getTime(), 'border');
        this.state = {
            actives: this.actives,
            notes: new Map(),
        };
    }

    componentDidMount() {
        this.reload();
    }

    async reload() {
        let result = await airloy.net.httpGet(api.target.punchs, {
            id: this.checkDaily.checkTargetId,
            days: this.today.diff(this.startDay, 'days') + 1
        });
        if ( result.success ) {
            for(let punch of result.info) {
                this.actives.set(punch.checkTime, 'fill');
                this.checkDaily.unit !== '0' && this.state.notes.set(punch.checkTime, punch.times);
            }
            this.setState({
                actives: this.actives,
                notes: this.state.notes
            });
        } else {
            toast(L(result.message));
        }
    }

    render() {
        return (
            <View style={[styles.flex, {top: this.fixTop}]}>
                <Text style={style.title}>{this.checkDaily.title}</Text>
                <CalendarView
                    active={this.state.actives}
                    note={this.state.notes}
                    startDay={this.startDay}
                    endDay={this.endDay}
                    scrollTo={{x:0, y:760}}
                />
            </View>
        );
    }
}


const style = StyleSheet.create({
    title: {
        margin: 10,
        color: colors.dark2,
        fontSize: 20,
        fontWeight: 'bold',
        textAlign: 'center'
    }
});
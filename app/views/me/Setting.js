/**
 * Created by Layman(http://github.com/anysome) on 16/3/4.
 */
'use strict';

import React, {StyleSheet, Component, ScrollView, View, Text, TouchableOpacity} from 'react-native';

import {styles, colors, airloy} from '../../app';

export default class Setting extends Component {

    constructor(props) {
        super(props);
    }

    _logout() {
        airloy.auth.logout();
    }

    render() {
        return (
            <ScrollView>
                <TouchableOpacity style={styles.row} activeOpacity={0.5} onPress={this._logout}>
                    <Text style={style.link} >退出</Text>
                </TouchableOpacity>
            </ScrollView>
        );
    }
}

const style = StyleSheet.create({
    link: {
        flex: 1,
        fontSize: 16,
        color: colors.dark1,
        textAlign: 'center'
    }
});
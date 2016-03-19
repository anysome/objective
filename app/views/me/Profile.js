/**
 * Created by Layman(http://github.com/anysome) on 16/3/4.
 */
'use strict';

import React, {Component, ScrollView, View, Text} from 'react-native';

import {styles, colors, toast} from '/../app/app';

export default class Profile extends Component {

    constructor(props) {
        super(props);
    }

    _showTip() {
        toast('test');
    }

    render() {
        return <ScrollView>
            <Text onPress={this._showTip}>hello</Text>
        </ScrollView>;
    }
}
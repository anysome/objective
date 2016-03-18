/**
 * Created by Layman(http://github.com/anysome) on 16/3/4.
 */
'use strict';

import React, {Component, ScrollView, View, Text} from 'react-native';

import {styles, colors} from '/../app/app';

export default class Message extends Component {

    constructor(props) {
        super(props);
    }

    render() {
        return <ScrollView>
            <Text>hello</Text>
        </ScrollView>;
    }
}
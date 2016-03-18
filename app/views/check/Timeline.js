/**
 * Created by Layman(http://github.com/anysome) on 16/3/16.
 */

import React, {StyleSheet, Component, ScrollView, View, Text, ListView} from 'react-native';
import moment from 'moment';

import {styles, colors, airloy, api, toast, L} from '/../app/app';

export default class Timeline extends Component {

    constructor(props) {
        let {data, ...others} = props;
        super(others);
        this.chekcDaily = data;
        this.state = {
            dataSource: new ListView.DataSource({
                rowHasChanged: (row1, row2) => row1 !== row2
            })
        };
    }

    componentDidMount() {
        this.reload();
    }

    async reload() {
        let result = await airloy.net.httpGet(api.target.track, {id: this.chekcDaily.checkTargetId});
        if ( result.success ) {
            this.setState({
                dataSource: this.state.dataSource.cloneWithRows(result.info)
            });
        } else {
            toast(L(result.message));
        }
    }

    _renderRow(rowData, sectionId, rowId) {
        console.log(`rowid = ${rowId}, data = ${JSON.stringify(rowData)}`);
        return (
            <View style={style.row}>
                <Text style={styles.text}>{moment(rowData.checkTime).format('HH : mm')}</Text>
                <View style={style.round}>
                    <Text style={style.progress}>{rowData.progress}</Text>
                </View>
                <View style={styles.containerV}>
                    <Text style={styles.text}>{moment(rowData.checkTime).format('YYYY年M月D日')}</Text>
                    <Text style={styles.text}>+ {rowData.times}</Text>
                    <Text style={style.hint}>{rowData.detail}</Text>
                </View>
            </View>
        );
    }

    render() {
        return (
            <ScrollView>
                <Text style={styles.title}>{this.chekcDaily.title}</Text>
                <ListView
                    initialListSize={10} pageSize={5}
                    dataSource={this.state.dataSource}
                    renderRow={(rowData, sectionId, rowId) => this._renderRow(rowData, sectionId, rowId)}
                    />
            </ScrollView>
        );
    }
}


const style = StyleSheet.create({
    row: {
        flex: 1,
        flexDirection: 'row',
        marginLeft: 30,
        marginRight: 20,
        alignItems: 'center'
    },
    round: {
        marginLeft: 20,
        marginRight: 20,
        width: 32,
        borderWidth: 5,
        borderColor: colors.accent,
        borderRadius: 16,
        alignItems: 'center',
        justifyContent: 'center',
    },
    progress: {
        color: colors.accent
    },
    hint: {
        color: colors.border,
        fontSize: 12
    }
});
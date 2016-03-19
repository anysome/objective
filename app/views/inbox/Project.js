/**
 * Created by Layman(http://github.com/anysome) on 16/3/17.
 */

import React, {StyleSheet, Component, ListView, RefreshControl, View, Text,
    TouchableOpacity, PixelRatio, ActionSheetIOS} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import moment from 'moment';

import {styles, colors, airloy, api, toast, L, util} from '/../app/app';
import ListSource from '/../app/logic/ListSource';

import EditItem from './EditItem';

export default class Project extends Component {

    constructor(props) {
        let {data, ...others} = props;
        super(others);
        this.listSource = new ListSource();
        this.project = data;
        this.state = {
            isRefreshing: true,
            dataSource: new ListView.DataSource({
                rowHasChanged: (row1, row2) => row1 !== row2
            })
        };
    }

    componentDidMount() {
        //console.log(JSON.stringify(this.project));
        this.reload();
    }

    async reload() {
        this.setState({
            isRefreshing: true
        });
        let result = await airloy.net.httpGet(api.project.item.list, {id: this.project.id});
        if ( result.success ) {
            this.listSource = new ListSource(result.info);
            this.setState({
                isRefreshing: false,
                dataSource: this.state.dataSource.cloneWithRows(this.listSource.datas)
            });
        } else {
            result.message !== 'error.request.auth' && this.setState({
                isRefreshing: false
            });
            toast(L(result.message));
        }
    }

    _toArrange(rowData, arrangable) {
        if (arrangable) {
            let BUTTONS = ['安排到今天', '安排到明天', '安排到后天', '取消'];
            let CANCEL_INDEX = 3;
            ActionSheetIOS.showActionSheetWithOptions({
                    options: BUTTONS,
                    cancelButtonIndex: CANCEL_INDEX,
                    tintColor: colors.dark1
                },
                async (buttonIndex) => {
                    if ( buttonIndex !== CANCEL_INDEX ) {
                        let newDate = moment().add(buttonIndex, 'days');
                        let result = await airloy.net.httpGet(api.inbox.arrange, {
                                id: rowData.choreId,
                                adate: newDate.format('YYYY-MM-DD')
                            }
                        );
                        if (result.success) {
                            airloy.event.emit('agenda.change');
                            rowData.arranged = true;
                            this.listSource.update(util.clone(rowData));
                            this.setState({
                                dataSource: this.state.dataSource.cloneWithRows(this.listSource.datas)
                            });
                        } else {
                            toast(L(result.message));
                        }
                    }
                }
            );
        }
    }

    _pressRow(rowData, editable) {
        this.props.navigator.push({
            title: editable ? '修改' : '查看子任务',
            component: EditItem,
            rightButtonIcon: this.props.nextIcon,
            passProps: {
                data: rowData,
                editable: editable,
                onUpdated: (rowData) => this.updateRow(rowData),
                onDeleted: (rowData) => this.deleteRow(rowData)
            }
        });
    }

    _renderRow(rowData, sectionId, rowId) {
        let transform, arrangable = true, editable = true;
        if ( rowData.status === '1' ) {
            transform = {
                iconName: 'ios-checkmark-empty',
                color: colors.light3,
                titleColor: colors.border,
                detailColor: colors.border
            };
            arrangable = editable = false;
        } else if ( rowData.arranged ) {
            transform = {
                iconName: 'android-calendar',
                color: colors.light3,
                titleColor: colors.dark1,
                detailColor: colors.dark1
            };
            arrangable = false;
        } else {
            transform = {
                iconName: 'ios-calendar-outline',
                color: colors.border,
                titleColor: colors.dark3,
                detailColor: colors.dark1
            };
        }
        return (
            <TouchableOpacity style={style.container} onPress={() => this._pressRow(rowData, editable)}>
                <Icon size={28} name={transform.iconName} style={style.icon} color={transform.color} onPress={() => this._toArrange(rowData, arrangable)} />
                <View style={styles.flex}>
                    <Text style={[styles.title, {color: transform.titleColor}]}>{rowData.title}</Text>
                    <Text style={[styles.text, {color: transform.detailColor}]}>{rowData.detail}</Text>
                </View>
            </TouchableOpacity>
        );
    }

    _renderSeparator(sectionId, rowId, adjacentRowHighlighted) {
        return <View key={rowId + '_separator'} style={styles.hr}></View>
    }

    _renderHeader() {
        return <View style={style.header}>
            <Text style={styles.title}>{this.props.data.title}</Text>
            <Text style={styles.text}>{this.project.detail}</Text>
        </View>;
    }

    render() {
        return (
            <ListView
                initialListSize={10}
                pageSize={5}
                dataSource={this.state.dataSource}
                renderRow={(rowData, sectionId, rowId) => this._renderRow(rowData, sectionId, rowId)}
                renderSeparator={this._renderSeparator}
                renderHeader={() => this._renderHeader()}
                refreshControl={
                          <RefreshControl
                            refreshing={this.state.isRefreshing}
                            onRefresh={() => this.reload()}
                            tintColor={colors.accent}
                            title={'加载中...'}
                            colors={['#ff0000', '#00ff00', '#0000ff']}
                            progressBackgroundColor="#EBEBEB"
                          />}
            />
        );
    }
}


const style = StyleSheet.create({
    header: {
        marginTop: 10,
        paddingLeft: 16,
        paddingRight: 16,
        paddingBottom: 4,
        borderBottomWidth: 1 / PixelRatio.get(),
        borderBottomColor: colors.border
    },
    container: {
        flexDirection: 'row',
        flex: 1,
        paddingRight: 16,
        paddingTop: 5,
        paddingBottom: 5,
        alignItems: 'center',
        backgroundColor: colors.light1
    },
    icon: {
        paddingLeft: 16,
        paddingRight: 10,
    }
});
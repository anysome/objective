/**
 * Created by Layman(http://github.com/anysome) on 16/2/19.
 */
'use strict';

import React, {
    StyleSheet,
    Component,
    View,
    Text,
    ListView,
    RefreshControl
} from 'react-native';
import moment from 'moment';
import Icon from 'react-native-vector-icons/Ionicons';

import app, {airloy, styles, colors, api, L, toast} from '/../app/app';
import ListSource from '/../app/logic/ListSource';

import Controller from '../Controller';
import ListSectionView from '/../app/widgets/ListSectionView';
import ListRow from './ListRow';
import Edit from './Edit';
import Commit from './Commit';
import Inbox from './../inbox/Inbox';


export default class Agenda extends Controller {

    constructor(props) {
        super(props);
        this.listSource = null;
        this.state = {
            isRefreshing: true,
            showModal: false,
            selectedRow: {},
            dataSource: new ListView.DataSource({
                getSectionHeaderData: (dataBlob, sectionId) => dataBlob[sectionId],
                getRowData: (dataBlob, sectionId, rowId) => dataBlob[sectionId].getRow(rowId),
                rowHasChanged: (row1, row2) => row1 !== row2,
                sectionHeaderHasChanged: (s1, s2) => s1 !== s2
            })
        };
    }

    componentWillMount() {
        if ( this.route ) {// Logout and then login cause currentRoute to be null. Maybe a bug.
            this.route.leftButtonIcon = this.getIcon('ios-box-outline');
            this.route.onLeftButtonPress = () => {
                this.forward({
                    title: '待定',
                    component: Inbox,
                    rightButtonIcon: this.getIcon('ios-more-outline'),
                    passProps: {
                        today: this.today,
                        trashIcon: this.getIcon('ios-trash-outline'),
                        plusIcon: this.getIcon('ios-plus-empty')
                    }
                });
            };
            this.route.rightButtonIcon = this.getIcon('ios-compose-outline');
            this.route.onRightButtonPress = () => {
                this.forward({
                    title: '添加',
                    component: Edit,
                    passProps: {
                        today: this.today,
                        onFeedback: (agenda) => this.addRow(agenda)
                    }
                });
            };
            this.props.navigator.replace(this.route);
        }
        airloy.event.on('agenda.change', ()=> {
            // call network request or mark stale until page visible
            this.visible ? this.reload() : super.markStale();
            console.log('fire agenda add subtle , stale = ' + this.stale);
        });
        airloy.event.on('agenda.add', (agenda)=> {
            this.listSource.add(agenda);
            this._sortList();
            // TODO treat view stale differently to data stale, currently not support data stale.
            // reload list or mark stale until page visible
            //this.visible ? this._sortList() : this.stale = true;
        });
    }

    addRow(rowData) {
        this.listSource.add(rowData);
        this._sortList();
        this.backward();
    }

    async _reload() {
        this.setState({
            isRefreshing: true
        });
        let result = await airloy.net.httpGet(api.agenda.list, null);
        if ( result.success ) {
            this.listSource = new ListSource(result.info);
            this._sortList();
            this.setState({
                isRefreshing: false
            });
        } else {
            // event emit will unmount this component
            result.message !== 'error.request.auth' && this.setState({
                isRefreshing: false
            });
            toast(L(result.message));
        }
    }

    _sortList() {
        let section0 = new ListSectionView.DataSource({id: 0, name: moment(this.today).format('D日（ddd）')});
        let section1 = new ListSectionView.DataSource({id: 1, name: '未来'});
        let section2 = new ListSectionView.DataSource({id: 2, name: '完成'});
        for(let rowData of this.listSource) {
            this._sortRow(rowData, section0, section1, section2);
        }
        this.setState({
            dataSource: this.state.dataSource.cloneWithRowsAndSections(
                [section0, section1, section2],
                [0, 1, 2],
                [section0.rowIds, section1.rowIds, section2.rowIds]
            )
        });
    }

    _sortRow(agenda, section0, section1, section2) {
        var section;
        if ( agenda.status === '1' ) {
            section = section2;
        } else {
            if ( agenda.today > this.today) {
                section = section1;
            } else {
                section = section0;
            }
        }
        section.push(agenda);
    }

    _renderRow(rowData, sectionId, rowId) {
        return <ListRow data={rowData} sectionId={sectionId} today={this.today}
                        onPress={() => this._pressRow(rowData)}
                        onIconClick={() => this._pressRowIcon(rowData, sectionId)} />;
    }

    _pressRow(rowData) {
        if (rowData.status === '1') {
            this.forward({
                title: '查看',
                component: Edit,
                passProps: {
                    today: this.today,
                    data: rowData
                }
            });
        } else {
            this.forward({
                title: '修改',
                component: Edit,
                rightButtonIcon: this.getIcon('ios-more-outline'),
                passProps: {
                    today: this.today,
                    data: rowData,
                    onFeedback: (agenda) => this.updateRow(agenda),
                    onDelete: (agenda) => this.deleteRow(agenda)
                }
            });
        }
    }

    async _pressRowIcon(rowData, sectionId) {
        if ( sectionId === 2 ) {
            this._pressRow(rowData);
        } else {
            if ( sectionId === 1 ) {
                let result = await airloy.net.httpGet(api.agenda.schedule, {id: rowData.id, newDate: moment(this.today).format('YYYY-MM-DD')});
                if (result.success) {
                    rowData.today = this.today;
                    this.updateRow(rowData);
                } else {
                    toast(L(result.message));
                }
            } else {
                this.setState({
                    showModal: true,
                    selectedRow: rowData
                });
            }
        }
    }

    updateRow(rowData) {
        //let newClone = JSON.parse(JSON.stringify(rowData));
        //console.log(JSON.stringify(rowData));
        this.listSource.update(rowData);
        this._sortList();
        this.backward();
    }

    deleteRow(rowData) {
        this.listSource.remove(rowData);
        this._sortList();
        this.backward();
    }

    commitRow(rowData) {
        if ( rowData ) {
            this.listSource.update(rowData);
            this._sortList();
        }
        this.setState({
            showModal: false
        });
    }

    _renderSectionHeader(sectionData, sectionId) {
        return <ListSectionView data={sectionData} />;
    }

    _renderSeparator(sectionId, rowId, adjacentRowHighlighted) {
        return <View key={rowId + '_separator'} style={styles.hr}></View>
    }

    render() {
        console.log(' render agenda page');
        return (
            <View style={styles.flex}>
                <ListView
                    initialListSize={10}
                    pageSize={10}
                    dataSource={this.state.dataSource}
                    renderRow={(rowData, sectionId, rowId) => this._renderRow(rowData, sectionId, rowId)}
                    renderSectionHeader={this._renderSectionHeader}
                    renderSeparator={this._renderSeparator}
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
                <Commit data={this.state.selectedRow} visible={this.state.showModal} onFeedback={(agenda) => this.commitRow(agenda)} />
            </View>

        );
    }
}
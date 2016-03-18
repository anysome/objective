/**
 * Created by Layman(http://github.com/anysome) on 16/2/19.
 */
'use strict';

import React, {
    Component,
    ScrollView,
    RefreshControl,
    View,
    Text,
    Image,
    TouchableOpacity
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import Button from 'react-native-button';

import {styles, colors, airloy, config, L} from '/../app/app';

import Controller from '../Controller';
import Profile from './Profile';
import Feedback from './Feedback';
import ContentList from '../discover/ContentList';
import UserList from '../discover/UserList';
import Message from './Message';
import Setting from './Setting';
import Upgrade from './Upgrade';


export default class Me extends Controller {
    constructor(props) {
        super(props);
        this.user = airloy.auth.getUser();
        this.state = {isRefreshing: true};
    }

    _toFeedback() {
        this.forward({
            title: '我的反馈',
            component: Feedback,
            navigationBarHidden: false,
            passProps: {
                nextIcon: this.getIcon('ios-trash-outline')
            }
        });
    }

    _toContent() {
        this.forward({
            title: '我的分享',
            component: ContentList,
            navigationBarHidden: false,
            passProps: {
                userId: this.user.id,
                nextIcon: this.getIcon('ios-trash-outline')
            }
        });
    }

    toFollow() {
        this.forward({
            title: '我关注的',
            component: UserList,
            navigationBarHidden: false,
            passProps: {
                userId: this.user.id,
                keepRoute: true
            }
        });
    }

    toFan() {
        this.forward({
            title: '我的粉丝',
            component: UserList,
            navigationBarHidden: false,
            passProps: {
                isFans: true,
                userId: this.user.id,
                keepRoute: true
            }
        });
    }

    _forward(title: String, component: Component) {
        this.forward({
            title: title,
            component: component,
            navigationBarHidden: false
        });
    }

//<View style={styles.hr} />
//<TouchableOpacity onPress={() => this._forward('我的消息', Message)}>
//<View style={styles.sectionRow}>
//<Text>我的消息</Text>
//<Icon size={20} name="ios-arrow-right" color={colors.border} />
//</View>
//</TouchableOpacity>

    render() {
        console.log(' render me page');
        return (
            <ScrollView>
                <TouchableOpacity style={[styles.row, {marginTop: 0}]} onPress={() => this._forward('个人信息', Profile)}>
                    <Image style={{width:100, height:100, marginTop: 20, marginRight: 16}}
                           source={{uri:`${config.host.avatar + this.user.id}-100`}}  />
                    <View style={styles.section}>
                        <Text style={styles.sectionRow}>{this.user.name}</Text>
                        <Text style={styles.sectionRow}>{this.user.uid}</Text>
                        <Text style={styles.sectionRow}>水果总数</Text>
                    </View>
                </TouchableOpacity>
                <View style={styles.section}>
                    <TouchableOpacity style={styles.sectionRow} onPress={() => this._toFeedback()}>
                        <Text>我的反馈</Text>
                        <Icon size={20} name="ios-arrow-right" color={colors.border} />
                    </TouchableOpacity>
                </View>
                { this.user.accountType === 'astmp' ?
                    <TouchableOpacity style={styles.row} activeOpacity={0.5} onPress={() => this._forward('升级帐号', Upgrade)}>
                        <Text>数据同步</Text>
                        <Icon size={20} name="ios-arrow-right" color={colors.border} />
                    </TouchableOpacity>
                    :
                    <View style={styles.section}>
                        <TouchableOpacity style={styles.sectionRow} onPress={() => this._toContent()}>
                            <Text>分享</Text>
                            <Icon size={20} name="ios-arrow-right" color={colors.border}/>
                        </TouchableOpacity>
                        <View style={styles.hr}/>
                        <TouchableOpacity style={styles.sectionRow} onPress={() => this.toFollow()}>
                            <Text>{L('banner.me.follows')}</Text>
                            <Icon size={20} name="ios-arrow-right" color={colors.border}/>
                        </TouchableOpacity>
                        <View style={styles.hr}/>
                        <TouchableOpacity style={styles.sectionRow} onPress={() => this.toFan()}>
                            <Text>粉丝</Text>
                            <Icon size={20} name="ios-arrow-right" color={colors.border}/>
                        </TouchableOpacity>
                    </View>
                }
                <TouchableOpacity style={styles.row} activeOpacity={0.5} onPress={() => this._forward('设置', Setting)}>
                    <Text>设置</Text>
                    <Icon size={20} name="ios-arrow-right" color={colors.border} />
                </TouchableOpacity>
            </ScrollView>
        );
    }
}
# Objective 行事易

**可自动跟踪目标完成情况的待办清单软件** 

也许还有收集箱、项目等 GTD 的功能, 正在被慢慢的简化和抛弃.


## iOS Snapshot

<img src="https://cloud.githubusercontent.com/assets/233960/14515977/3d6db714-0231-11e6-96d2-a33aabb9c714.jpg" alt="todo" width="300">
<img src="https://cloud.githubusercontent.com/assets/233960/14515955/132a9968-0231-11e6-9a69-f89ecd39d44b.jpg" alt="progress" width="300">
<img src="https://cloud.githubusercontent.com/assets/233960/14515957/144d9ab6-0231-11e6-9dbe-7cd2e722e279.jpg" alt="calendar" width="300">
<img src="https://cloud.githubusercontent.com/assets/233960/14515988/59d9eb0c-0231-11e6-8d33-7f99d3d7aa07.jpg" alt="discover" width="300">
<img src="https://cloud.githubusercontent.com/assets/233960/14515989/59e51dec-0231-11e6-9517-ad90631a2662.jpg" alt="check" width="300">
<img src="https://cloud.githubusercontent.com/assets/233960/14515975/3b08a402-0231-11e6-9b21-b2c5672fecd7.jpg" alt="add" width="300">

## Android Snapshot
**Android 版本还在适配调试中, 部分界面和功能会有错乱, 近期会更新.**

<img src="https://cloud.githubusercontent.com/assets/233960/14515683/ddc43fb0-022e-11e6-99f8-f17f3136546a.png" alt="todo" width="300">
<img src="https://cloud.githubusercontent.com/assets/233960/14515840/05e2a526-0230-11e6-9b8c-7b7871398bb5.png" alt="progress" width="300">
<img src="https://cloud.githubusercontent.com/assets/233960/14515841/0e0ea470-0230-11e6-9d6d-c588b50f7bac.png" alt="calendar" width="300">
<img src="https://cloud.githubusercontent.com/assets/233960/14515715/136220f6-022f-11e6-96e1-495b908d7d36.png" alt="discover" width="300">
<img src="https://cloud.githubusercontent.com/assets/233960/14515738/4f20b5b2-022f-11e6-9f67-5cbfb206f3c8.png" alt="me" width="300">
<img src="https://cloud.githubusercontent.com/assets/233960/14515745/5d81af94-022f-11e6-8ba1-84c8b234843f.png" alt="add" width="300">

### Install

```
npm install
rnpm link
react-native run-ios
react-native run-android
```

iOS 还需要把ART和Notification在xcode中配置.


### Code

es6 first!


### TODO

- [ ] Android 2.0 release
- [ ] User login and profile enhance
- [ ] Hot Update
- [ ] Local cache and db
- [ ] I18n


### Welcome

反馈、建议、pr、star、share ……


- - -

### Dev Server

开发测试用的服务器会一直运行着, 但只是台阿里云上512内存的小ECS，不一定随时挂掉, 小心使用, 我会即时重启.

**测试数据不定时清除, 请勿保存重要信息.**


### History

v1.x的版本使用[Titanium](https://github.com/appcelerator/titanium)、[Alloy](https://github.com/appcelerator/alloy)开发, 可惜它不够开源又开始收费, 终于彻底放弃.

至于React Native 一开始我是拒绝的, 毕竟js开发双移动平台总会有各种坑, 然而swift还不够长进, 就先顶着用.


### Release Version

[iOS AppStore](https://itunes.apple.com/cn/app/xing-shi-yi/id931153512?mt=8)

Android Markets (v1.x waiting for upgrade)
[小米](http://app.mi.com/detail/71912)
[豌豆荚](http://www.wandoujia.com/apps/com.exease.etd.objective)
[应用宝](http://sj.qq.com/myapp/detail.htm?apkName=com.exease.etd.objective)


### License
项目使用[MIT](LICENSE)许可。

/**
 * Created by Layman(http://github.com/anysome) on 16/11/13.
 */
'use strict';

import {StyleSheet, PixelRatio} from 'react-native';
import util from '../libs/Util';

const px1 = 1 / PixelRatio.get();

const colors = {
  bright1: '#EFEFF4',
  bright2: '#DCDCE4',
  border: '#CCCCCC',
  accent: '#FDC02F',
  action: '#4CD964',
  dark1: '#000000',
  dark2: '#666666',

  changeTheme: function (theme) {
    console.log('todo theme');
  }
};

const styles = StyleSheet.create({
  navigation: {
    backgroundColor: colors.bright1
  },
  window: {
    flex: 1,
    backgroundColor: 'white'
  },
  modal: {
    flex: 1,
    backgroundColor: colors.bright1
  },
  container: {
    paddingLeft: 16,
    paddingRight: 16
  },
  flex: {
    flex: 1
  },
  containerV: {
    flex: 1,
    flexDirection: 'column'
  },
  containerC: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center'
  },
  containerH: {
    flex: 1,
    flexDirection: 'row'
  },
  containerA: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-around'
  },
  containerF: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between'
  },
  hr: {
    height: px1,
    backgroundColor: colors.bright1
  },
  separator: {
    height: px1,
    position: 'absolute',
    left: 16,
    right: 0,
    backgroundColor: colors.bright2
  },
  section: {
    flex: 1,
    flexDirection: 'column',
    borderBottomWidth: px1,
    borderBottomColor: colors.bright2,
    borderTopWidth: px1,
    borderTopColor: colors.bright2,
    backgroundColor: 'white',
    marginTop: 20,
    paddingLeft: 16,
    paddingRight: 16,
  },
  sectionRow: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingTop: 10,
    paddingBottom: 10
  },
  row: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'space-between',
    flexDirection: 'row',
    borderBottomWidth: px1,
    borderBottomColor: colors.bright2,
    borderTopWidth: px1,
    borderTopColor: colors.bright2,
    backgroundColor: 'white',
    marginTop: 20,
    paddingLeft: 16,
    paddingRight: 16,
    paddingTop: 10,
    paddingBottom: 10
  },
  text: {
    color: colors.dark2,
    fontSize: 16
  },
  navText: {
    color: colors.dark1,
    fontSize: 16
  },
  title: {
    flex: 1,
    paddingTop: 4,
    paddingBottom: 4,
    color: colors.dark1,
    fontSize: 20
  },
  buttonAction: {
    marginTop: 20,
    marginLeft: 16,
    marginRight: 16,
    justifyContent: 'center',
    alignItems: 'center',
    height: 40,
    overflow: 'hidden',
    borderRadius: 5,
    backgroundColor: colors.action
  },
  button: {
    // flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    height: 40,
    marginTop: 10,
    overflow: 'hidden',
    borderRadius: 5,
    backgroundColor: colors.action
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold'
  },
  buttonRound: {
    justifyContent: 'center',
    alignItems: 'center',
    padding: 4,
    overflow: 'hidden',
    borderRadius: 5,
    borderWidth: px1,
    borderColor: colors.accent
  },
  link: {
    flex: 1,
    fontSize: 18,
    textAlign: 'center',
    color: colors.action
  },
  picker: {
    fontSize: 16,
    color: colors.accent
  },
  hint: {
    textAlign: 'right',
    fontSize: 12,
    color: colors.border
  },
  backgroundImage: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    width: null,
    height: null,
    backgroundColor: 'transparent',
    resizeMode: 'cover',
  },
  spaceV: {
    height: 70
  }
});

export {colors, styles, px1};

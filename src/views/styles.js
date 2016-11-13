/**
 * Created by Layman(http://github.com/anysome) on 16/11/13.
 */
'use strict';

import {StyleSheet, PixelRatio} from 'react-native';
import util from '../libs/Util';

var colors = {
  bright1: '#FAFAFA',
  bright2: '#EFEFF4',
  border: '#CECED2',
  accent: '#FDC02F',
  action: '#4CD964',
  dark1: '#202020',
  dark2: '#808080',

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
    backgroundColor: colors.bright2
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
    height: 1,
    backgroundColor: colors.bright1
  },
  separator: {
    height: 1 / PixelRatio.get(),
    position: 'absolute',
    left: 16,
    right: 0,
    backgroundColor: colors.bright2
  },
  section: {
    flex: 1,
    flexDirection: 'column',
    borderBottomWidth: 1 / PixelRatio.get(),
    borderBottomColor: colors.bright2,
    borderTopWidth: 1 / PixelRatio.get(),
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
    borderBottomWidth: 1 / PixelRatio.get(),
    borderBottomColor: colors.bright2,
    borderTopWidth: 1 / PixelRatio.get(),
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
    borderWidth: 1 / PixelRatio.get(),
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
  inputR: {
    flex: 1,
    height: util.isAndroid() ? 40 : 25,
    marginLeft: util.isAndroid() ? 0 : 16,
    marginTop: null,
    textAlign: 'right'
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

export {colors, styles};

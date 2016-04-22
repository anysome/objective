/**
 * Created by Layman(http://github.com/anysome) on 16/2/28.
 */
'use strict';

import {StyleSheet, PixelRatio} from 'react-native';
import util from '../libs/Util';

var colors = {
  light1: '#F2EFE9',  //E2F9DA
  light2: '#E0DED7',  //D0E8C8
  light3: '#D2CFD0', //C2D9C1
  border: '#B0ADAE', //ACB4A1
  accent: '#FF6666', // D94C64
  dark1: '#5B4B67', // 5A6A6A
  dark2: '#281834', //273737
  dark3: '#060012', //051515

  changeTheme: function (theme) {
    if (theme === 'cyan') {
      this.light1 = '#F6EEDC';
      this.light2 = '#E4DDCA';
      this.light3 = '#D6CEC3';
      this.border = '#B4ACA1';
      this.accent = '#3ed69e';
      this.dark1 = '#6A5A56';
      this.dark2 = '#372723';
      this.dark3 = '#150501';
    } else {
      this.light1 = '#F2EFE9';  //E2F9DA
      this.light2 = '#E0DED7';  //D0E8C8
      this.light3 = '#D2CFD0'; //C2D9C1
      this.border = '#B0ADAE'; //ACB4A1
      this.accent = '#FF6666'; // D94C64
      this.dark1 = '#5B4B67'; // 5A6A6A
      this.dark2 = '#281834'; //273737
      this.dark3 = '#060012'; //051515
    }
  }
};

const styles = StyleSheet.create({
  navigation: {
    backgroundColor: colors.light2
  },
  window: {
    flex: 1,
    backgroundColor: colors.light2
  },
  modal: {
    flex: 1,
    backgroundColor: colors.light3
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
    backgroundColor: colors.light2
  },
  separator: {
    height: 1 / PixelRatio.get(),
    position: 'absolute',
    left: 16,
    right: 0,
    backgroundColor: colors.light3
  },
  section: {
    flex: 1,
    flexDirection: 'column',
    borderBottomWidth: 1 / PixelRatio.get(),
    borderBottomColor: colors.light3,
    borderTopWidth: 1 / PixelRatio.get(),
    borderTopColor: colors.light3,
    backgroundColor: colors.light1,
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
    borderBottomColor: colors.light3,
    borderTopWidth: 1 / PixelRatio.get(),
    borderTopColor: colors.light3,
    backgroundColor: colors.light1,
    marginTop: 20,
    paddingLeft: 16,
    paddingRight: 16,
    paddingTop: 10,
    paddingBottom: 10
  },
  text: {
    color: colors.dark1,
    fontSize: 14
  },
  title: {
    flex: 1,
    paddingTop: 4,
    paddingBottom: 4,
    color: colors.dark3,
    fontSize: 18
  },
  button: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    height: 40,
    marginTop: 10,
    overflow: 'hidden',
    borderRadius: 5,
    backgroundColor: colors.accent
  },
  buttonText: {
    color: colors.light1,
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
    fontSize: 16,
    textAlign: 'center',
    color: colors.accent
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

/**
 * Created by Layman(http://github.com/anysome) on 16/4/16.
 */
import {Platform} from 'react-native';

export default {

  keyboardShow: Platform.OS === 'android' ? 'keyboardDidShow' : 'keyboardWillShow',
  keyboardHide: Platform.OS === 'android' ? 'keyboardDidHide' : 'keyboardWillHide',

  tabChange: 'tab.change',

  agendaChange: 'agenda.change',
  agendaAdd: 'agenda.add',

  targetChange: 'target.change',
  targetPunch: 'target.punch',

  choreChange: 'chore.change',
  choreAdd: 'chore.add',

  taskChange: 'task.change',

  meChange: 'me.change'
}

/**
 * Created by Layman(http://github.com/anysome) on 16/7/10.
 */
import {config, airloy, api, L, toast} from '../../app';
import ListSource from '../../logic/ListSource';

import ContentList from './ContentList';

export default class TargetContentList extends ContentList {

  async reload() {
    this.setState({
      isRefreshing: true
    });
    let result = await airloy.net.httpGet(api.content.list.target, {socialTargetId: this.props.data.id});
    if (result.success) {
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

}

/**
 * Created by Layman(http://github.com/anysome) on 16/3/8.
 */
export default class ListSource {

  constructor(datas:Array<any> = []) {
    this._hash = new Map();
    for (let data of datas) {
      this._hash.set(data.id, data);
    }
  }

  [Symbol.iterator]() {
    return this._hash.values();
  }

  add(data) {
    this._hash.set(data.id, data);
  }

  concat(datas) {
    for (let data of datas) {
      this._hash.set(data.id, data);
    }
  }

  update(data) {
    this._hash.set(data.id, data);
  }

  remove(data) {
    this._hash.has(data.id) && this._hash.delete(data.id);
  }

  read(id) {
    return this._hash.get(id);
  }

  get datas() {
    return [...this._hash.values()];
  }
}

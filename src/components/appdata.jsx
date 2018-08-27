//'use strict';

import LRU from 'lru'

let _props = {'power': false};
let _uid = 0;
let _urlhis = new LRU(5);
let _urlrt = [];
class AppData {
  SetKV(k, v) {
    _props[k] = v;
  }
  GetV(k) {
    return _props[k];
  }
  Uid() {
    _uid++;
    return "_uid_" + _uid;
  }

  SetHisUrl(k, v) {
    _urlhis.set(k, v);
    let rt = []
    _urlhis.keys.forEach((x,i) =>{
      rt.push(_urlhis.get(x));
      //rt.push(_urlhis.get(x));
    });
    //for (let a in _urlhis.keys) {
      //rt.push(_urlhis.get(a));
    //}
    _urlrt = rt;
  }
  GetHisUrl() {
    return _urlrt;
  }
}
const a = new AppData();

export default a;

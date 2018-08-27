//'use strict';
import when from 'when'

let Dly = (d) => {
  let deferred = when.defer();
  setTimeout(()=>{
    deferred.resolve()
  }, d);
  return deferred.promise;
}
/*
Object.defineProperty(exports, 'Dly', {
    enumerable: true,
    get: function get() {
        return Dly;
    }
});
*/
export {Dly}
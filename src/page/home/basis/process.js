let filterParams = (par)=>{
  /**
   * @description 过滤为空、空字符串参数
   * @param par
   * @returns
   */
    let _par = par, _newPar = {};
    for (let key in _par) {
      if ((_par[key] == 0 || _par[key]) && _par[key].toString().replace(/\s/g, '') !== '') {
        _newPar[key] = _par[key];
      }
    }
    return _newPar;
};
export {filterParams}

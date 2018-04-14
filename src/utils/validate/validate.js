// require('./validate.scss');
let Validate = {};
Validate.install = function (Vue, option) {
    Vue.prototype.$Validate = function (op = {}) {
        if (op.constructor !== Object) {
            console.error('Vue.$Validate 参数传入格式错误')
        }
        let args, method, timer;
        args = Object.assign({
            type: 'Promise',//default Promise return-type: Promise/callBack/boolean
            obj: '',//一个inputContent对象
            rules: {},//一个规则对象
            msg: {},//一个提示文案对象
            method: {},//校验规则
            duration: 2000,//错误提示显示时间
            success: null,
            fail :null,
        }, op);
        method = {
            required (val) {
                if (val === null) {
                    return false;
                }
                if(typeof val==='number'){
                    val+='';
                }
                return val.replace(/(^\s*)|(\s*$)/g, "") != '';
            },
            isPhone (val) {
                let result = /^1[0-9]{10}$/.test(val);
                if (!val || val === '') {
                    result = true;
                }
                return result;
            },
            //大于0 正整数
            isPosInte(val){
              let result = /^[0-9]\d*$/.test(val) && val > 0;
              if (!val || val === '') {
                result = true;
              }
              return result;
            },
            isNum (val) {
                let result = /^[0-9]\d*$/.test(val);
                if (!val || val === '') {
                    result = true;
                }
                return result;
            },
            isNumAndFloat (val) {
                let result = /^[1-9]\d*$|^0\.\d*$|^[1-9]\d*\.\d*$/.test(val);
                if (!val || val === '') {
                    result = true;
                }
                return result;
            },
            isNumAndFloatLimit2 (val) {
                // let result = /^[1-9]\d*$|^0$|^0\.\d{1,2}$|^[1-9]\d*\.\d{1,2}$/.test(val);
                let result = /^[1-9]\d*$|^0\.\d{1,2}$|^[1-9]\d*\.\d{1,2}$/.test(val);
                if ((!val && val !== 0) || val === '') {
                    result = true;
                }
                return result;
            },
            isEmptyArray (val) {
                return val.length > 0;
            },
            isEmail(val){
                let result = /^[A-Za-z\d]+([-_.][A-Za-z\d]+)*@([A-Za-z\d]+[-.])+[A-Za-z\d]{2,5}$/.test(val);
                if (!val || val === '') {
                    return true;
                }
                return result;
            },
            //验证身份证合法
            isIdCard(val){
              if (val[17] === 'x') {
                return false;
              }
              let Wi = [7,9,10,5,8,4,2,1,6,3,7,9,10,5,8,4,2],//权重因子
                Va = [ 1, 0, 'X', 9, 8, 7, 6, 5, 4, 3, 2 ],//验证位
                reg = /^\d+$/, sum=0;
              for(let i=0;i<17;i++){
                //加权求和
                if(reg.test(val[i])) sum += val[i] * Wi[i];
              }
              return val[17] == Va[sum % 11];
            },
            //特殊字符
            specialChat(val){
              let regEn = /[`~!@#$%^&*()_+<>?:"{},.\/;'[\]]/im,
                regCn = /[·！#￥（——）：；“”‘、，|《。》？、【】[\]]/im;
              return (!regEn.test(val) && !regCn.test(val));
            },
            showMsg (msg = '验证脚本使用错误') {
                if (document.getElementsByClassName('vue-toast').length) {
                    // 如果toast还在，则不再执行
                    return;
                }
                timer = null;
                let toastTpl = Vue.extend({// 模板添加位置类
                    template: `
                            <div class="vue-toast toast-top" style="animation: inMessage .3s linear forwards">
                                ${msg}
                            </div>
                        `
                });
                let tpl = new toastTpl().$mount().$el;// 创建实例，挂载到文档以后的地方
                document.body.appendChild(tpl);// 把创建的实例添加到body中
                timer = setTimeout(() => {// 延迟2秒后移除该提示
                    tpl.setAttribute('style', 'animation: outMessage .1s linear forwards');
                    setTimeout(() => {
                        document.body.removeChild(tpl);
                    }, 500)
                }, args.duration);
            }
        };
        //拓展method
        method = Object.assign(method, args.method || {});
        function startValidate() {
            let _rules = args.rules,
                _msg = args.msg,
                _obj = args.obj;
            for (let _inputName in _rules) {
                let _val;
                if (_inputName.split('.').length > 1) {//对象
                    let _temp = Object.assign({}, _obj);
                    //不停逼近
                    _inputName.split('.').map((val) => {
                        _temp = _temp[val]
                    });
                    _val = _temp;
                } else {
                    _val = _obj[_inputName] !== null ? _obj[_inputName] : '';//若val为null则为''
                }
                for (let singleRule in _rules[_inputName]) {
                    if (!_rules[_inputName][singleRule]) {//是否进行验证
                        continue;
                    }
                    //验证返回true/false
                    if (method[singleRule](_val)) {//true
                        continue;
                    } else {
                        method.showMsg(_rules[_inputName][singleRule]);
                        // console.log(method[singleRule](_val))
                        return false;
                    }
                }
            }
            return true;
        }

        //启动验证
        if (args.type === 'Promise') {// promise
            return new Promise((resolve, reject) => {
                if (startValidate()) {
                    resolve();
                } else {
                    reject();
                }
            })
        } else if (args.type === 'callBack') {//callback
            if (startValidate()) {
                if (typeof args.success === 'function') {
                    args.success.bind(this)();
                }
            } else {
                if (typeof args.fail === 'function') {
                    args.fail.bind(this)();
                }
            }
        } else if (args.type === 'boolean') {
            return startValidate();
        }
    }
}
export default Validate

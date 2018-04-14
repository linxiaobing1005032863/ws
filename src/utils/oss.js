import http from './request';
import store from '@/store';

function createData(info, file) {
    let fileKey = 'web1' + store.getters.uid + info.bucket + new Date().getTime() + file.name.substr(file.name.lastIndexOf('.'));
    // 组装发送数据
    var request = new FormData();
    request.append("OSSAccessKeyId", info.accessid);//Bucket 拥有者的Access Key Id。
    request.append("policy", info.policy);//policy规定了请求的表单域的合法性
    request.append("signature", info.signature);//根据Access Key Secret和policy计算的签名信息，OSS验证该签名信息从而验证该Post请求的合法性
    //---以上都是阿里的认证策略
    request.append("key", fileKey);//文件名字，可设置路径
    request.append("success_action_status", '200');// 让服务端返回200,不然，默认会返回204
    request.append('file', file);//需要上传的文件 file
    request.append('Filename', fileKey);
    return {
        key: fileKey,
        req: request
    }
}


export function send(file, success) {
    if (!file) return false;
    let info = window.localStorage.getItem('uploadInfo') == 'undefined' ? null : JSON.parse(window.localStorage.getItem('uploadInfo'));
    let now = Date.parse(new Date()) / 1000;
    if (!info || info.expire < now + 3) {
        http.get("/thirdApp/getWebAssumeRole/bit-test")
            .then(res => {
                if (!res.errorCode) {
                    window.localStorage.setItem('uploadInfo', JSON.stringify(res.data));
                    send(file, success);
                }
            })
    } else {
      if (Array.isArray(file)) {
        let upload = (_file,_index) => {
          return new Promise((resolve,reject) => {
            setTimeout(()=>{
              let data = createData(info, _file);
              http.post(info.host, data.req).then(res => res.status === 200 ? resolve(data.key) : reject())
            },150 * _index);
          })
        }
        Promise.all(file.map((val,index) => upload(val,index))).then(data => success && success(data));
      } else {
        let data = createData(info, file);
        http.post(info.host, data.req).then(res => {
          if (res.status === 200)   success && success(data.key);
        })
      }
    }
}

export function getUri(key) {
    let info = window.localStorage.getItem('downloadInfo') == 'undefined' ? null : JSON.parse(window.localStorage.getItem('downloadInfo'));
    let now = Date.parse(new Date()) / 1000;
    if (!info || new Date(info.expiration).getTime()/1000 < now + 3) {
        http.get("/thirdApp/getAppReadOnlyRole")
            .then(res => {
                if (!res.errorCode) {
                    window.localStorage.setItem('downloadInfo', JSON.stringify(res.data));
                    getUri(key);
                }
            })
    }else {
        var client = new OSS.Wrapper({
            region: 'oss-cn-beijing',
            accessKeyId: info.accessKeyId,//info.accessKeyId
            accessKeySecret: info.accessKeySecret,//info.accessKeySecret
            stsToken: info.securityToken,//info.securityToken
            bucket: info.bucket//info.bucket
        });
        return client.signatureUrl(key);
    }
}


//选自https://www.cnblogs.com/mottled/p/6979536.html

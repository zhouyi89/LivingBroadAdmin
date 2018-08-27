/*const errMsg = {
  NetTimeOut: '数据请求超时!',
  NetDataErr: '数据处理错误!',
  NetHostErr: '远程主机返回'
}*/
/*
let asynNetData = async function(url, data) {
  let msg = errMsg.NetTimeOut;
  try {
    let response = await fetch(url, data);
    msg = errMsg.NetDataErr
    if (response.ok) {
      let responseJson = await response.json();
      return {data:responseJson, status:true};
    }
    else {
      msg = errMsg.NetHostErr + ":" + response.status
      return {data:msg, status:false};
    }
  }
  catch(error) {
    try {
      if (error.message) {
        msg = error.message;
      }
    }
    catch (er) {
    }
    return {data:msg, status:false};
  }
}
*/

/*
fetch('doAct.action', {
    method: 'post',
    headers: {
      "Content-type": "application/x-www-form-urlencoded; charset=UTF-8"
    },
    body: 'foo=bar&lorem=ipsum'
  })
  .then(json)
  .then(function (data) {
    console.log('Request succeeded with JSON response', data);
  })
  .catch(function (error) {
    console.log('Request failed', error);
  });
*/
function fetchData(url, data) {
  //let msg = errMsg.NetTimeOut;
  let rt = {}
  data = data || {}
  data['credentials'] = 'include'
  return fetch(url, data)
  .then(res => {
    //msg = errMsg.NetDataErr;
    if (res.ok) {
      return res.json()
    }
    res.text().then(function(obj) {
      throw obj;
    })
  })
  .then(json => {
    rt['s'] = true;
    rt['d'] = json;
    return rt;
  })
  .catch(error => {
    rt['s'] = false;
    rt['d'] = error;
    return rt;
  })
}

export default fetchData;
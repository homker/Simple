/**
 * @desc 数据辅助模块，用于存放数据获取的辅助函数
 * @author homkerliu
 * @type {string}
 */


const Base_url = '/v1/';

/**
 * @desc 检查response状态，当发生错误的时候，将错误抛出
 * @param response
 * @returns {*}
 */
function checkStatus(response) {
    if (response.status >= 200 && response.status < 300) {
        return response;
    } else {
        var err = new Error(response.statusText);
        err.response = response;
        throw err;
    }
}

/**
 * @desc 将response 转换成JSON格式
 * @param response
 * @returns {*}
 */
function parse2Json(response) {
    return response.json();
}


/**
 * 获取数据的high-order function，用于curry
 * @param {String} [url]
 * @returns {Function}
 *
 * @example
 *  var mission = getDataFromUrl()("mission");
 *  var missionGet = mission("get");
 *  var missionById = missionGet; // return promise
 *  missionById(12).then((data)=>{  //do some thing  }).catch((err)=>console.log(err))
 *
 * 这里有个坑,如果是删除接口的话,因为是后加的,然后使用的比较少,为了兼容既有的接口,对于删除接口,请按照如下的方式构造.
 * 这个坑将在2.0版修正
 *
 * var missionDeleteById = getDataFromUrl()("delete")("mission");
 * missionDeleteById(12).then((data)=>{ //do some thing }).catch((err)=>console.log(err))
 *
 */

export function getDataFromUrl(url) {
    var URLSTRING = url ? url : Base_url;
    return function (model) {
        URLSTRING += model + '/';
        return function (method) {
            URLSTRING += method === 'get' ? '' : method + '/';
            return function (condition) {
                if (method !== 'get' && model !== 'delete') {
                    let postObj = {
                        method: 'post',
                        header: {
                            'Accept': 'application/json',
                            'Content-Type': 'application/json'
                        },
                        body: JSON.stringify(condition)
                    };
                    return Fetch(URLSTRING, postObj);
                } else {
                    return Fetch(URLSTRING + (condition === '*' ? '' : condition));
                }
            }
        }
    }
}

/**
 * fetch的基本构造函数
 * @param url
 * @param postObj
 * @returns {Promise}
 * @constructor
 */
export function Fetch(url, postObj) {
    /* if (isCache) {
     if (cache[url]) {
     return cache[url]
     } else {
     return cache[url] = fetch(url, postObj).then(checkStatus).then(parse2Json);
     }
     }*/
    console.log('do it' + url);
    return fetch(url, Object.assign({}, postObj, {
        credentials: 'include' //跨域支持
    }))
        .then(checkStatus)
        .then(parse2Json);
}

/**
 * storage 的辅助函数，提供storage的增删改查 high-order function
 * @param contentKey
 * @returns {Function}
 * @example
 *  var missionLocalstorage = localStorageFactory("mission");
 *  var saveMissionLocalStorage = missionLocalStorage("save");
 *  saveMissionLocalStorage(saveContent);
 */
export function localStorageFactory(contentKey) {
    let storage = {};
    if (window && window.localStorage) {
        storage = window.loacalStroage;
    }
    const BASE_KEY = 'MATE-SYSTEM-';
    return function (method) {
        return function (object) {
            let key = BASE_KEY + contentKey;
            if (method === 'save' || method === 'update') {
                storage[key] = object;
            }
            if (method === 'delete') {
                delete storage[key];
            } else {
                return storage[key]
            }
        }
    }

}

/**
 * 检查post返回值
 * @param json
 */
export function checkPostJson(json) {
    if (json.state == '200') {
        return json.content;
    } else {
        throw new Error(json.err)
    }
}
/**
 * 捕捉错误
 * @param err
 */
export function catchErr(err) {
    //TODO 错误类型判断,错误上报
    return err;
}



export default {
    getDataFromUrl,
    localStorageFactory,
    checkPostJson,
    catchErr
}
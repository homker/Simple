import _ from 'underscore';
import Filter from './filter';

function getTypesObject() {
    var Types = {};
    var TypesArr = ['String', 'Number', 'Boolean', 'ArrayString', 'ArrayNumber', 'ArrayBoolean'];

    function getTypeObject(key) {
        var b = {
            _state_type: key,
            isRequired: {
                _state_type: key,
                need: true
            }
        };
        var o = {};
        o[key] = b;
        return o;
    }

    for (var l = TypesArr.length; l--;) {
        Types = Object.assign({}, Types, getTypeObject(TypesArr[l]))
    }
    return Object.freeze(Types);
}

export default class BaseStore {

    constructor(props, context, dataTemple) {
        this.filter = new Filter(dataTemple);
        this.context = context;
        this.state = this.filter.filtrate(props);
    }

    getState() {
        return Object.assign({}, this.state);
    }

    updateState(props) {
        this.state = this.filter.filtrate(props);
        this.context.setState(this.state);
    }

    formatTime(dateString, formatString) {
        let D = new Date(dateString);
        var o = {
            "M+": D.getMonth() + 1, //月份
            "d+": D.getDate(), //日
            "h+": D.getHours(), //小时
            "m+": D.getMinutes(), //分
            "s+": D.getSeconds(), //秒
            "q+": Math.floor((D.getMonth() + 3) / 3), //季度
            "S": D.getMilliseconds() //毫秒
        };
        if (/(y+)/.test(formatString)) formatString = formatString.replace(RegExp.$1, (D.getFullYear() + "").substr(4 - RegExp.$1.length));
        for (var k in o) {
            if (!o.hasOwnProperty(k)) {
                continue;
            }
            if (new RegExp("(" + k + ")").test(formatString)) {
                formatString = formatString.replace(RegExp.$1, (RegExp.$1.length == 1) ? (o[k]) : (("00" + o[k]).substr(("" + o[k]).length)));
            }
        }
        return formatString;
    }

}

BaseStore.Types = getTypesObject();

var toString = Object.propertype.toString;
export default {
    isArray:function(obj){
        return toString.call(obj) === '[object Array]'
    },
    isString:function(obj){
        return toString.call(obj) === '[object String]'
    },
    isObject:function(obj){
        return toString.call(obj) === '[object Object]'
    },
    isFunction:function(obj){
        return toString.call(obj) === '[object Function]'
    },
    isBoolean:function(obj){
        return toString.call(obj) === '[object Boolean]'
    },
    isNumber:function(obj){
        return toString.call(obj) === '[object Number]'
    }
}
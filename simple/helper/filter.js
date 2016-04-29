var _ = require('./check');

const checkBase = {
    isString: _.isString,
    isNumber: function (o) {
        return !isNaN(parseInt(o))
    },
    isArray: _.isArray,
    isBoolean: _.isBoolean,
    isObject: _.isObject
};

const checkHelp = {
    low: function (o, func) {
        return func(o)
    },
    mid: function (o, func1, func2) {
        if (func1(o)) {
            if(o[0] === undefined){
                return true;
            }
            return func2(o[0]);
        }
        return false;
    },
    hig: function (o, func1, func2) {
        if (func1(o)) {
            for (var l = o.length; l--;) {
                if (!func2(o[l])) {
                    return false
                }
            }
            return true;
        }
        return false;
    }
};

const checkMid = {
    isArrayString: function (o, flag) {
        if (!flag) {
            //TODO Global Define
            flag = 'mid';
        }
        return checkHelp[flag](o, checkBase.isArray, checkBase.isString)
    },
    isArrayNumber: function (o, flag) {
        if (!flag) {
            //TODO Global Define
            flag = 'mid';
        }
        return checkHelp[flag](o, checkBase.isArray, checkBase.isNumber)
    },
    isArrayBoolean: function (o, flag) {
        if (!flag) {
            //TODO Global Define
            flag = 'mid';
        }
        return checkHelp[flag](o, checkBase.isArray, checkBase.isBoolean)
    }
};

export const check = Object.assign({}, checkBase, checkMid);

export default class Filter {

    constructor(dataTypes, defaultValue) {
        this.rules = Filter.getRule(dataTypes);
        if (defaultValue) {
            Filter.defaultValue = defaultValue;
        }
    }

    static getRule(dataType) {
        function getChildRule(types) {
            var rules = [];
            for (var k in types) {
                if (!types.hasOwnProperty(k)) {
                    continue;
                }
                var rule = {};
                var o = types[k];
                rule['key'] = k;
                if ((!o._state_type) || Array.isArray(o)) {
                    rule['rule'] = Array.isArray(o) ? 'Array' : 'Object';
                    if (!Array.isArray(o)) {
                        rule['child'] = getChildRule(o);
                    } else {
                        rule['child'] = getChildRule(o[0]);
                    }
                } else {
                    rule['need'] = o.need;
                    rule['rule'] = o._state_type;
                }
                rules.push(rule);
            }
            return rules;
        }

        return getChildRule(dataType);
    }

    checkType(rule, data) {
        if (check['is' + rule.rule](data)) {
            return true
        } else {
            throw new Error("[type error]" + rule.key + "'s type is wrong , it must be " + rule.rule + ',but it is ' + (typeof data));
        }
    }

    getDefaultValue(rule) {
        if (Array.isArray(rule)) {
            var _state = {};
            for (var l = rule.length; l--;) {
                _state[rule[l].key] = this.getDefaultValue(rule[l])
            }
            return _state
        }
        if (rule.rule === 'Object') {
            return this.getDefaultValue(rule.child)
        } else if (rule.rule === 'Array') {
            return [this.getDefaultValue(rule.child)]
        } else {
            return Filter.defaultValue[rule.rule]
        }
    }

    filterChild(rules, datas) {
        var _state = {};
        for (var l = rules.length; l--;) {
            var rule = rules[l];
            if (datas.hasOwnProperty(rule.key)) {
                var data = datas[rule.key];
                if (rule.child) {
                    if (this.checkType(rule, data)) {
                        if (rule.rule === 'Object') {
                            _state[rule.key] = this.filterChild(rule.child, data);
                        } else {
                            _state[rule.key] = [];
                            for (var i = data.length; i--;) {
                                _state[rule.key].push(this.filterChild(rule.child, data[i]))
                            }
                        }
                    }
                } else {
                    if (this.checkType(rule, data)) {
                        _state[rule.key] = data;
                    }
                }
            } else {
                if (rule.need) {
                    throw new Error(rule.key + 'is need!');
                } else {
                    _state[rule.key] = this.getDefaultValue(rule);
                }
            }
        }
        return _state;
    };

    filtrate() {
        var args = _.toArray(arguments);
        var props = args.shift();
        var _props = _.reduce(args, function (memo, filter) {
            if (!_.isFunction(filter)) {
                throw new Error('type err,args must be a function');
            }
            return filter(memo);
        }, Object.assign({}, props));
        return Object.freeze(this.filterChild(this.rules, _props));
    }
}

Filter.defaultValue = {
    String: '',
    Object: {},
    Number: 0,
    Boolean: false,
    ArrayString: [''],
    ArrayNumber: [0],
    ArrayBoolean: [false]
};
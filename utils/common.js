import { uuid } from 'vue-uuid';

export function getUuid(){
    return uuid.v1().replace(/-/g, '');;
}


export const platform = uni.getSystemInfoSync().platform
export const isIos = platform === 'ios'
export const isAndroid = platform === 'android'
export const isApp = isIos || isAndroid


/**
 * 包装promise reject
 * @param promise
 */
export function handlerPromise(promise) {
  return promise.then(data => [null, data]).catch(err => [err === '' ? 'no' : err])
}

// const hasOwnProperty = Object.prototype.hasOwnProperty;
export function type(param) {
    return Object.prototype.toString.call(param).slice(8, -1).toLowerCase()
}

export function isUndefined(param) {
    return type(param) === 'undefined' || param === 'undefined'
}

export function isNull(param) {
    return type(param) === 'null' || param === 'null'
}

export function isString(param) {
    return type(param) === 'string'
}

export function isNumber(param) {
    // return type(param) === 'number' || type(+param) === 'number'
    return type(param) === 'number'
}

export function isFunction(param) {
    return type(param) === 'function'
}

export function isFalse(param) {
    return !param || isUndefined(param) || isNull(param) || Number.isNaN(param)
}

export function isEmptyArr(param) {
    return isArray(param) && param.length === 0
}

export function isEmptyObject(param) {
    return isObject(param) && Object.keys(param).length === 0
}

export function isObject(param) {
    return type(param) === 'object' || (param instanceof Object)
}

export function isArray(param) {
    return Array.isArray(param) || type(param) === 'array'
}


export function parseQuery(queryString = '') {
    if (!queryString) {
        return {}
    }

    if (/\?/.test(queryString)) {
        queryString = queryString.slice(1)
    }

    if (queryString.indexOf('?') > -1) {
        queryString = queryString.split('?').join('&')
    }

    const data = {}
    queryString.split('&').forEach(item => {
        const param = item.split('=')
        if (!param[0]) {
            return;
        }

        data[param[0]] = param[1] ? param[1].trim() : '';
    })
    return data;
}


export function buildQuery(params) {
    const query = []

    for (const prop in params) {
        query.push(`${prop}=${params[prop]}`)
    }

    return query.join('&')
}

export function random(min, max, floatLength = 0) {
    return (Math.random() * (max - min) + min).toFixed(floatLength) - 0;
}


/**
 * 保持两位， 前面补0
 */
export function fill(fillStr,n) {
	if(isUndefined(fillStr) || isNull(fillStr)){
		fillStr = '0';
	}
    return n >= 10 ? n + '' : fillStr + n;
}


export function deepClone(source, deep = 10) {
    if (typeof source !== 'object' || !source || deep === 0) {
        return source;
    }
    if (Array.isArray(source)) {
        return source.map(value => {
            if (typeof value !== 'object' || !value) {
                return value;
            }
            else {
                return deepClone(value, deep - 1);
            }
        });
    }
    else {
        const cloned = {};
        for (const key of Object.keys(source)) {
            const value = source[key];
            cloned[key] = deepClone(value, deep - 1);
        }
        return cloned;
    }
}

export function randomStr(length) {
    return Math.random().toString().slice(2, length + 2)
}

export function jsonParse(jsonString, defaultValue = {}) {
    if (!jsonString) {
        return defaultValue;
    }

    if (!isString(jsonString)) {
        return jsonString;
    }

    try {
        const result = JSON.parse(jsonString)
        return result;
    } catch (e) {
        return defaultValue;
    }
}

export function jsonStringify(data, defaultValue = '') {
    if (!data) {
        return defaultValue;
    }

    try {
        const result = JSON.stringify(data)
        return result;
    } catch (e) {
        return defaultValue;
    }
}

/**
 * 将设备读取到的tds，做显示处理
 *  -0.00 -》 需要转为0.00， 但是其他负数不做处理
 *  统一保留小数点后两位
 * @param {number} tds
 * @return {string}
 */
export function formateTds(tds) {
    // 测试用
    // console.log('-0.000', formateDds(-0.000))
    // console.log('0.000', formateDds(0.000))
    // console.log('0.0001', formateDds(0.0001))
    // console.log('-0.0001', formateDds(-0.0001))
    // console.log('0.0061', formateDds(0.0061))
    // console.log('90.0061', formateDds(90.0061))
    if (tds.toString() === '0') {
        return '0.00'
    }
    return (Math.round(tds * 100) / 100).toFixed(2)
}

/**
 * 整型转 浮点
 * @param {number|string} num
 * @param decimal 精度
 * @return {number}
 */
export function intToFloat(num, decimal=2) {
    // 不存在时直接给空 前端自行判断现在不会存在0的情况 因为都会被转为0.00
    if([undefined,null,''].indexOf(num)>=0) {
        return ''
    }
    // 处理0的特殊情况
    if(Number(num) === 0) {
        return Number(num).toFixed(decimal)
    } else{
        return  Number(num) / 100
    }
}
/**
 * 处理后端返回的 整型数据 -》 化为实际浮点
 * @param responseData
 * @return {object}
 */
export function parseRecipeNumberData(responseData) {
    // const data = Object.assign({}, responseData)
    const data = responseData
    data.tds = intToFloat(data.tds, 2)
    data.fluidWeight = intToFloat(data.fluidWeight, 2)
    data.powderWeight = intToFloat(data.powderWeight, 2)
    data.waterWeight = intToFloat(data.waterWeight, 2)
    return data
}

/**
 * 计算cbr
 * @param responseData
 * @return {string}
 */
export function getRecipeCbr(responseData) {
    let cbr = '--'
    // 下面这段为原代码里的逻辑
    if(responseData.boilingCode === 'B00001') {
       cbr = (parseFloat(responseData.waterWeight??0)!==0?
            (parseFloat(responseData.powderWeight??0)/parseFloat(responseData.waterWeight)).toFixed(2)
            : '--')
    }
    return cbr
}

//ArrayBuffer转Hex
export function ab2hex(buffer) {
	const hexArr = Array.prototype.map.call(
		new Uint8Array(buffer),
		function (bit) {
			return ('00' + bit.toString(16)).slice(-2)
		}
	)
	return hexArr.join('')
}

//Hex转ArrayBuffer
export function hex2ab(hex) {
	const data = hex.match(/[\da-f]{2}/gi) || [];
	let typedArray = new Uint8Array(
		data.map((h) => {
			return parseInt(h, 16);
		}),
	);
	return typedArray.buffer;
}

//Hex转有符号Int
export function hex2symbolInt(hex) {
	let two = parseInt(hex, 16).toString(2);
	let bitNum = hex.length * 4;
	if (two.length < bitNum) {
		while (two.length < bitNum) {
			two = "0" + two;
		}
	}

	if (two.substring(0, 1) == "0") {
		two = parseInt(two, 2);

		return two;
	} else {
		let two_unsign = "";
		two = parseInt(two, 2) - 1;
		two = two.toString(2);
		two_unsign = two.substring(1, bitNum);
		two_unsign = two_unsign.replace(/0/g, "z");
		two_unsign = two_unsign.replace(/1/g, "0");
		two_unsign = two_unsign.replace(/z/g, "1");
		two = parseInt(-two_unsign, 2);

		return two;
	}
}

//Hex转Int
export function hex2Int(hex) {
	var len = hex.length,
		a = new Array(len),
		code;
	for (var i = 0; i < len; i++) {
		code = hex.charCodeAt(i);
		if (48 <= code && code < 58) {
			code -= 48;
		} else {
			code = (code & 0xdf) - 65 + 10;
		}
		a[i] = code;
	}

	return a.reduce((acc, c) => {
		acc = 16 * acc + c;
		return acc;
	}, 0);
}

export function int2hex(val, length, signed) {
	var num = parseInt(val);
	var hex_str = '';
	var hex_str_length = length * 2; //1个字节=2个16进制字符
	var min = 0;
	var max = 0;
	if (signed) { //带符号位
		min = -1 * Math.pow(2, 8 * length - 1);
		max = Math.pow(2, 8 * length - 1) - 1;
		if (num < min || num > max) { //数字超出转换范围
			// console.warn(`out of range,min is ${min},max is ${max},but val is ${num}.`)
		} else if (num < 0) { //传入合法负数
			//计算补码
			hex_str = (Math.pow(2, 8 * length) + num).toString(16);
			if (hex_str.length < hex_str_length) {
				hex_str = 'f'.repeat(hex_str_length - hex_str.length) + hex_str;
			}
		} else { //传入合法正数
			hex_str = num.toString(16);
			if (hex_str.length < hex_str_length) {
				hex_str = '0'.repeat(hex_str_length - hex_str.length) + hex_str;
			}
		}
	} else { //不带符号位
		min = 0;
		max = Math.pow(2, 8 * length) - 1;
		if (num < min || num > max) { //数字超出转换范围
			// console.warn(`out of range,min is ${min},max is ${max},but val is ${num}.`)
		} else { //传入合法正数
			hex_str = num.toString(16);
			if (hex_str.length < hex_str_length) {
				hex_str = '0'.repeat(hex_str_length - hex_str.length) + hex_str;
			}
		}
	}
	return hex_str
}

export function	mul(arg1, arg2) {
	var m = 0,
		s1 = arg1.toString(),
		s2 = arg2.toString();
	try {
		m += s1.split(".")[1].length
	} catch (e) { }
	try {
		m += s2.split(".")[1].length
	} catch (e) { }
	return Number(s1.replace(".", "")) * Number(s2.replace(".", "")) / Math.pow(10, m)
}

export function add(arg1, arg2) {
	var r1, r2, m;
	try {
		r1 = arg1.toString().split(".")[1].length
	} catch (e) {
		r1 = 0
	}
	try {
		r2 = arg2.toString().split(".")[1].length
	} catch (e) {
		r2 = 0
	}
	m = Math.pow(10, Math.max(r1, r2))
	return (arg1 * m + arg2 * m) / m
}

export function sub(arg1, arg2) {
	var r1, r2, m, n;
	try {
		r1 = arg1.toString().split(".")[1].length
	} catch (e) {
		r1 = 0
	}
	try {
		r2 = arg2.toString().split(".")[1].length
	} catch (e) {
		r2 = 0
	}
	m = Math.pow(10, Math.max(r1, r2));
	n = (r1 >= r2) ? r1 : r2;
	return ((arg1 * m - arg2 * m) / m).toFixed(n);
}

/**
 * 整数转浮点数，要四舍五入
 * @param {number} num 整数
 * @param {number} pre 浮点数保留位数
 */
export function int2DoubleRound(num, pre) {
	const mul = 10 ** pre
	var f = Math.round(num * mul) / mul
	var s = f.toString()
	var rs = s.indexOf('.')
	if(rs < 0){
		rs = s.length
		s += '.'
	}else{
		s = s.substr(0, rs + 1 + pre)
	}
	while(s.length <= rs + pre){
		s += '0'
	}
	return s
}

/**
 * 整数转浮点数，不需要四舍五入
 * @param {number} num 整数
 * @param {number} pre 浮点数保留位数
 */
export function int2Double(num, pre) {
	const mul = 10 ** pre
	var f = (num * mul) / mul
	var s = f.toString()
	var rs = s.indexOf('.')
	if(rs < 0){
		rs = s.length
		s += '.'
	}else{
		s = s.substr(0, rs + 1 + pre)
	}
	
	while(s.length <= rs + pre){
		s += '0'
	}

	return s
}

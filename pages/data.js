export function processData(data) {
  // check data header
  if (data.substr(0, 4) !== "DFDF" && data.substr(0, 4) !== "dfdf") {
    console.log("Invalid data header")
    return false;
  }

  // calculate checksum
  var sum = 0;
  for (var i = 0; i < data.length - 2; i += 2) {
    sum += parseInt(data.substr(i, 2), 16);
  }

  // verify checksum
  var checksum = parseInt(data.substr(data.length - 2), 16);
  if (sum % 256 !== checksum) {
    console.log("Invalid checksum")
    return false;
  }

  // remove header
  data = data.substr(4);

  // get func, cmd, datalen
  var func = parseInt(data.substr(0, 2), 16);
  var cmd = parseInt(data.substr(2, 2), 16);
  var datalen = parseInt(data.substr(4, 2), 16);

  // get data
  var databytes = data.substr(6, datalen * 2);
  if (func === 0 && cmd === 0) {
    // 需要分包处理
  } else if ((func === 3 && cmd === 0) || (func === 3 && cmd === 2) || (func === 3 && cmd === 1)) {
    // test

    // 序号
    let count = databytes.substr(0, 2)
    let returnData = {
      type: '',
      count: count,
    }
    if (count === '00') {
      // 0b test start 
      // 00 test finished
      let result = databytes.substr(2, 2)
      returnData.type = result
      return {
        func: func,
        cmd: cmd,
        datalen: datalen,
        data: returnData
      };
    } else if (count === '01') {
      // current temperature
      let temp = hexToNumber(databytes.substr(2, 4)) / 10
      // calibration temperature
      let caliTemp = hexToNumber(databytes.substr(6, 4)) / 10
      // temperature unit
      let tempUnit = hexToNumber(databytes.substr(10, 2))
      return {
        func: func,
        cmd: cmd,
        datalen: datalen,
        data: {
          temp: temp,
          caliTemp: caliTemp,
          tempUnit: tempUnit,
          ...returnData
        }
      };
    } else if (count === '02') {
      let concentration = hexToNumber(databytes.substr(2, 4)) / 100
      let refractiveIndex = hexToNumber(databytes.substr(6, 8)) / 100000
      return {
        func: func,
        cmd: cmd,
        datalen: datalen,
        data: {
          concentration,
          refractiveIndex,
          ...returnData
        }
      };

    }
  } else if ((func === 1 && cmd === 0) || (func === 1 && cmd === 1) || (func === 1 && cmd === 2) || (func === 1 && cmd === 3)) {
    // 转数字
    databytes = hexToNumber(databytes);
  } else {
    // 转字符串
    databytes = hexToString(databytes);
  }

  return {
    func: func,
    cmd: cmd,
    datalen: datalen,
    data: databytes
  };
}
// 将16进制字符串转换为字符串
function hexToString(hexString) {
  var str = ""; // 存放转换后的字符串
  for (var i = 0; i < hexString.length; i += 2) {
    var code = parseInt(hexString.substr(i, 2), 16); // 将每两个字符转换成一个16进制数值
    str += String.fromCharCode(code); // 将16进制数值转换成字符，并拼接到字符串中
  }
  return str; // 返回转换后的字符串
}

// 将16进制字符串转换为数字
function hexToNumber(hexString) {
  let num = parseInt(hexString, 16);

  // 如果最高位为1，则将其转换为有符号整数
  if ((num & 0x8000) > 0) {
    num = -(0x10000 - num);
  }

  return num;
}

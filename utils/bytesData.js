/**
 * 将字符串转换为一个包含字节值的数组
 *
 * @param {string} str - 要转换的字符串
 * @returns {Array} 包含字节值的数组
 */
function stringToBytes(str) {
    const bytes = [];
    for (let i = 0; i < str.length; i += 2) {
      const byte = parseInt(str.slice(i, i + 2), 16);
      bytes.push(byte);
    }
    return bytes;
  }
  
/**
 * 计算校验和
 *
 * @param {Array} data - 数据内容，一个包含字节值的数组
 * @returns {string} 校验和的值，十六进制格式的字符串
 */
// function calculateChecksum(data) {
//     let checksumLowByte = 0;
//     let checksumHighByte = 0;
//     for (let i = 0; i < data.length; i++) {
//       checksumLowByte += data[i] & 0xFF;
//       checksumHighByte += data[i] >> 8;
//     }
//     const checksum = (checksumLowByte & 0xFF) + (checksumHighByte << 8);
//     checksumLowByte = checksum & 0xFF;
//     checksumHighByte = checksum >> 8;
//     return checksumHighByte.toString(16).toUpperCase().padStart(2, '0') + checksumLowByte.toString(16).toUpperCase().padStart(2, '0');

//   }
  function calculateChecksum(data) {
    let checksum = 0;
    for (let i = 0; i < data.length; i++) {
      checksum += data[i] & 0xFF;
    }
    return (checksum & 0xFF).toString(16).toUpperCase().padStart(2, '0');
}

  /**
 * 发送数据
 *
 * @param {string} func - 功能码，两位十六进制字符串
 * @param {string} cmd - 命令码，两位十六进制字符串
 * @param {string} dataLen - 数据长度，两位十六进制字符串
 * @param {string} data - 数据内容，十六进制字符串
 * @returns {ArrayBuffer} 组装好的数据
 */
export function sendData(func, cmd, dataLen, data) {
  const head = 'DFDF';
  const writeData = `${func}${cmd}${dataLen}${data}`.replace(/\s+/g, '');
  const bytesData = stringToBytes(`${head}${writeData}`);
  const checksum = calculateChecksum(bytesData);
  const finalData = `${head}${writeData}${checksum}`;
  console.warn('计算出来的总和', checksum);
  console.warn('组装好的数据', finalData);
  // return hexStringToArrayBuffer(finalData);
  return finalData
}

  /**
   * 将十六进制字符串转换为 ArrayBuffer 对象
   *
   * @param {string} hexString - 要转换的十六进制字符串
   * @returns {ArrayBuffer} 转换后的 ArrayBuffer 对象
   */
  function hexStringToArrayBuffer(hexString) {
    const buffer = new ArrayBuffer(hexString.length / 2);
    const view = new DataView(buffer);
    for (let i = 0; i < hexString.length; i += 2) {
      const byte = parseInt(hexString.substr(i, 2), 16);
      view.setUint8(i / 2, byte);
    }
    return buffer;
  }
  
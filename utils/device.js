/**
 * 将数据写进设备
 * @param {*} device 设备数据
 *  value 要写入的16进制值
 *  serviceId 服务id
 *  deviceId 设备id
 *  characteristicId 特征值 uuid
 * @returns
 */
export function writeToDevice(device) {
	const { value, serviceId, deviceId, characteristicId } = device;
	const data = {
		deviceId,
		serviceId,
		characteristicId,
		value: hex2ab(value)
	}
	console.warn('writeToDevice', data)
	return write2dev(data)
}

//写入数据到设备
export function write2dev(data) {
	const {
		deviceId,
		serviceId,
		characteristicId,
		value
	} = data;
	console.log('write2dev配置', deviceId, serviceId, characteristicId);
	console.log('write2dev数据', value, ab2hex(value));
	value[0]--
	// console.log(data)
	// console.log(`serviceId: ${serviceId}`)
	// console.log(`characteristicId: ${characteristicId}`)
	return new Promise((resolve, reject) => {
		// plus.bluetooth.writeBLECharacteristicValue({
		uni.writeBLECharacteristicValue({
			deviceId,
			serviceId,
			characteristicId,
			value,
			success(res) {
				console.warn('写入成功')
				resolve()
			},
			fail(err) {
				console.log(`write2dev失败: ${JSON.stringify(err)}, ${err.errMsg || err.message}`)
				reject(err)
			},
		})
	})
}//Hex转ArrayBuffer//ArrayBuffer转Hex
export function ab2hex(buffer) {
	const hexArr = Array.prototype.map.call(
		new Uint8Array(buffer),
		function (bit) {
			return ('00' + bit.toString(16)).slice(-2)
		}
	)
	return hexArr.join('')
}
export function hex2ab(hex) {
	const data = hex.match(/[\da-f]{2}/gi) || [];
	let typedArray = new Uint8Array(
		data.map((h) => {
			return parseInt(h, 16);
		}),
	);
	return typedArray.buffer;
}
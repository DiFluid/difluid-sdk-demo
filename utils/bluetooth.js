// https://uniapp.dcloud.net.cn/api/system/bluetooth.html
import { toast, toastError } from "@/utils/dialog"
import { handlerPromise } from './common'

const targetDevice = [
	"00FF" // R2 Extract
];
const signalMin = 5;

const bluetoothErrorCode = {
	"-1": "Connected",
	"0": "Normal",
	"10000": "Bluetooth adaptor not initialized",
	"10001": "Current bluetooth adaptor not available",
	"10002": "Specific device not found",
	"10003": "Connection Failure",
	"10004": "Specific service not found",
	"10005": "Specific eigenvalue not found",
	"10006": "Current connection is off",
	"10007": "Current eigenvalue not supporting this operation",
	"10008": "All other system error",
	"10009": "BLE is not supported by system version lower than 4.3",
	"10010": "Connected",
	"10011": "Pairing device requires a pairing code",
	"10012": "Connecting timeout",
	"10013": "DeviceId is empty or format incorrect"
}

//---------------------------bluetooth adapter--------------------------------

/**
 * Adapter Initialization
 */
export function initBluetooth() {
	return handlerPromise(
		new Promise((resolve, reject) => {
			uni.openBluetoothAdapter({
				success(res) {
					console.log('Initialization Success', res)
					onBluetoothAdapterStateChange()
					resolve(true)
				},
				fail(error) {
					//toast("Please confirm your Bluetooth is turned on");
					console.error('Initialization Failed', error)
					reject("Please confirm your Bluetooth is turned on")
				}
			})
		})
	)
}

/**
 * watch bluetooth adapter state
 * @param {boolean} discovering
 * @param {boolean} available 
 */
export function onBluetoothAdapterStateChange() {
	return new Promise((resolve, reject) => {
		uni.onBluetoothAdapterStateChange(function (res) {
			if (!res.available && res.discovering) {
				toast("Bluetooth disconnected");
				stopBluetoothDevicesDiscovery()
			}
			resolve(res)
		})
	})
}

/**
 * get bluetooth adapter state
 * @param {boolean} discovering
 * @param {boolean} available 
 */
export function getBluetoothAdapterState() {
	return new Promise((resolve, reject) => {
		uni.getBluetoothAdapterState({
			success(res) {
				resolve(res)
			},
			fail(error) {
				toast("Please confirm your Bluetooth is turned on");
				console.error('[getBluetoothAdapterState]', error)
				reject()
			}
		});
	})
}

//---------------------------device discovery--------------------------------

/**
 * 搜索附近蓝牙
 * @param {*} onBluetoothDeviceFound 搜索到蓝牙设备时的回调
 * @returns
 */
export function startBluetoothDevicesDiscovery(onDeviceFoundCallback, failFun) {
	return new Promise((resolve, reject) => {

		// check bluetooth adapter state first
		getBluetoothAdapterState().then(res => {
			uni.startBluetoothDevicesDiscovery({
				services: services,
				interval: 100,
				success() {
					/**
					 * uni.onBluetoothDeviceFound output params
					 * @param {String} name					Bluetooth device name
					 * @param {String} deviceId				MAC address of the Bluetooth device (Encrypted on IOS)
					 * @param {Number} RSSI	    			Signal strength of the Bluetooth device
					 * @param {ArrayBuffer} advertisData	The manufacturer data segment of the Bluetooth device's advertising data
					 * @param {Array<String>} advertisServiceUUIDs	The service UUID list of the Bluetooth device's advertising data
					 * @param {String} localName 			The local name of the Bluetooth device's advertising data
					 * @param {Object} serviceData			The service data segment of the Bluetooth device's advertising data
					 */

					uni.onBluetoothDeviceFound(res => {
						let devices = res.devices || []
						let filtedDevices = [];
						for (let i = 0; i < devices.length; i++) {
							const item = devices[i];
							const service = item.advertisServiceUUIDs[0].substr(4, 4);
							const RSSI = item.RSSI + 100;
							if (service && targetDevice.includes(service) && RSSI >= signalMin) {
								filtedDevices.push({
									service: service,
									deviceId: item.deviceId,
									name: item.name,
									signal: RSSI,
									advertisServiceUUIDs: item.advertisServiceUUIDs,
									characteristicsId: "",
									serviceId: ""
								})
							}
						}
						if (filtedDevices.length > 0) {
							onDeviceFoundCallback(filtedDevices);
						}
					})
					resolve();
				},
				fail(err) {
					toast("Please confirm your Bluetooth is turned on");
					failFun();
					reject(err);
				}
			})
		}).catch(err => {
			reject(err);
		})
	})
}

/**
 * Stop searching for Bluetooth devices
 */
export function stopBluetoothDevicesDiscovery() {
	return handlerPromise(
		new Promise((resolve, reject) => {
			uni.stopBluetoothDevicesDiscovery({
				success() {
					resolve();
					console.warn('stop search bluetooth device success')
				},
				fail(err) {
					reject(err);
				}
			})
		})
	)
}

//---------------------------device connection--------------------------------

/**
 * create bluetooth connection
 */
export function createBLEConnection(device) {
	return handlerPromise(
		new Promise((resolve, reject) => {
			uni.showLoading({
				title: 'connecting...',
				mask: true,
			})
			uni.createBLEConnection({
				deviceId: device.deviceId,
				timeout: 5000,
				success(res) {
					// 停止搜索
					try {
						stopBluetoothDevicesDiscovery()
					} catch (e) {
						console.log('stop bluetooth discovery failed', err)
					}

					uni.hideLoading()
					resolve(res)
				},
				fail(err) {
					toast("Connection failure")
					console.log('Create connection failed', err)
					uni.hideLoading()
					reject(err)
				}
			})
		})
	)
}

/**
 * close bluetooth connection
 */
export function closeBLEConnection(deviceId) {
	return new Promise((resolve, reject) => {
		uni.closeBLEConnection({
			deviceId,
			success(res) {
				toast("Bluetooth disconnected")
				resolve()
			},
			fail(res) {
				toastError(res)
				resolve()
			}
		})
	})
}

/**
 * get connected bluetooth devices
 */
export function getConnectedBluetoothDevices(uuidList) {
	return handlerPromise(
		new Promise((resolve, reject) => {
			uni.getConnectedBluetoothDevices({
				services: uuidList,
				success(res) {
					console.log('Get connected bluetooth devices success', res)
					resolve(res.devices || []);
				},
				fail(err) {
					console.log('No device connected yet', err)
					toast(bluetoothErrorCode[err.errCode])
					if (+err.errCode === 10000) {
						initBluetooth()
					}
					reject('No device connected yet');
				}
			})
		})
	)
}

/**
 * set bluetooth max transfer unit
 */
export function setBLEMTU(device) {
	console.log("js setBLEMTU...", device)
	return handlerPromise(new Promise((resolve, reject) => {

		uni.setBLEMTU({
			deviceId: device.deviceId,
			mtu: device.mtu,
			success(res) {
				console.log('mtu set success', res)
				resolve(res);
			},
			fail(err) {
				console.error('mtu set failed', err)
				reject(err);
			}
		})

	}))

}

//---------------------------device service--------------------------------

/**
 * get all services of the connected device
 */
export function getServices(deviceId) {
	return handlerPromise(
		new Promise((resolve, reject) => {
			uni.getBLEDeviceServices({
				deviceId: deviceId,
				success(res) {
					console.log('get services success', res)
					resolve(res);
				},
				fail(err) {
					console.error('get services failed', err)
					reject(err);
				}
			})
		})
	);
}

/**
 * get bluetooth device characteristics
 */
export function getBLEDeviceCharacteristics(deviceId, serviceId) {
	console.log("getBLEDeviceCharacteristics_deviceId_serviceId", deviceId, serviceId)

	return handlerPromise(
		new Promise((resolve, reject) => {
			setTimeout(() => {
				uni.getBLEDeviceCharacteristics({
					deviceId,
					serviceId,
					success(res) {
						const list = res.characteristics || []
						console.log('get uuid list', list)

						const uuid = (list[list.length - 1] || {}).uuid

						if (uuid) {
							resolve({
								uuid,
								list
							})
						}
						else {
							reject('uuid not found')
						}
					},
					fail(err) {
						console.log('failed to get uuid', err)
						reject(err)
					},
				})
			}, 1000);
		})
	)
}

/**
 * watch characteristic value change
 */
export function onBLECharacteristicValueChange(callback) {
	console.log('watch characteristic value change')
	uni.onBLECharacteristicValueChange(callback);
}

/**
 * enable notification of characteristic value change
 */
export function notifyBLECharacteristicValueChange(deviceId, serviceId, characteristicId, success) {
	uni.notifyBLECharacteristicValueChange({
		state: true,
		deviceId,
		serviceId,
		characteristicId,
		success(res) {
			console.log('subscribe notification success', res)
			if (success) {
				success(res)
			}
		},
		fail(err) {
			console.error('subscribe notification failed', err)
		}
	})
}
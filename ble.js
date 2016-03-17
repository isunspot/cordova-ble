// API definition for EvoThings BLE plugin.
//
// Use jsdoc to generate documentation.

// The following line causes a jsdoc error.
// Use the jsdoc option -l to ignore the error.
var exec = cordova.require('cordova/exec');

/**
 * @module cordova-plugin-ble
 * @description Functions and properties in this module are available
 * under the global name <code>evothings.ble</code>
 */

/**
 * Start scanning for devices.
 * <p>An array of service UUID strings may be given (optional parameter).
 * One or more service UUIDs must be specified for iOS background scanning to work.</p>
 * <p>Found devices and errors are reported to the supplied callback functions.</p>
 * <p>Will keep scanning until you call stopScan().</p>
 * To conserve energy, call stopScan() as soon as you've found the device you're looking for.
 * <p>Calling this function while scanning is in progress has no effect?</p>
 *
 * @param {array} uuids - Array with service UUID strings (optional).
 * @param {scanCallback} success - Success callback, called repeatedly for each found device.
 * @param {failCallback} fail - Error callback.
 *
 * @example
 *   // Scan for all services.
 *   evothings.ble.startScan(
 *       function(device)
 *       {
 *           console.log('BLE startScan found device named: ' + device.name);
 *       },
 *       function(errorCode)
 *       {
 *           console.log('BLE startScan error: ' + errorCode);
 *       }
 *   );
 *
 *   // Scan for specific service (or services).
 *   evothings.ble.startScan(
 *       ['0000ffff-0000-1000-8000-00805f9b34fb'],
 *       function(device)
 *       {
 *       console.log('BLE startScan found device named: ' + device.name);
 *       },
 *       function(errorCode)
 *       {
 *       console.log('BLE startScan error: ' + errorCode);
 *       }
 *   );
 */
exports.startScan = function(uuids, success, fail) {
	if ('function' == typeof uuids)
	{
		// No Service UUIDs specified.
		exec(uuids, success, 'BLE', 'startScan', []);
	}
	else
	{
		exec(success, fail, 'BLE', 'startScan', [uuids]);
	}
};

/** This function is a parameter to startScan() and is called when a new device is discovered.
* @callback scanCallback
* @param {DeviceInfo} device
*/

/** Info about a BLE device.
* @typedef {Object} DeviceInfo
//* @property {string} address - Has the form xx:xx:xx:xx:xx:xx, where x are hexadecimal characters.
* @property {string} address - Uniquely identifies the device. Pass this to connect().
* The form of the address depends on the host platform.
* @property {number} rssi - A negative integer, the signal strength in decibels.
* @property {string} name - The device's name, or nil.
* @property {string} scanRecord - Base64-encoded binary data. Its meaning is device-specific. Not available on iOS.
* @property {AdvertisementData} advertisementData - Object containing some of the data from the scanRecord. Available natively on iOS. Available on Android by parsing the scanRecord, which is implemented in the library {@link https://github.com/evothings/evothings-examples/tree/master/resources/libs/evothings/easyble|easyble.js}.
*/

/** Information extracted from a scanRecord. Some or all of the fields may be undefined. This varies between BLE devices.
 * Depending on OS version and BLE device, additional fields, not documented here, may be present.
 * @typedef {Object} AdvertisementData
 * @property {string} kCBAdvDataLocalName - The device's name. Equal to DeviceInfo.name.
 * @property {number} kCBAdvDataTxPowerLevel - Transmission power level as advertised by the device.
 * @property {number} kCBAdvDataChannel - A positive integer, the BLE channel on which the device listens for connections. Ignore this number.
 * @property {boolean} kCBAdvDataIsConnectable - True if the device accepts connections. False if it doesn't.
 * @property {array} kCBAdvDataServiceUUIDs - Array of strings, the UUIDs of services advertised by the device. Formatted according to RFC 4122, all lowercase.
 * @property {object} kCBAdvDataServiceData - Dictionary of strings to strings. The keys are service UUIDs. The values are base-64-encoded binary data.
 * @property {string} kCBAdvDataManufacturerData - Base-64-encoded binary data. This field is used by BLE devices to advertise custom data that don't fit into any of the other fields.
 */

/** This function is called when an operation fails.
* @callback failCallback
* @param {string} errorString - A human-readable string that describes the error that occurred.
*/

/** Stops scanning for devices.
*
* @example
evothings.ble.stopScan();
*/
exports.stopScan = function() {
	exec(null, null, 'BLE', 'stopScan', []);
};

/** Connect to a remote device.
* @param {string} address - From scanCallback.
* @param {connectCallback} win
* @param {failCallback} fail
* @example
evothings.ble.connect(
	address,
	function(info)
	{
		console.log('BLE connect status for device: '
			+ info.deviceHandle
			+ ' state: '
			+ info.state);
	},
	function(errorCode)
	{
		console.log('BLE connect error: ' + errorCode);
	}
);
*/
exports.connect = function(address, win, fail) {
	exec(win, fail, 'BLE', 'connect', [address]);
};

/** Will be called whenever the device's connection state changes.
* @callback connectCallback
* @param {ConnectInfo} info
*/

/** Info about connection events and state.
* @typedef {Object} ConnectInfo
* @property {number} deviceHandle - Handle to the device. Save it for other function calls.
* @property {number} state - One of the {@link module:cordova-plugin-ble.connectionState} keys.
*/

/** A map describing possible connection states.
* @alias module:cordova-plugin-ble.connectionState
* @readonly
* @enum
*/
exports.connectionState = {
	/** STATE_DISCONNECTED */
	0: 'STATE_DISCONNECTED',
	/** STATE_CONNECTING */
	1: 'STATE_CONNECTING',
	/** STATE_CONNECTED */
	2: 'STATE_CONNECTED',
	/** STATE_DISCONNECTING */
	3: 'STATE_DISCONNECTING',

	// TODO: Add these in the next release of the BLE plugin.
	// /** 0 */
	// 'STATE_DISCONNECTED': 0,
	// /** 1 */
	// 'STATE_CONNECTING': 1,
	// /** 2 */
	// 'STATE_CONNECTED': 2,
	// /** 3 */
	// 'STATE_DISCONNECTING': 3,
};

/** Close the connection to a remote device.
* <p>Frees any native resources associated with the device.
* <p>Does not cause any callbacks to the function passed to connect().

* @param {number} deviceHandle - A handle from {@link connectCallback}.
* @example
evothings.ble.close(deviceHandle);
*/
exports.close = function(deviceHandle) {
	exec(null, null, 'BLE', 'close', [deviceHandle]);
};

/** Fetch the remote device's RSSI (signal strength).
* @param {number} deviceHandle - A handle from {@link connectCallback}.
* @param {rssiCallback} win
* @param {failCallback} fail
* @example
evothings.ble.rssi(
	deviceHandle,
	function(rssi)
	{
		console.log('BLE rssi: ' + rssi);
	},
	function(errorCode)
	{
		console.log('BLE rssi error: ' + errorCode);
	}
);
*/
exports.rssi = function(deviceHandle, win, fail) {
	exec(win, fail, 'BLE', 'rssi', [deviceHandle]);
};

/** This function is called with an RSSI value.
* @callback rssiCallback
* @param {number} rssi - A negative integer, the signal strength in decibels.
*/

/** Fetch information about a remote device's services.
* @param {number} deviceHandle - A handle from {@link connectCallback}.
* @param {serviceCallback} win - Called with array of {@link Service} objects.
* @param {failCallback} fail
* @example
evothings.ble.services(
	deviceHandle,
	function(services)
	{
		for (var i = 0; i < services.length; i++)
		{
			var service = services[i];
			console.log('BLE service: ');
			console.log('  ' + service.handle);
			console.log('  ' + service.uuid);
			console.log('  ' + service.serviceType);
		}
	},
	function(errorCode)
	{
		console.log('BLE services error: ' + errorCode);
	});
*/
exports.services = function(deviceHandle, win, fail) {
	exec(win, fail, 'BLE', 'services', [deviceHandle]);
};

/**
* @callback serviceCallback
* @param {Array} services - Array of {@link Service} objects.
*/

/** Describes a GATT service.
* @typedef {Object} Service
* @property {number} handle
* @property {string} uuid - Formatted according to RFC 4122, all lowercase.
* @property {module:cordova-plugin-ble.serviceType} type
*/

/** A map describing possible service types.
* @readonly
* @alias module:cordova-plugin-ble.serviceType
* @enum
*/
exports.serviceType = {
	/** SERVICE_TYPE_PRIMARY */
	0: 'SERVICE_TYPE_PRIMARY',
	/** SERVICE_TYPE_SECONDARY */
	1: 'SERVICE_TYPE_SECONDARY',

	// TODO: Add these in the next release of the BLE plugin.
	// /** 0 */
	// 'SERVICE_TYPE_PRIMARY': 0,
	// /** 1 */
	// 'SERVICE_TYPE_SECONDARY': 1,
};

/** Fetch information about a service's characteristics.
* @param {number} deviceHandle - A handle from {@link connectCallback}.
* @param {number} serviceHandle - A handle from {@link serviceCallback}.
* @param {characteristicCallback} win - Called with array of {@link Characteristic} objects.
* @param {failCallback} fail
* @example
evothings.ble.characteristics(
	deviceHandle,
	service.handle,
	function(characteristics)
	{
		for (var i = 0; i < characteristics.length; i++)
		{
			var characteristic = characteristics[i];
			console.log('BLE characteristic: ' + characteristic.uuid);
		}
	},
	function(errorCode)
	{
		console.log('BLE characteristics error: ' + errorCode);
	});
*/
exports.characteristics = function(deviceHandle, serviceHandle, win, fail) {
	exec(win, fail, 'BLE', 'characteristics', [deviceHandle, serviceHandle]);
};

/**
* @callback characteristicCallback
* @param {Array} characteristics - Array of {@link Characteristic} objects.
*/

/** Describes a GATT characteristic.
* @typedef {Object} Characteristic
* @property {number} handle
* @property {string} uuid - Formatted according to RFC 4122, all lowercase.
* @property {module:cordova-plugin-ble.permission} permissions - Bitmask of zero or more permission flags.
* @property {module:cordova-plugin-ble.property} properties - Bitmask of zero or more property flags.
* @property {module:cordova-plugin-ble.writeType} writeType
*/

/** A map describing possible permission flags.
* @alias module:cordova-plugin-ble.permission
* @readonly
* @enum
*/
exports.permission = {
	/** PERMISSION_READ */
	1: 'PERMISSION_READ',
	/** PERMISSION_READ_ENCRYPTED */
	2: 'PERMISSION_READ_ENCRYPTED',
	/** PERMISSION_READ_ENCRYPTED_MITM */
	4: 'PERMISSION_READ_ENCRYPTED_MITM',
	/** PERMISSION_WRITE */
	16: 'PERMISSION_WRITE',
	/** PERMISSION_WRITE_ENCRYPTED */
	32: 'PERMISSION_WRITE_ENCRYPTED',
	/** PERMISSION_WRITE_ENCRYPTED_MITM */
	64: 'PERMISSION_WRITE_ENCRYPTED_MITM',
	/** PERMISSION_WRITE_SIGNED */
	128: 'PERMISSION_WRITE_SIGNED',
	/** PERMISSION_WRITE_SIGNED_MITM */
	256: 'PERMISSION_WRITE_SIGNED_MITM',

	// TODO: Add these in the next release of the BLE plugin.
	// /** 1 */
	// 'PERMISSION_READ': 1,
	// /** 2 */
	// 'PERMISSION_READ_ENCRYPTED': 2,
	// /** 4 */
	// 'PERMISSION_READ_ENCRYPTED_MITM': 4,
	// /** 16 */
	// 'PERMISSION_WRITE': 16,
	// /** 32 */
	// 'PERMISSION_WRITE_ENCRYPTED': 32,
	// /** 64 */
	// 'PERMISSION_WRITE_ENCRYPTED_MITM': 64,
	// /** 128 */
	// 'PERMISSION_WRITE_SIGNED': 128,
	// /** 256 */
	// 'PERMISSION_WRITE_SIGNED_MITM': 256,
};

/** A map describing possible property flags.
* @alias module:cordova-plugin-ble.property
* @readonly
* @enum
*/
exports.property = {
	/** PROPERTY_BROADCAST */
	1: 'PROPERTY_BROADCAST',
	/** PROPERTY_READ */
	2: 'PROPERTY_READ',
	/** PROPERTY_WRITE_NO_RESPONSE */
	4: 'PROPERTY_WRITE_NO_RESPONSE',
	/** PROPERTY_WRITE */
	8: 'PROPERTY_WRITE',
	/** PROPERTY_NOTIFY */
	16: 'PROPERTY_NOTIFY',
	/** PROPERTY_INDICATE */
	32: 'PROPERTY_INDICATE',
	/** PROPERTY_SIGNED_WRITE */
	64: 'PROPERTY_SIGNED_WRITE',
	/** PROPERTY_EXTENDED_PROPS */
	128: 'PROPERTY_EXTENDED_PROPS',

	// TODO: Add these in the next release of the BLE plugin.
	// /** 1 */
	// 'PROPERTY_BROADCAST': 1,
	// /** 2 */
	// 'PROPERTY_READ': 2,
	// /** 4 */
	// 'PROPERTY_WRITE_NO_RESPONSE': 4,
	// /** 8 */
	// 'PROPERTY_WRITE': 8,
	// /** 16 */
	// 'PROPERTY_NOTIFY': 16,
	// /** 32 */
	// 'PROPERTY_INDICATE': 32,
	// /** 64 */
	// 'PROPERTY_SIGNED_WRITE': 4,
	// /** 128 */
	// 'PROPERTY_EXTENDED_PROPS': 128,
};

/** A map describing possible write types.
* @alias module:cordova-plugin-ble.writeType
* @readonly
* @enum
*/
exports.writeType = {
	/** WRITE_TYPE_NO_RESPONSE */
	1: 'WRITE_TYPE_NO_RESPONSE',
	/** WRITE_TYPE_DEFAULT */
	2: 'WRITE_TYPE_DEFAULT',
	/** WRITE_TYPE_SIGNED */
	4: 'WRITE_TYPE_SIGNED',

	// TODO: Add these in the next release of the BLE plugin.
	// /** 1 */
	// 'WRITE_TYPE_NO_RESPONSE': 1,
	// /** 2 */
	// 'WRITE_TYPE_DEFAULT': 2,
	// /** 4 */
	// 'WRITE_TYPE_SIGNED': 4,
};

/** Fetch information about a characteristic's descriptors.
* @param {number} deviceHandle - A handle from {@link connectCallback}.
* @param {number} characteristicHandle - A handle from {@link characteristicCallback}.
* @param {descriptorCallback} win - Called with array of {@link Descriptor} objects.
* @param {failCallback} fail
* @example
evothings.ble.descriptors(
	deviceHandle,
	characteristic.handle,
	function(descriptors)
	{
		for (var i = 0; i < descriptors.length; i++)
		{
			var descriptor = descriptors[i];
			console.log('BLE descriptor: ' + descriptor.uuid);
		}
	},
	function(errorCode)
	{
		console.log('BLE descriptors error: ' + errorCode);
	});
*/
exports.descriptors = function(deviceHandle, characteristicHandle, win, fail) {
	exec(win, fail, 'BLE', 'descriptors', [deviceHandle, characteristicHandle]);
};

/**
* @callback descriptorCallback
* @param {Array} descriptors - Array of {@link Descriptor} objects.
*/

/** Describes a GATT descriptor.
* @typedef {Object} Descriptor
* @property {number} handle
* @property {string} uuid - Formatted according to RFC 4122, all lowercase.
* @property {module:cordova-plugin-ble.permission} permissions - Bitmask of zero or more permission flags.
*/

// TODO: What is read* ?
// read*: fetch and return value in one op.
// values should be cached on the JS side, if at all.

/**
* @callback dataCallback
* @param {ArrayBuffer} data
*/

/** Reads a characteristic's value from a remote device.
* @param {number} deviceHandle - A handle from {@link connectCallback}.
* @param {number} characteristicHandle - A handle from {@link characteristicCallback}.
* @param {dataCallback} win
* @param {failCallback} fail
* @example
evothings.ble.readCharacteristic(
	deviceHandle,
	characteristic.handle,
	function(data)
	{
		console.log('BLE characteristic data: ' + evothings.ble.fromUtf8(data));
	},
	function(errorCode)
	{
		console.log('BLE readCharacteristic error: ' + errorCode);
	});
*/
exports.readCharacteristic = function(deviceHandle, characteristicHandle, win, fail) {
	exec(win, fail, 'BLE', 'readCharacteristic', [deviceHandle, characteristicHandle]);
};

/** Reads a descriptor's value from a remote device.
* @param {number} deviceHandle - A handle from {@link connectCallback}.
* @param {number} descriptorHandle - A handle from {@link descriptorCallback}.
* @param {dataCallback} win
* @param {failCallback} fail
* @example
evothings.ble.readDescriptor(
	deviceHandle,
	descriptor.handle,
	function(data)
	{
		console.log('BLE descriptor data: ' + evothings.ble.fromUtf8(data));
	},
	function(errorCode)
	{
		console.log('BLE readDescriptor error: ' + errorCode);
	});
*/
exports.readDescriptor = function(deviceHandle, descriptorHandle, win, fail) {
	exec(win, fail, 'BLE', 'readDescriptor', [deviceHandle, descriptorHandle]);
};

/**
* @callback emptyCallback - Callback that takes no parameters.
This callback indicates that an operation was successful,
without specifying and additional information.
*/

/** Write a characteristic's value to the remote device.
* @param {number} deviceHandle - A handle from {@link connectCallback}.
* @param {number} characteristicHandle - A handle from {@link characteristicCallback}.
* @param {ArrayBufferView} data - The value to be written.
* @param {emptyCallback} win
* @param {failCallback} fail
* @example TODO: Add example.
*/
exports.writeCharacteristic = function(deviceHandle, characteristicHandle, data, win, fail) {
	exec(win, fail, 'BLE', 'writeCharacteristic', [deviceHandle, characteristicHandle, data.buffer]);
};

/** Write a descriptor's value to a remote device.
* @param {number} deviceHandle - A handle from {@link connectCallback}.
* @param {number} descriptorHandle - A handle from {@link descriptorCallback}.
* @param {ArrayBufferView} data - The value to be written.
* @param {emptyCallback} win
* @param {failCallback} fail
* @example TODO: Add example.
*/
exports.writeDescriptor = function(deviceHandle, descriptorHandle, data, win, fail) {
	exec(win, fail, 'BLE', 'writeDescriptor', [deviceHandle, descriptorHandle, data.buffer]);
};

/** Request notification on changes to a characteristic's value.
* This is more efficient than polling the value using readCharacteristic().
*
* <p>To activate notifications,
* some (all?) devices require you to write a special value to a separate configuration characteristic,
* in addition to calling this function.
* Refer to your device's documentation.
*
* @param {number} deviceHandle - A handle from {@link connectCallback}.
* @param {number} characteristicHandle - A handle from {@link characteristicCallback}.
* @param {dataCallback} win - Called every time the value changes.
* @param {failCallback} fail
* @example
evothings.ble.enableNotification(
	deviceHandle,
	characteristic.handle,
	function(data)
	{
		console.log('BLE characteristic data: ' + evothings.ble.fromUtf8(data));
	},
	function(errorCode)
	{
		console.log('BLE enableNotification error: ' + errorCode);
	});
*/
exports.enableNotification = function(deviceHandle, characteristicHandle, win, fail) {
	exec(win, fail, 'BLE', 'enableNotification', [deviceHandle, characteristicHandle]);
};

/** Disable notification of changes to a characteristic's value.
* @param {number} deviceHandle - A handle from {@link connectCallback}.
* @param {number} characteristicHandle - A handle from {@link characteristicCallback}.
* @param {emptyCallback} win
* @param {failCallback} fail
* @example
evothings.ble.disableNotification(
	deviceHandle,
	characteristic.handle,
	function()
	{
		console.log('BLE characteristic notification disabled');
	},
	function(errorCode)
	{
		console.log('BLE disableNotification error: ' + errorCode);
	});
*/
exports.disableNotification = function(deviceHandle, characteristicHandle, win, fail) {
	exec(win, fail, 'BLE', 'disableNotification', [deviceHandle, characteristicHandle]);
};

/** i is an integer. It is converted to byte and put in an array[1].
* The array is returned.
* <p>assert(string.charCodeAt(0) == i).
*
* @param {number} i
* @param {dataCallback} win - Called every time the value changes.
*/
exports.testCharConversion = function(i, win) {
	exec(win, null, 'BLE', 'testCharConversion', [i]);
};

/** Resets the device's Bluetooth system.
* This is useful on some buggy devices where BLE functions stops responding until reset.
* Available on Android 4.3+. This function takes 3-5 seconds to reset BLE.
* On iOS this function stops any ongoing scan operation and disconnects
* all connected devices.
*
* @param {emptyCallback} win
* @param {failCallback} fail
*/
exports.reset = function(win, fail) {
	exec(win, fail, 'BLE', 'reset', []);
};

/** Converts an ArrayBuffer containing UTF-8 data to a JavaScript String.
* @param {ArrayBuffer} a
* @returns string
*/
exports.fromUtf8 = function(a) {
	return decodeURIComponent(escape(String.fromCharCode.apply(null, new Uint8Array(a))));
};

/** Converts a JavaScript String to an Uint8Array containing UTF-8 data.
* @param {string} s
* @returns Uint8Array
*/
exports.toUtf8 = function(s) {
	var strUtf8 = unescape(encodeURIComponent(s));
	var ab = new Uint8Array(strUtf8.length);
	for (var i = 0; i < strUtf8.length; i++) {
		ab[i] = strUtf8.charCodeAt(i);
	}
	return ab;
};


/** Fetch information about a remote device's services,
* as well as its associated characteristics and descriptors.
*
* This function is an easy-to-use wrapper of the low-level functions
* ble.services(), ble.characteristics() and ble.descriptors().
*
* @param {number} deviceHandle - A handle from {@link connectCallback}.
* @param {serviceCallback} win - Called with array of {@link Service} objects.
* Those Service objects each have an additional field "characteristics", which is an array of {@link Characteristic} objects.
* Those Characteristic objects each have an additional field "descriptors", which is an array of {@link Descriptor} objects.
* @param {failCallback} fail
*/
exports.readAllServiceData = function(deviceHandle, win, fail)
{
	// Array of populated services.
	var serviceArray = [];

	// Counter that tracks the number of info items read.
	// This value is incremented and decremented when reading.
	// When value is back to zero, all items are read.
	var readCounter = 0;

	var servicesCallbackFun = function()
	{
		return function(services)
		{
			readCounter += services.length;
			for (var i = 0; i < services.length; ++i)
			{
				var service = services[i];
				serviceArray.push(service);
				service.characteristics = [];

				// Read characteristics for service.
        exports.characteristics(
					deviceHandle,
					service.handle,
					characteristicsCallbackFun(service),
					function(errorCode)
					{
						console.log('characteristics error: ' + errorCode);
						fail(errorCode);
					});
			}
		};
	};

	var characteristicsCallbackFun = function(service)
	{
		return function(characteristics)
		{
			--readCounter;
			readCounter += characteristics.length;
			for (var i = 0; i < characteristics.length; ++i)
			{
				var characteristic = characteristics[i];
				service.characteristics.push(characteristic);
				characteristic.descriptors = [];

				// Read descriptors for characteristic.
        exports.descriptors(
					deviceHandle,
					characteristic.handle,
					descriptorsCallbackFun(characteristic),
					function(errorCode)
					{
						console.log('descriptors error: ' + errorCode);
						fail(errorCode);
					});
			}
		};
	};

	var descriptorsCallbackFun = function(characteristic)
	{
		return function(descriptors)
		{
			--readCounter;
			for (var i = 0; i < descriptors.length; ++i)
			{
				var descriptor = descriptors[i];
				characteristic.descriptors.push(descriptor);
			}
			if (0 == readCounter)
			{
				// Everything is read.
				win(serviceArray);
			}
		};
	};

	// Read services for device.
	exports.services(
		deviceHandle,
		servicesCallbackFun(),
		function(errorCode)
		{
			console.log('services error: ' + errorCode);
			fail(errorCode);
		});
};

var Service, Characteristic;
var mqtt    = require('mqtt');

module.exports = function(homebridge) {
	Service = homebridge.hap.Service;
	Characteristic = homebridge.hap.Characteristic;
	homebridge.registerAccessory("homebridge-mqtt-contactsensor", "mqtt-contactsensor", ContactSensorAccessory);
}

function ContactSensorAccessory(log, config) {

	this.log = log;

	this.name = config["name"];
	this.url = config['url'];
	this.topic = config['topic'];
	this.sn = config['sn'] || 'Unknown';

	this.client_Id 		= 'mqttjs_' + Math.random().toString(16).substr(2, 8);

	this.options = {
		keepalive: 10,
		clientId: this.client_Id,
		protocolId: 'MQTT',
		protocolVersion: 4,
		clean: true,
		reconnectPeriod: 1000,
		connectTimeout: 30 * 1000,
		will: {
			topic: 'WillMsg',
			payload: 'Connection Closed abnormally..!',
			qos: 0,
			retain: false
		},
		username: config["username"],
		password: config["password"],
		rejectUnauthorized: false
	};

	this.service = new Service.ContactSensorState();
	this.client  = mqtt.connect(this.url, this.options);

	var self = this;

	this.client.subscribe(this.topic);
 
	this.client.on('message', function (topic, message) {
		data = JSON.parse(message);
		if (data === null) return null;
		self.value = parseInt(data, 10);
		service.getCharacteristic(Characteristic.ContactSensorState).setValue(self.value ?
				Characteristic.ContactSensorState.CONTACT_DETECTED : Characteristic.ContactSensorState.CONTACT_NOT_DETECTED);
	});

}

ContactSensorAccessory.prototype.getState = function(callback) {
		this.log(this.name, " - MQTT : ", this.value);
		callback(null, this.value);
}

ContactSensorAccessory.prototype.getServices = function() {

	var informationService = new Service.AccessoryInformation();

	informationService
		.setCharacteristic(Characteristic.Name, this.name)
		.setCharacteristic(Characteristic.Manufacturer, "heisice")
		.setCharacteristic(Characteristic.Model, "Door Sensor")
		.setCharacteristic(Characteristic.SerialNumber, this.sn);

	var service = new Service.ContactSensor();

	return [informationService, service];
}


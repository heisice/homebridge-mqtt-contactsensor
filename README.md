# homebridge-mqtt-contactsensor

Get Contact Sensor status via MQTT in Homebridge

Installation
--------------------
    sudo npm install -g homebridge-mqtt-contactsensor


Sample HomeBridge Configuration
--------------------
    {
      "bridge": {
        "name": "HomeBridge",
        "username": "CC:33:3B:D3:CE:32",
        "port": 51826,
        "pin": "321-45-123"
      },

      "description": "",

      "accessories": [
        {
          "accessory": "mqtt-contactsensor",
          "name": "Main Door",
          "url": "mqtt://localhost",
          "topic": "home/livingroom/contactsensor",
          "username": "username",
          "password": "password"
        }
      ],

      "platforms": []
    }

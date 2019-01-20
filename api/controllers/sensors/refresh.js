var request = require('request');


module.exports = {


  friendlyName: 'Refresh sensors',


  description: 'Update the password for the logged-in user.',


  inputs: {
  },


  fn: async function (inputs) {      
    list = await TemperatureHumiditySensor.find();

    list.forEach(function(sensor) {
      request.get(sensor.url, async function (error, response, body) {
        if (!error && response.statusCode == 200) {
          try {
            var content = JSON.parse(body);
          } catch (e) {
            sails.log.error('Invalid JSON data for [' + sensor.name + '] [' + sensor.url + '] : ', body);
            return ;
          }

          // sails.log('Temperature / Humidity : ', content);

          let minuteStart = new Date();
          minuteStart.setSeconds(0, 0);

          var testHistory = await TemperatureHumiditySensorHistory.find({
              createdAt: { '>=': minuteStart.getTime() },
              temperaturehumiditysensor: sensor.id
          });

          if (testHistory.length)
          {
            sails.log('Sensor already found for current minute.');
            return ;
          }

          if (content.temperature > 30 || content.temperature < 10 || content.humidity > 100 || content.humidity < 30)
          {
            sails.log.error('Sensor [' + sensor.name + '] failed with data :', content);
            return ;
          }
          
          await TemperatureHumiditySensorHistory.create({
            temperature: content.temperature,
            humidity: content.humidity,
            temperaturehumiditysensor: sensor.id
          }); 

        }
        else
          sails.log.error('Sensor [' + sensor.name + '] failed with error :', error);
      });
    });
  }
};

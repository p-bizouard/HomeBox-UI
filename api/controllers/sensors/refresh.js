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
          var content = JSON.parse(body);

          console.info('Temperature / Humidity : ', content);

          let minuteStart = new Date();
          minuteStart.setSeconds(0, 0);

          var testHistory = await TemperatureHumiditySensorHistory.find({
              createdAt: { '>=': minuteStart.getTime() },
              temperaturehumiditysensor: sensor.id
          });

          if (testHistory.length)
          {
            console.info('Sensor already found four current minute.');
            return ;
          }
          
          await TemperatureHumiditySensorHistory.create({
            temperature: content.temperature,
            humidity: content.humidity,
            temperaturehumiditysensor: sensor.id
          });
        }
        else
          console.error(error);
      });
    });
  }
};

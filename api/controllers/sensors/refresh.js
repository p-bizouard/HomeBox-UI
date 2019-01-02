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
            console.error('Invalid JSON data for [' + sensor.name + '] [' + sensor.url + '] : ', body);
            return ;
          }

          // console.info('Temperature / Humidity : ', content);

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
          console.error('Une erreur s\'est produite lors de la récupération des informations du sensor [' + sensor.name + '] :', error);
      });
    });
  }
};

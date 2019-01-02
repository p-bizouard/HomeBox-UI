var request = require('request');


module.exports = {
  friendlyName: 'Get last sensor value',
  description: '',


  inputs: {
  },


  fn: async function (inputs) {      
    var vm = this;

    returnList = [];
    list = await TemperatureHumiditySensor.find();
    for (var i = 0; i < list.length; i++) {
      sensor = list[i];

      var testHistory = await TemperatureHumiditySensorHistory.find({
        sort: 'createdAt DESC',
        limit: 1,
        where: {temperaturehumiditysensor: sensor.id}
      });
      sensor.history = testHistory[0];

      returnList.push(sensor);
    }
    return returnList;
  }
};

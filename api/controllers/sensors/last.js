module.exports = {
  friendlyName: 'Get last sensor value',
  description: '',


  inputs: {
  },


  fn: async function (inputs) {      
    var lastSensorHistory = await TemperatureHumiditySensorHistory.find({sort: 'createdAt DESC', limit: 1});

    return {
      'temperature': lastSensorHistory[0].temperature,
      'humidity': lastSensorHistory[0].humidity
    };
  }
};

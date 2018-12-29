module.exports = {
  friendlyName: 'Get last sensor value',
  description: '',


  inputs: {
  },


  fn: async function (inputs) {      
    var lastHumiditySensor = await HumiditySensor.find({sort: 'createdAt DESC', limit: 1});
    var lastTemperatureSensor = await TemperatureSensor.find({sort: 'createdAt DESC', limit: 1});

    return {
      'temperature': lastTemperatureSensor[0],
      'humidity': lastHumiditySensor[0]
    };
  }
};

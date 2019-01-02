var fs = require('fs');
var request = require('request');


module.exports = {
  friendlyName: 'Get last sensor value',
  description: '',


  inputs: {
  },


  fn: async function (inputs) {      
    var vm = this;

    console.log('Start webcams :');
    for (var j = 0; j < sails.config.webcamsUrl.length; j++)
    {
      var stream = fs.createWriteStream('/home/pi/homebox-ui/assets/images/webcam-' + (j+1) + '.jpg')
      .once('error', function(error) {
        console.error(error);
      })
      .once('end', function() {
        console.log('response written');
      });


      var source = request(sails.config.webcamsUrl[j]).once('error', function(error) {
        console.error('Request Error: ' + error);
      })
      .on('error', function(error) {
        console.error('Erreur lors du stream de la webcam [' + (j+1) + '] :', error)
      })
      .pipe(stream);
    }

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

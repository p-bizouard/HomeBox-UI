var request = require('request');


module.exports = {


  friendlyName: 'Refresh devices',


  description: '',


  inputs: {
  },


  fn: async function (inputs) {
    list = await Device.find();

    var devicesIp = [];
    list.forEach(function(device) {
      if (device.ip)
        devicesIp.push(device.ip);
      else
      {
        request.get(device.url, async function (error, response, body) {
          if (!error && response.statusCode == 200) {
            try {
              var content = JSON.parse(body);
            } catch (e) {
              console.error('Invalid JSON data for [' + sensor.name + '] [' + sensor.url + '] : ', body);
              return ;
            }

            await DeviceHistory.create({
              device: device.id,
              online: content.status
            });

            await Device.update({id: device.id}).set({lastPing:new Date(), online: content.status > 0});

          }
          else
            console.error('Une erreur s\'est produite lors de la récupération des informations du device [' + device.name + '] :', error);
        });
      }
    });
    request.post(sails.config.homeApiBaseUrl + 'ping', {form: {hosts: devicesIp}}, async function (error, response, body) {
      if (!error && response.statusCode == 200) {
        var content = JSON.parse(body);

        content.forEach(async function(currentDeviceResponse) {

          var device = await Device.findOne({ip: currentDeviceResponse.host});

          var deviceHistory = await DeviceHistory.create({
            device: device.id,
            online: currentDeviceResponse.ping
          }).fetch();

          var onlineWithin5Min = await DeviceHistory.find({
            and: [ {device: device.id}, {online: true}, { createdAt: { '>=': new Date( Date.now() - 1000 * 60 * 5 )} } ]
          });

          await Device.update({id: device.id}).set({lastPing:new Date(), online: onlineWithin5Min.length > 0});


        });
      }
      else
        console.error('Une erreur s\'est produite lors de la récupération des informations ping :', error);
    });
  }
};

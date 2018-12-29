module.exports = {
  friendlyName: 'Get last devices value',
  description: '',


  inputs: {
  },


  fn: async function (inputs) {      
    var devices = await Device.find(); 

    for (var i = 0; i < devices.length; i++) {

      if (lastUpHistory = await DeviceHistory.find({
        and: [ {device: devices[i].id}, {online: true} ]
      }).sort('createdAt DESC').limit(1))
        devices[i].lastUp = lastUpHistory[0];
        
    }
    return {
      'devices': devices
    };
  }
};

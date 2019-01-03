var request = require('request');
var devicesRefreshController = require('../devices/refresh');


module.exports = {


  friendlyName: 'Enable or disable plug',


  description: '',


  inputs: {
    device: {
      required: true,
      type: 'string',
      description: 'dehumidifier',
      // extendedDescription: 'Must be a valid email address.',
    },
    action: {
      required: true,
      type: 'string',
      description: 'enable / disable',
      // extendedDescription: 'Must be a valid email address.',
    },
  },


  fn: async function (inputs) {      
    var device = inputs.device.toLowerCase();
    var action = inputs.action.toLowerCase();

    sails.log('Device [' + device + '] set to [' + action + ']');
    apiParams = 'plug/' + device;
    request.post(sails.config.homeApiBaseUrl + apiParams, {form: {status: (action == 'enable' ? 'on' : 'off')}}, async function (error, response, body) {
      if (!error && response.statusCode == 200) {
        console.log('Retour du call api : ', body);
        devicesRefreshController.fn();
      }
      else
        console.error(error);
    });
  }
};

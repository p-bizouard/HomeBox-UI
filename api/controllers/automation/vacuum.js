var request = require('request');
var devicesRefreshController = require('../devices/refresh');


module.exports = {


  friendlyName: 'Enable or disable vacuum',


  description: '',


  inputs: {
    action: {
      required: true,
      type: 'string',
      description: 'enable / disable'
    },
  },


  fn: async function (inputs) {      
    var action = inputs.action.toLowerCase();

    return new Promise(resolve => {
      console.info('Vacuum set to ' + action)
      request({url: sails.config.homeApiBaseUrl + 'vacuum/status/' + (action == 'enable' ? 'on' : 'off')}, async function (error, response, body) {
        if (!error && response.statusCode == 200) {
          console.log(body);

          devicesRefreshController.fn();

          resolve(body);
        }
        else
          console.error(error);
      });
    });
  }
};

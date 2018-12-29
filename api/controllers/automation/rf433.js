var request = require('request');


module.exports = {


  friendlyName: 'Enable or disable rf433',


  description: '',


  inputs: {
    device: {
      required: true,
      type: 'string',
      description: 'lamp',
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
    var action = inputs.action.toLowerCase();
    var device = inputs.device.toLowerCase();

    console.info('Device [' + device + '] set to [' + action + ']');
    apiParams = 'rf433/' + device;
    request.post(sails.config.homeApiBaseUrl + apiParams, {form: {status: (action == 'enable' ? 'on' : 'off')}}, async function (error, response, body) {
      if (!error && response.statusCode == 200) {
        console.log(body);

        if (sails.config.googleHome)
          request.post(sails.config.homeApiBaseUrl + 'google-home', {form: {say: await sails.helpers.googleHomeTranslate(device + ' ' + (action == 'enable' ? 'allumée' : 'éteinte'))}});
      }
      else
        console.error(error);
    });
  }
};

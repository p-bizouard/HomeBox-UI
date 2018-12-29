module.exports = {


  friendlyName: 'View welcome page',


  description: 'Display the dashboard "Welcome" page.',


  exits: {

    success: {
      viewTemplatePath: 'pages/dashboard/welcome',
      description: 'Display the welcome page for authenticated users.'
    },

  },


  fn: async function(req){
    this.res.locals.webcamsUrl = sails.config.webcamsUrl;
    this.res.locals.homeApiBaseUrl = sails.config.homeApiBaseUrl;
    return {};

  }


};

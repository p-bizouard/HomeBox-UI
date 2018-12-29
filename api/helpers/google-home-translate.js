module.exports = {

  friendlyName: 'Format google home message',


  description: '',


  inputs: {

    text: {
      type: 'string',
      example: 'text',
      description: 'Texte envoyé',
      required: true
    }

  },


  fn: async function (inputs, exits) {
    var returnText = inputs.text;
    sails.config.googleHomeTranslate.forEach(function(replaceValue) {
      regex = new RegExp(replaceValue.search, "ig");
      returnText = returnText.replace(regex, replaceValue.replace)
    });
    return exits.success(returnText);
  }

};
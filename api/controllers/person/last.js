module.exports = {
  friendlyName: 'Get last sensor value',
  description: '',


  inputs: {
  },


  fn: async function (inputs) {      
    var persons = await Person.find({sort: 'updatedAt DESC'}).populate('lastLocationHistory');

    return {
      'persons': persons
    };
  }
};

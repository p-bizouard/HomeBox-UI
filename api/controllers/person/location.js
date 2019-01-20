var request = require('request');
var plugController = require('../automation/plug');
var vacuumController = require('../automation/vacuum');


module.exports = {


  friendlyName: 'Update person status',


  description: '',


  fn: async function (req, res, next) {

    now = new Date();

    sails.log('Statut brut : ', this.req.body);
    
    // Compatibilité IFTTT+Stringify
    var statut = this.req.body.value.toLowerCase().replace('left', 'exited').replace('arrived', 'entered');
    sails.log('Location update : ', statut);

    // Si la personne n'est pas trouvée
    var person = await Person.findOne({id: this.req.param('person')});
    if (!person)
      return ;

    // On part de la dernière position connue
    var lastLocationHistory = await PersonLocationHistory.findOne({id: person.lastLocationHistory});
    if (!lastLocationHistory)
    {
      lastLocationHistory = {
        person: person.id,
        currentLocationEntered: 0,
        currentLocationExited: 0,
        currentLocation: ''
      };
    }
    else
    {
      lastLocationHistory.id = undefined;

      // Si la dernière localisation est la localisation en cours et que le statut est identique, on ne fait rien
      if ((
          (statut == 'entered' && !lastLocationHistory.transit) || (statut == 'exited' && lastLocationHistory.transit))
          && lastLocationHistory.currentLocation == this.req.body.location
      )
      {
        sails.log('Annulation de la demande : doublon.');
        return ;
      }

      // Si la dernière localisation est la localisation en cours et qu'elle date de moins de 5 minutes
      if ((
          (statut == 'exited' && lastLocationHistory.transit) || (statut == 'entered' && lastLocationHistory.transit))
          && lastLocationHistory.currentLocation == this.req.body.location
          && ((now.getTime() - lastLocationHistory.createdAt) / 1000 < 5 * 60)
      )
      {
        sails.log('Annulation de la demande : doublon avec délai de [' + ((now.getTime() - lastLocationHistory.createdAt) / 1000) + ']');
        return ;
      }
    }


    var updateValues = JSON.parse(JSON.stringify(lastLocationHistory));
    updateValues.createdAt = undefined;
    updateValues.updatedAt = undefined;
    if (statut == 'entered') {
      // Si on arrive, on MAJ la dernière et la nouvelle localisation
      updateValues.lastLocationEntered = lastLocationHistory.currentLocationEntered;
      updateValues.lastLocationExited = lastLocationHistory.currentLocationExited;
      updateValues.lastLocation = lastLocationHistory.currentLocation;

      updateValues.currentLocationEntered = now;
      updateValues.currentLocationExited = 0;
      updateValues.currentLocation = this.req.body.location;
      
      updateValues.transit = false;
    } else if (statut == 'exited') {
      // Si on part on indique juste que l'on a quitté la dernièer localisation
      updateValues.currentLocationExited = now;      
      updateValues.transit = true;
    }
    else
    {
      console.error('Statut invalide');
      return ;
    }

    if (now.getHours() > 10)
    {
      var location = 'de ' + this.req.body.location;
      if (['Maison'].includes(this.req.body.location))
      {
        if (statut == 'entered')
          location = 'à la';
        else
          location = 'de la';
      }
      else if (['Travail'].includes(this.req.body.location))
      {
        if (statut == 'entered')
          location = 'au';
        else
          location = 'du';
      }
      else if (['Cachan'].includes(this.req.body.location))
      {
        if (statut == 'entered')
          location = 'à';
        else
          location = 'de';
      }
      else if (['École'].includes(this.req.body.location))
      {
        if (statut == 'entered')
          location = 'à l\'';
        else
          location = 'de l\'';
      }

      location += this.req.body.location;

      // var options = {
      //   uri: 'https://maker.ifttt.com/trigger/location_sms/with/key/cvtZzjd1kjdut9m6onWg3o',
      //   method: 'POST',
      //   json: {
      //     "value1": (person.id == 'paul' ? '0637476777' : '0637477171'),
      //     "value2": person.name + ' : ' + (statut == 'entered' ? 'j\'arrive' : 'je pars') + ' ' + location
      //   }
      // };
      // request(options, async function (error, response, body) {
      //   if (!error && response.statusCode == 200) {
      //   }
      //   else
      //     console.error(error);
      // });

      if (now.getHours() > 10 && sails.config.googleHome)
      {
        googleHomeSay = person.name + ' est ' + (statut == 'entered' ? 'arrivé' : 'partie') + ' ' + location;
        sails.log('Google Home : ' + googleHomeSay);
        request.post(sails.config.homeApiBaseUrl + 'google-home', {form: {say: googleHomeSay}}); 
      }
    }

    var newLocationHistory = await PersonLocationHistory.create(updateValues).fetch();
    
    await Person.update({id: this.req.param('person')}).set({lastLocationHistory: newLocationHistory.id});


    var persons = await Person.find().populate('lastLocationHistory');
    var oneHome = false;
    persons.forEach(function(person) {
      if (!person.lastLocationHistory)
        return ;
      if (!person.lastLocationHistory.transit && person.lastLocationHistory.currentLocation == 'Maison')
        oneHome = true;
    });

    // plugController.fn({
    //   device: 'dehumidifier',
    //   action: (oneHome ? 'disable' : 'enable') /// disable ... enable
    // });

    if (now.getHours() > 13 && now.getDay() <= 5 && !oneHome && (this.req.body.location == 'Cachan' || this.req.body.location == 'École') && statut == 'exited')
    {
      // En semaine : si personne à la maison, et que l'une des personnes quitte le travail ou l'école après la pause du midi.
      // vacuumController.fn({
      //   action: 'enable'
      // });
    }
    if (now.getDay() >= 6 && !oneHome && this.req.body.location == 'Maison' && statut == 'exited')
    {
      // En semaine : si personne à la maison, et que l'une des personnes quitte la maison
      // vacuumController.fn({
      //   action: 'enable'
      // });
    }
  }
};

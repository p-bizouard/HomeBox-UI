# HomeBox UI

## Download
```bash
git clone https://github.com/p-bizouard/HomeBox-UI.git
```

## Configure config/local.js
```js
module.exports = {
  homeApiBaseUrl: 'http://localhost:8081/',
  webcamsUrl: [
        'http://url/images/picture.jpg',
  ],
  canRegister: false,
  googleHome: true,
  googleHomeTranslate: [
        {'search': 'lamp', 'replace': 'Lampes'},
  ],
  port: 8080,
  session: {
    adapter: '@sailshq/connect-redis'
  },
  sockets: {
    adapter: '@sailshq/socket.io-redis'
  },
  datastores: {
    default: {
      adapter: 'sails-mysql',
      url: 'mysql://USER:PASSWORD@localhost:3306/DATABASE',
    }
  }
};
```

## Todo
- [ ] Callback de configuration lors d'entrée ou de sortie de personnes
- [ ] Option pour automatiquement lancer ou éteindre un plugDevice lorsqu'au moins une personne arrive à "maison" après une arrivée
- [ ] Option pour automatiquement lancer ou éteindre un plugDevice lorsqu'aucune personne n'est à "maison" après un départ
- [ ] Dump de la stucture SQL

# HomeBox UI

## Download
```bash
git clone https://github.com/p-bizouard/HomeBox-UI.git
```

## Configure
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

## Import database structure
@Todo

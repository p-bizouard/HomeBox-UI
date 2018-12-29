parasails.registerPage('welcome', {
  //  ╦╔╗╔╦╔╦╗╦╔═╗╦    ╔═╗╔╦╗╔═╗╔╦╗╔═╗
  //  ║║║║║ ║ ║╠═╣║    ╚═╗ ║ ╠═╣ ║ ║╣
  //  ╩╝╚╝╩ ╩ ╩╩ ╩╩═╝  ╚═╝ ╩ ╩ ╩ ╩ ╚═╝
  data: {
    moment: moment,
    temperature: null,
    humidity: null,
    devices: null,
    persons: null,
    modal: '',
    pageLoadedAt: Date.now(),
    // Main syncing/loading state for this page.
    syncing: false,

    // Form data
    formData: { /* … */ },

    // For tracking client-side validation errors in our form.
    // > Has property set to `true` for each invalid property in `formData`.
    formErrors: { /* … */ },

    // Server error state for the form
    cloudError: '',

    // Success state when form has been submitted
    cloudSuccess: false,

    webcamsUrl: [],
  },

  //  ╦  ╦╔═╗╔═╗╔═╗╦ ╦╔═╗╦  ╔═╗
  //  ║  ║╠╣ ║╣ ║  ╚╦╝║  ║  ║╣
  //  ╩═╝╩╚  ╚═╝╚═╝ ╩ ╚═╝╩═╝╚═╝
  beforeMount: function() {
    // Attach any initial data from the server.
    _.extend(this, SAILS_LOCALS);
  },
  mounted: async function() {
    this.$nextTick(function () {
      window.setInterval(() => {
        this.getSensors();
        this.getDevices();
        this.getPersons();
        this.getWebcams();
      }, 5000);
      this.getSensors();
      this.getDevices();
      this.getPersons();
      this.getWebcams();
    })
  },

  //  ╦  ╦╦╦═╗╔╦╗╦ ╦╔═╗╦    ╔═╗╔═╗╔═╗╔═╗╔═╗
  //  ╚╗╔╝║╠╦╝ ║ ║ ║╠═╣║    ╠═╝╠═╣║ ╦║╣ ╚═╗
  //   ╚╝ ╩╩╚═ ╩ ╚═╝╩ ╩╩═╝  ╩  ╩ ╩╚═╝╚═╝╚═╝
  // Configure deep-linking (aka client-side routing)
  virtualPagesRegExp: /^\/welcome\/?([^\/]+)?\/?/,
  afterNavigate: async function(virtualPageSlug){
    // `virtualPageSlug` is determined by the regular expression above, which
    // corresponds with `:unused?` in the server-side route for this page.
    switch (virtualPageSlug) {
      case 'hello':
        this.modal = 'example';
        break;
      default:
        this.modal = '';
    }
  },

  //  ╦╔╗╔╔╦╗╔═╗╦═╗╔═╗╔═╗╔╦╗╦╔═╗╔╗╔╔═╗
  //  ║║║║ ║ ║╣ ╠╦╝╠═╣║   ║ ║║ ║║║║╚═╗
  //  ╩╝╚╝ ╩ ╚═╝╩╚═╩ ╩╚═╝ ╩ ╩╚═╝╝╚╝╚═╝
  methods: {
    clickOpenExampleModalButton() {
      this.modal = 'example'
    },
    closeExampleModal() {
      this.modal = ''
    },
    getWebcams() {
      var vm = this;
      var d = new Date();

      vm.webcamsUrl = [];
      window.SAILS_LOCALS.webcamsUrl.forEach(function(webcamUrl) {
        vm.webcamsUrl.push(webcamUrl +'?' + d.getTime());
      });
    },
    getSensors() {
      var vm = this;
      io.socket.get('/api/v1/sensors/last', function(result) {
        vm.temperature = result.temperature;
        vm.humidity = result.humidity
      });
    },
    getDevices() {
      var vm = this;
      io.socket.get('/api/v1/devices/last', function(result) {
        vm.devices = result.devices;
      });
    },
    getPersons() {
      var vm = this;
      io.socket.get('/api/v1/person/last', function(result) {
        vm.persons = result.persons;
      });
    }

  }
});

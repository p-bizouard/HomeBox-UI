/**
 * <modal>
 * -----------------------------------------------------------------------------
 * A modal dialog pop-up.
 *
 * > Be careful adding other Vue.js lifecycle callbacks in this file!  The
 * > finnicky combination of Vue transitions and bootstrap modal animations used
 * > herein work, and are very well-tested in practical applications.  But any
 * > changes to that specific cocktail could be unpredictable, with unsavory
 * > consequences.
 *
 * @type {Component}
 *
 * @event close   [emitted when the closing process begins]
 * @event opened  [emitted when the opening process is completely done]
 * -----------------------------------------------------------------------------
 */

parasails.registerComponent('vacuum', {
  //  ╔═╗╦═╗╔═╗╔═╗╔═╗
  //  ╠═╝╠╦╝║ ║╠═╝╚═╗
  //  ╩  ╩╚═╚═╝╩  ╚═╝
  props: [
    'syncing'
  ],

  //  ╦╔╗╔╦╔╦╗╦╔═╗╦    ╔═╗╔╦╗╔═╗╔╦╗╔═╗
  //  ║║║║║ ║ ║╠═╣║    ╚═╗ ║ ╠═╣ ║ ║╣
  //  ╩╝╚╝╩ ╩ ╩╩ ╩╩═╝  ╚═╝ ╩ ╩ ╩ ╩ ╚═╝
  data: function (){
    return {
      pageLoadedAt: Date.now(),
      // Form data
      formData: { /* … */ },

      // For tracking client-side validation errors in our form.
      // > Has property set to `true` for each invalid property in `formData`.
      formErrors: { /* … */ },

      // Server error state for the form
      cloudError: '',

      // Success state when form has been submitted
      cloudSuccess: false,
    };
  },

  //  ╦ ╦╔╦╗╔╦╗╦
  //  ╠═╣ ║ ║║║║
  //  ╩ ╩ ╩ ╩ ╩╩═╝
  template: `
      <ajax-form id="vacuum" action="vacuum" :cloud-error.sync="cloudError" @submitted="submittedForm" :handle-parsing="handleParsingForm">
        <div class="row">
          <div class="col-12 col-sm-6">
            <button class="btn btn-outline-info col-12" @click="clickInteractVacuum('enable')">Lancer l'aspirateur</button>
          </div>
          <div class="col-12 col-sm-6">
            <button class="btn btn-outline-info col-12" @click="clickInteractVacuum('disable')">Stopper l'aspirateur</button>
          </div>
        </div>
      </ajax-form>
  `,

  //  ╦  ╦╔═╗╔═╗╔═╗╦ ╦╔═╗╦  ╔═╗
  //  ║  ║╠╣ ║╣ ║  ╚╦╝║  ║  ║╣
  //  ╩═╝╩╚  ╚═╝╚═╝ ╩ ╚═╝╩═╝╚═╝
  beforeMount: function() {
    //…
  },
  mounted: async function(){
    //…
  },
  beforeDestroy: function() {
    //…
  },

  //  ╦╔╗╔╔╦╗╔═╗╦═╗╔═╗╔═╗╔╦╗╦╔═╗╔╗╔╔═╗
  //  ║║║║ ║ ║╣ ╠╦╝╠═╣║   ║ ║║ ║║║║╚═╗
  //  ╩╝╚╝ ╩ ╚═╝╩╚═╩ ╩╚═╝ ╩ ╩╚═╝╝╚╝╚═╝
  methods: {

    handleParsingForm: function() {

      // Clear out any pre-existing error messages.
      this.formErrors = {};
      var argins = this.formData;

      // If there were any issues, they've already now been communicated to the user,
      // so simply return undefined.  (This signifies that the submission should be
      // cancelled.)
      if (Object.keys(this.formErrors).length > 0) {
        return;
      }

      return argins;
    },

    clickInteractVacuum: async function(action) {
      this.formData.action = action;
      this.$emit('submit');
    },
    submittedForm: function(data){
      obj = JSON.parse(data);
      if (!obj || obj.result)
        alert('Une erreur s\'est produite');
    },
  }
});

import Vue from 'vue'
import VueTelInput from 'vue-tel-input'

Vue.use(VueTelInput, {
  mode: 'international',
  defaultCountry: 'mt',
  enabledCountryCode: false,
  disabledFetchingCountry: true,
  preferredCountries: ['mt', 'gb'],
  validCharactersOnly: true,
})

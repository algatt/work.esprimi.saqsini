import Vue from 'vue'
// eslint-disable-next-line import/no-named-as-default
import VueTelInput from 'vue-tel-input'

Vue.use(VueTelInput, {
  mode: 'international',
  defaultCountry: 'mt',
  enabledCountryCode: false,
  disabledFetchingCountry: true,
  preferredCountries: ['mt', 'gb'],
  validCharactersOnly: true,
})

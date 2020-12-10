import Vue from 'vue'
import Toasted from 'vue-toasted'

const toastOptions = {
  position: 'bottom-right',
  duration: 3000,
}
Vue.use(Toasted, toastOptions)

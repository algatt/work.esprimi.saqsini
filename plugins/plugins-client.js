import Vue from 'vue'
import Toasted from 'vue-toasted'

const toastOptions = {
  position: 'top-right',
  duration: 5000,
}
Vue.use(Toasted, toastOptions)

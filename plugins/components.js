import Vue from 'vue'
import ButtonBasic from '~/components/elements/ButtonBasic'

const components = { ButtonBasic }

Object.entries(components).forEach(([name, component]) => {
  Vue.component(name, component)
})

import Vue from 'vue'
import ButtonBasic from '~/components/elements/ButtonBasic'
import InputBase from '~/components/elements/InputBase'

const components = { ButtonBasic, InputBase }

Object.entries(components).forEach(([name, component]) => {
  Vue.component(name, component)
})

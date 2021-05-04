import Vue from 'vue'
import ButtonBasic from '~/components/elements/ButtonBasic'
import InputBase from '~/components/elements/InputBase'

import LButton from '~/components/elements/LButton'
import LPopupMenu from '~/components/elements/LPopupMenu'
import LToggle from '~/components/elements/LToggle'

const components = { ButtonBasic, InputBase, LButton, LPopupMenu, LToggle }

Object.entries(components).forEach(([name, component]) => {
  Vue.component(name, component)
})

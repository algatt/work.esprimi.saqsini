import Vue from 'vue'
import ButtonBasic from '~/components/elements/ButtonBasic'
import InputBase from '~/components/elements/InputBase'

import LButton from '~/components/elements/LButton'
import LPopupMenu from '~/components/elements/LPopupMenu'
import LToggle from '~/components/elements/LToggle'
import LSelect from '~/components/elements/LSelect'
import LInput from '~/components/LInput'
import LTextArea from '~/components/elements/LTextArea'
import LProgress from '~/components/LProgress'
import PopupInformation from '~/components/elements/PopupInformation'
import LButtonCircle from '~/components/elements/LButtonCircle'

const components = {
  ButtonBasic,
  InputBase,
  LButton,
  LPopupMenu,
  LToggle,
  LSelect,
  LInput,
  LTextArea,
  PopupInformation,
  LProgress,
  LButtonCircle,
}

Object.entries(components).forEach(([name, component]) => {
  Vue.component(name, component)
})

import Vue from 'vue'
import ButtonBasic from '~/components/elements/ButtonBasic'
import InputBase from '~/components/elements/InputBase'

import LButton from '~/components/LButton'
import LPopupMenu from '~/components/LPopupMenu'
import LToggle from '~/components/LToggle'
import LSelect from '~/components/LSelect'
import LInput from '~/components/LInput'
import LTextArea from '~/components/LTextArea'
import LProgress from '~/components/LProgress'
import PopupInformation from '~/components/elements/PopupInformation'
import LButtonCircle from '~/components/LButtonCircle'
import LInputButton from '~/components/LInputButton'

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
  LInputButton,
}

Object.entries(components).forEach(([name, component]) => {
  Vue.component(name, component)
})

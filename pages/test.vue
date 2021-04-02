<template>
  <div class="flex flex-col space-y-5">
    <div class="flex space-x-5 flex-wrap">
      <ButtonBase bg-colour="red" @buttonClick="buttonClick">Cancel</ButtonBase>
      <ButtonBase bg-colour="red" variant="dark">Cancel</ButtonBase>
      <ButtonBase bg-colour="red" :disabled="true">Cancel</ButtonBase>
      <ButtonBase bg-colour="red" variant="dark" :disabled="true"
        >Cancel</ButtonBase
      >
      <ButtonIcon
        >Send<template v-slot:icon><i class="fas fa-times fa-fw"></i></template
      ></ButtonIcon>
      <ButtonIcon :disabled="true"
        >Send invites<template v-slot:icon
          ><i class="fas fa-times fa-fw"></i></template
      ></ButtonIcon>
      <ButtonIcon bg-colour="red"
        >Send Invites<template v-slot:icon
          ><i class="fas fa-times fa-fw"></i></template
      ></ButtonIcon>
      <ButtonIcon bg-colour="pink"
        >Send Invites<template v-slot:icon
          ><i class="fas fa-times fa-fw"></i></template
      ></ButtonIcon>
      <ButtonIcon bg-colour="red" :disabled="true"
        >Send Invites<template v-slot:icon
          ><i class="fas fa-times fa-fw"></i></template
      ></ButtonIcon>
    </div>
    <div class="flex flex-wrap space-x-5">
      <TextLink>Take me there</TextLink>
      <TextLink colour="red">Take me there</TextLink>
    </div>
    <div class="flex flex-wrap space-x-5">
      <InputBase error="Your age must be bigger than 10"></InputBase>
      <InputBase></InputBase>
      <InputBase placeholder="Enter your name"></InputBase>
      <InputBase placeholder="Enter your name">Name</InputBase>
      <InputBase placeholder="Enter your name" :disabled="true">Name</InputBase>
      <InputBase placeholder="Enter your name" type="date">Name</InputBase>
    </div>
    <div class="flex flex-wrap space-x-5 justify-between">
      <PopupBase></PopupBase>
      <PopupBase></PopupBase>
      <PopupBase></PopupBase>
    </div>
  </div>
</template>

<script>
import ButtonBase from '~/components/elements/ButtonBase'
import ButtonIcon from '~/components/elements/ButtonIcon'
import TextLink from '~/components/elements/TextLink'
import InputBase from '~/components/elements/InputBase'
import PopupBase from '~/components/elements/PopupBase'
export default {
  name: 'Text',
  components: { PopupBase, InputBase, TextLink, ButtonIcon, ButtonBase },
  methods: {
    buttonClick() {
      console.log('aa')
    },
  },
}
</script>

<style scoped></style>

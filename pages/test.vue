<template>
  <div class="flex flex-col items-start my-10 space-y-10">
    <button-base>Click me</button-base>
    <button-icon
      >Click me<template v-slot:icon><i class="fas fa-flag fa-fw"></i></template
    ></button-icon>
    <input-base></input-base>
    <text-link>Click me</text-link>
    <popup-info>He He Hey I am on vacation</popup-info>
    <div class="flex justify-between w-full">
      <popup-menu>
        <template v-slot:menu>
          <span @click="clickMenu"><i class="fas fa-plus"></i>Add</span>
          <span> <i class="fas fa-plus"></i>Add</span>
          <span><i class="fas fa-plus"></i>Add</span>
        </template>
      </popup-menu>
      <popup-menu>
        <template v-slot:menu>
          <span class="flex items-center"><i class="fas fa-plus"></i>Add</span>
          <span class="flex items-center"><i class="fas fa-plus"></i>Add</span>
          <span class="flex items-center"><i class="fas fa-plus"></i>Add</span>
        </template>
      </popup-menu>
      <popup-menu>
        <template v-slot:menu>
          <span class="flex items-center"><i class="fas fa-plus"></i>Add</span>
          <span class="flex items-center"><i class="fas fa-plus"></i>Add</span>
          <span class="flex items-center"><i class="fas fa-plus"></i>Add</span>
        </template>
      </popup-menu>
    </div>
  </div>
</template>

<script>
import ButtonBase from '~/components/elements/ButtonBase'
import ButtonIcon from '~/components/elements/ButtonIcon'
import InputBase from '~/components/elements/InputBase'
import TextLink from '~/components/elements/TextLink'
import PopupInfo from '~/components/elements/PopupBase'
import PopupMenu from '~/components/elements/PopupMenu'
export default {
  name: 'Test',
  components: {
    PopupMenu,
    PopupInfo,
    TextLink,
    InputBase,
    ButtonIcon,
    ButtonBase,
  },
  methods: {
    clickMenu() {
      alert('aaa')
    },
  },
}
</script>

<style scoped></style>

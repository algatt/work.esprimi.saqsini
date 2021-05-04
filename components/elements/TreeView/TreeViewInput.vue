<template>
  <div class="flex items-center relative w-full">
    <span v-if="!isEditable" class="px-2 py-0.5 border border-transparent">{{
      name
    }}</span>
    <div v-else class="flex items-center w-full px-1">
      <input
        v-model="editName"
        v-bind="$attrs"
        class="font-medium focus:outline-none border border-transparent focus:border-gray-200 rounded pl-1 py-0.5 w-full"
        @focusout="focusOut"
      />
      <round-color-icon
        v-if="isValid === true || isValid === false"
        class="absolute right-3"
        :color="isValid ? 'green' : 'red'"
        ><i class="fas fa-fw" :class="isValid ? 'fa-check' : 'fa-times'"></i
      ></round-color-icon>
    </div>
  </div>
</template>

<script>
import RoundColorIcon from '~/components/elements/RoundColorIcon'
export default {
  name: 'TreeViewInput',
  components: { RoundColorIcon },
  inheritAttrs: false,
  props: {
    name: {
      type: String,
      default: '',
    },
    isEditable: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {
      editName: '',
    }
  },
  computed: {
    isValid() {
      return this.editName.trim().length > 0
    },
  },
  watch: {
    name(value) {
      this.editName = value
    },
  },
  mounted() {
    this.editName = this.name
    window.addEventListener('keyup', this.enterPressed)
    window.addEventListener('keyup', this.escapePressed)
  },
  beforeDestroy() {
    window.removeEventListener('keyup', this.enterPressed)
    window.removeEventListener('keyup', this.escapePressed)
  },

  methods: {
    focusOut() {
      this.editName = this.name
      this.$emit('cancel')
    },
    enterPressed(event) {
      if (event.key === 'Enter' && this.isEditable) {
        if (this.isValid) {
          this.$emit('save', this.editName)
        }
      }
    },
    escapePressed(event) {
      if (event.key === 'Escape' && this.isEditable) {
        this.editName = this.name
        this.$emit('cancel')
      }
    },
  },
}
</script>

<style scoped></style>

<template>
  <span
    v-if="iso"
    class="flag-icon"
    :class="flagIconClass"
    :title="title || iso"
  ></span>
</template>
<script>
import '~/assets/css/flagIcon.css'
import relation from '~/assets/relation'

export default {
  name: 'LangFlag',

  props: {
    iso: { type: String, required: true },
    title: { type: String, default: null },
    squared: { type: Boolean, default: true },
  },

  computed: {
    flagIconClass() {
      return (
        (this.squared ? 'flag-icon-squared ' : '') +
        'flag-icon-' +
        this.flagCode
      )
    },
    flagCode() {
      return relation[this.iso.toLowerCase()]
    },
  },
}
</script>

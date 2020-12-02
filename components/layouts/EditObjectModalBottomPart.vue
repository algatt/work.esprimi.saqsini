<template>
  <div
    class="flex flex-wrap absolute bottom-0 left-0 w-full px-5 pb-3 h-16 justify-between items-center"
  >
    <div class="flex flex-wrap items-center w-6/12">
      <button class="btn-round-primary mr-2" @click="cancelCurrentItem">
        <i class="fas fa-times fa-fw"></i>
      </button>
      <button
        v-if="form.code !== -1"
        class="btn-round-danger mr-2"
        :disabled="form.code === -1"
        @click="deleteItem"
      >
        <i class="far fa-trash-alt fa-fw"></i>
      </button>
    </div>

    <div class="flex flex-wrap items-center w-6/12 justify-end">
      <button
        class="btn-round-primary mr-2"
        :disabled="!isValid"
        @click="saveItem"
      >
        <i class="fas fa-save fa-fw"></i>
      </button>
    </div>
  </div>
</template>

<script>
import { parseSurveyToAPI } from '~/helpers/parseSurveyObjects'

export default {
  name: 'EditObjectModalBottomPart',
  props: {
    form: {
      required: true,
      type: Object,
    },
    which: {
      required: true,
      type: String,
    },
    isValid: {
      required: true,
      type: Boolean,
    },
  },
  mounted() {
    document.addEventListener('keydown', this.mapEscape)
  },
  beforeDestroy() {
    document.removeEventListener('keydown', this.mapEscape)
  },
  methods: {
    mapEscape(key) {
      if (key.key === 'Escape') {
        this.cancelCurrentItem()
      }
    },
    cancelCurrentItem() {
      this.$store.dispatch('setCurrentItemToBeEdited', null)
    },
    saveItem() {
      let obj = this.form
      if (this.which === 'surveys') {
        obj = parseSurveyToAPI(obj)
      }

      if (this.form.code === -1) {
        this.$store
          .dispatch('newItem', { which: this.which, item: obj })
          .then(() => {
            this.cancelCurrentItem()
          })
      } else {
        this.$store
          .dispatch('updateItem', {
            which: this.which,
            item: obj,
          })
          .then(() => {
            this.cancelCurrentItem()
          })
      }
    },
    deleteItem() {
      this.$store
        .dispatch('deleteItem', { which: this.which, code: this.form.code })
        .then(() => {
          this.cancelCurrentItem()
        })
    },
  },
}
</script>

<template>
  <div class="flex flex-wrap w-full justify-between items-center py-2">
    <div class="flex flex-wrap items-center w-3/12">
      <template v-if="showDelete && form.code !== -1">
        <button-basic
          v-if="form.ordinalPosition !== 1"
          colour="red"
          :disabled="form.code === -1"
          @click="deleteItem"
          >Delete
          <template v-slot:rightIcon
            ><i class="fas fa-trash-alt fa-fw fa-sm"></i
          ></template>
        </button-basic>
      </template>
    </div>

    <div class="flex flex-wrap items-center w-9/12 justify-end space-x-3">
      <button-basic colour="gray" @click="cancelCurrentItem">
        Cancel
        <template v-slot:rightIcon
          ><i class="fas fa-times fa-fw fa-sm"></i
        ></template>
      </button-basic>
      <button-basic v-if="showSave" :disabled="!isValid" @click="saveItem">
        Save
        <template v-slot:rightIcon
          ><i class="fas fa-save fa-fw fa-sm"></i
        ></template>
      </button-basic>
    </div>
  </div>
</template>

<script>
import {
  parseSurveyToAPI,
  parseQuestionToApi,
} from '~/helpers/parseSurveyObjects'

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
    showDelete: {
      required: false,
      type: Boolean,
      default: true,
    },
    showSave: {
      required: false,
      type: Boolean,
      default: true,
    },
  },
  mounted() {
    document.addEventListener('keydown', this.mapEscape)
    // document.addEventListener('keydown', this.mapEnter)
  },
  beforeDestroy() {
    document.removeEventListener('keydown', this.mapEscape)
    // document.removeEventListener('keydown', this.mapEnter)
  },
  methods: {
    mapEscape(key) {
      if (key.key === 'Escape') {
        this.cancelCurrentItem()
      }
    },
    mapEnter(key) {
      if (key.key === 'Enter' && this.isValid) {
        this.saveItem()
      }
    },
    cancelCurrentItem() {
      this.$store.dispatch('setCurrentItemToBeEdited', null)
    },
    saveItem() {
      let obj = this.form
      if (this.which === 'surveys') obj = parseSurveyToAPI(obj)

      if (this.which === 'questions') obj = parseQuestionToApi(obj)

      if (this.form.code === -1) {
        this.$store
          .dispatch('newItem', { which: this.which, item: obj })
          .then(() => {
            this.$toasted.show('Added successfully.')
            this.cancelCurrentItem()
          })
          .catch(() => {
            this.$toasted.error('There was a problem saving this item.')
          })
      } else {
        this.$store
          .dispatch('updateItem', {
            which: this.which,
            item: obj,
          })
          .then(() => {
            this.$toasted.show('Updated successfully.')
            this.cancelCurrentItem()
          })
          .catch(() => {
            this.$toasted.error('There was a problem saving this item.')
          })
      }
    },
    deleteItem() {
      this.$store
        .dispatch('deleteItem', { which: this.which, code: this.form.code })
        .then(() => {
          this.$toasted.show('Deleted successfully.')
          this.cancelCurrentItem()
        })
        .catch(() => {
          this.$toasted.error('There was a problem deleting this item.')
        })
    },
  },
}
</script>

<template>
  <div class="flex flex-wrap w-full justify-between items-center py-8">
    <div class="flex flex-wrap items-center w-6/12">
      <template v-if="showDelete && form.code !== -1">
        <button
          v-if="form.ordinalPosition !== 1"
          class="btn-danger mr-2"
          :disabled="form.code === -1"
          @click="deleteItem"
        >
          Delete
        </button>
      </template>
      <!--      <button-->
      <!--        v-if="false"-->
      <!--        class="btn-danger mr-2"-->
      <!--        :disabled="form.code === -1"-->
      <!--        @click="deleteItem"-->
      <!--      >-->
      <!--        Delete-->
      <!--      </button>-->
    </div>

    <div class="flex flex-wrap items-center w-6/12 justify-end">
      <button class="btn-primary mr-2" @click="cancelCurrentItem">
        Cancel
      </button>
      <button
        v-if="showSave"
        class="btn-primary"
        :disabled="!isValid"
        @click="saveItem"
      >
        Save
      </button>
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

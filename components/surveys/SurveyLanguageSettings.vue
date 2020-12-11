<template>
  <div>
    <div v-if="!survey.flags.includes('HAS_LANGUAGE_PACK_FILE')">
      <p>
        This survey only has the default language. You can generate a file that
        allows you to translate your survey in other languages.
      </p>
      <button class="btn-primary my-2 w-32" @click="generateLanguagePack">
        Generate
      </button>
    </div>
    <div v-else>
      <p class="mt-3 mb-1">
        This survey is available in the following languages.
      </p>
      <div class="flex flex-wrap">
        <span
          v-for="item in survey.languages"
          :key="item"
          class="bg-gray-200 px-2 mr-2 rounded"
        >
          <language-flag :iso="item" :squared="false"></language-flag>
          <span>{{ item }}</span>
        </span>
      </div>
      <p class="mt-3">This survey has a generated language pack.</p>
      <button class="btn-primary my-3 w-32" @click="downloadLanguagePack">
        Download
      </button>
      <p class="mt-3">You can also re-generate the language pack.</p>
      <button class="btn-primary my-3 w-32" @click="generateLanguagePack">
        Generate
      </button>

      <p class="mt-3">You can upload your language pack here.</p>
      <input id="inputFile" type="file" hidden @change="uploadFile" />
      <button class="btn-primary my-3 w-32" @click="activateInputFile">
        Upload
      </button>
    </div>
    <edit-object-modal-bottom-part
      :form="{}"
      which="surveys"
      :is-valid="false"
      :show-delete="false"
      :show-save="false"
    ></edit-object-modal-bottom-part>
  </div>
</template>

<script>
import moment from 'moment'
import LanguageFlag from '~/components/layouts/LanguageFlag'
import EditObjectModalBottomPart from '~/components/layouts/EditObjectModalBottomPart'
export default {
  name: 'SurveyLanguageSettings',
  components: { EditObjectModalBottomPart, LanguageFlag },
  computed: {
    survey() {
      return this.$store.state.currentItemToBeEdited
    },
  },

  methods: {
    generateLanguagePack() {
      this.generate = false
      this.$store
        .dispatch('surveys/generateLanguagePack', this.survey)
        .then(() => {
          this.$toasted.show(
            `Your request is being processed. Check your notifications to know when it's ready.`
          )
          this.$store.dispatch('setCurrentItemToBeEdited', null)
        })
    },
    activateInputFile() {
      document.getElementById('inputFile').click()
    },
    uploadFile() {
      this.upload = false
      const file = document.getElementById('inputFile').files[0]
      this.$store
        .dispatch('surveys/uploadLanguagePack', {
          survey: this.survey,
          file,
        })
        .then(() => {
          this.$toasted.show(
            'Language Pack uploaded successfully. It will be available in a few minutes.'
          )
          this.$store.dispatch('setCurrentItemToBeEdited', null)
        })
        .catch((error) => {
          this.$toasted.show(error)
        })
    },
    downloadLanguagePack() {
      this.$store
        .dispatch('surveys/downloadLanguagePack', this.survey)
        .then((response) => {
          const fileURL = window.URL.createObjectURL(new Blob([response]))
          const fileLink = document.createElement('a')

          fileLink.href = fileURL
          const fileName =
            this.survey.name + '_' + moment().format('YYYY_MM_DD') + '.xlsx'
          fileLink.setAttribute('download', fileName)
          document.body.appendChild(fileLink)

          fileLink.click()
        })
    },
  },
}
</script>

<style scoped></style>

<template>
  <div>
    <div v-if="!survey.flags.includes('HAS_LANGUAGE_PACK_FILE')">
      <p class="mb-3">
        This survey only has the default language. You can generate a file that
        allows you to translate your survey in other languages.
      </p>
      <button class="btn btn-primary my-2" @click="generateLanguagePack">
        Generate Language Pack
      </button>
    </div>
    <div v-else class="flex flex-col">
      <div
        v-if="survey.flags.includes('OUTDATED_LANGUAGE_PACK')"
        class="bg-red-50 p-5 border border-red-300 rounded text-gray-700 space-y-5"
      >
        <p>
          The language pack is outdated since changes were made to the survey
          after the languages were uploaded. You need to generate the language
          pack again, and re-upload.
        </p>
        <p>
          Make sure to download the existing language pack to preserve previous
          translations.
        </p>
      </div>
      <p class="mt-3 mb-2">
        This survey is available in the following languages.
      </p>
      <div class="flex flex-wrap">
        <span
          v-for="item in survey.languages"
          :key="item"
          class="bg-gray-100 border border-gray-200 px-2 py-1 mr-2 rounded"
        >
          <span>{{ getCountryFromLanguage(item) }}</span>
        </span>
      </div>
      <h6 class="mt-5">Language Pack Options</h6>
      <div class="flex justify-start space-x-5">
        <button class="btn btn-primary my-3" @click="downloadLanguagePack">
          Download Existing
        </button>

        <button class="btn btn-primary my-3" @click="generateLanguagePack">
          Generate New
        </button>

        <input id="inputFile" type="file" hidden @change="uploadFile" />
        <button class="btn btn-primary my-3" @click="activateInputFile">
          Upload New
        </button>
      </div>
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
import EditObjectModalBottomPart from '~/components/layouts/EditObjectModalBottomPart'
export default {
  name: 'SurveyLanguageSettings',
  components: { EditObjectModalBottomPart },
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
    getCountryFromLanguage(code) {
      const CountryLanguage = require('country-language')

      const x = CountryLanguage.getLanguage(code).nativeName[0]
      return x.substring(0, 1).toUpperCase() + x.substring(1, x.length)
    },
  },
}
</script>

<style scoped></style>

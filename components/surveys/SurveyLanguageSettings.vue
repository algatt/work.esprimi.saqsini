<template>
  <div class="flex flex-col justify-between w-full">
    <div v-if="!survey.flags.includes('HAS_LANGUAGE_PACK_FILE')">
      <p class="mb-3">
        This survey only has the default language. You can generate a file that
        allows you to translate your survey in other languages.
      </p>
      <l-button class="my-2" @click="generateLanguagePack">
        Generate Language Pack
      </l-button>
    </div>
    <div v-else class="flex flex-col">
      <l-badge
        v-if="survey.flags.includes('OUTDATED_LANGUAGE_PACK')"
        color="red"
      >
        <p class="px-2 py-1">
          The language pack is outdated since changes were made to the survey
          after the languages were uploaded. You need to generate the language
          pack again, and re-upload.
        </p>
        <p class="px-2 py-1">
          Make sure to download the existing language pack to preserve previous
          translations.
        </p>
      </l-badge>
      <p class="mt-3 mb-2">
        This survey is available in the following languages.
      </p>
      <div class="flex flex-wrap">
        <l-badge v-for="item in survey.languages" :key="item">
          <span>{{ getCountryFromLanguage(item) }}</span>
        </l-badge>
      </div>
      <h6 class="mt-5">Language Pack Options</h6>
      <div class="flex justify-start space-x-5">
        <l-button class="my-3" @click="downloadLanguagePack">
          Download Existing
        </l-button>

        <l-button class="my-3" @click="generateLanguagePack">
          Generate New
        </l-button>

        <input id="inputFile" type="file" hidden @change="uploadFile" />
        <l-button class="my-3" @click="activateInputFile">
          Upload New
        </l-button>
      </div>
    </div>
  </div>
</template>

<script>
import { DateTime } from 'luxon'

export default {
  name: 'SurveyLanguageSettings',

  props: {
    survey: {
      type: Object,
      required: true,
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
            this.survey.name +
            '_' +
            DateTime.now().toFormat('yyyy-MM-dd') +
            '.xlsx'
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

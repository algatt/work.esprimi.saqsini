<template>
  <div class="flex flex-col space-y-5">
    <div class="flex flex-col">
      <label class="font-semibold mb-1">Header Image</label>
      <input
        id="inputHeaderImage"
        type="file"
        hidden
        @change="updateLogo('inputHeaderImage', 'headerImage')"
      />
      <div class="flex flex-col justify-start items-start">
        <button
          class="text-primary focus:outline-none hover:text-primary-darker w-36"
          style="min-height: 6rem"
          @click="activateInput('inputHeaderImage')"
        >
          <img
            v-if="form.options.headerImage"
            :src="form.options.headerImage"
            class="rounded bg-cover"
          />
          <i v-else class="far fa-image fa-fw fa-3x"></i>
        </button>
        <l-select
          v-if="form.options.headerImage"
          v-model="form.options.headerAlignment"
          class="my-2"
        >
          <template #default>Alignment</template>
          <template #options>
            <option value="mr-auto">Left</option>
            <option value="mx-auto">Center</option>
            <option value="ml-auto">Right</option>
          </template>
        </l-select>

        <l-text-link
          v-if="form.options.headerImage !== ''"
          class="btn-link my-1"
          @click="
            form.options.headerImage = ''
            headerImage = ''
          "
        >
          Clear
        </l-text-link>
      </div>
    </div>

    <div class="flex flex-col">
      <label class="font-semibold mb-1">Footer Image</label>
      <input
        id="inputFooterImage"
        type="file"
        hidden
        @change="updateLogo('inputFooterImage', 'footerImage')"
      />
      <div class="flex flex-col justify-start items-start">
        <button
          class="text-primary focus:outline-none hover:text-primary-darker w-36"
          style="min-height: 6rem"
          @click="activateInput('inputFooterImage')"
        >
          <img
            v-if="form.options.footerImage"
            :src="form.options.footerImage"
            class="rounded bg-cover"
          />
          <i v-else class="far fa-image fa-fw fa-3x"></i>
        </button>
        <l-select
          v-if="form.options.footerImage"
          v-model="form.options.footerAlignment"
          class="my-2"
        >
          <template #default>Alignment</template>
          <template #options>
            <option value="mr-auto">Left</option>
            <option value="mx-auto">Center</option>
            <option value="ml-auto">Right</option>
          </template>
        </l-select>
        <l-text-link
          v-if="form.options.footerImage !== ''"
          class="btn-link my-1"
          @click="
            form.options.footerImage = ''
            headerImage = ''
          "
        >
          Clear
        </l-text-link>
      </div>
    </div>

    <div class="flex flex-col">
      <label class="font-semibold mb-2">Theme Colour</label>
      <div class="flex space-x-2">
        <button
          v-for="(theme, index) in themeColours"
          :key="index"
          class="h-8 w-8 rounded-full border-2 border-gray-300 hover:border-gray-500 focus:outline-none"
          :class="theme.accentBackground"
          @click="
            form.options.theme = theme
            $forceUpdate()
          "
        >
          <i
            v-if="form.options.theme && theme.name === form.options.theme.name"
            class="fas fa-check fa-fw fa-sm text-white"
          ></i>
        </button>
      </div>
    </div>

    <div v-if="false" class="flex flex-col">
      <label class="font-semibold mb-2">Accent Colour</label>
      <div class="flex space-x-2">
        <button
          v-for="(colour, index) in accentColours"
          :key="index"
          class="h-8 w-8 rounded-full border-2 border-gray-300 hover:border-gray-500 focus:outline-none"
          :style="{ backgroundColor: colour }"
          @click="form.options.accentColour = colour"
        >
          <i
            v-if="colour === form.options.accentColour"
            class="fas fa-check fa-fw fa-sm"
            :class="colour === '#FFFFFF' ? 'text-black' : 'text-white'"
          ></i>
        </button>
      </div>
    </div>

    <div v-if="false" class="flex flex-col">
      <label class="font-semibold mb-2">Background Colour</label>
      <div class="flex space-x-2">
        <button
          v-for="(colour, index) in backgroundColours"
          :key="index"
          class="h-8 w-8 rounded-full border-2 border-gray-300 hover:border-gray-500 focus:outline-none"
          :style="{ backgroundColor: colour }"
          @click="
            form.options.backgroundColour = colour
            form.options.textColour =
              colour === '#000000' ? '#FFFFFF' : '#000000'
          "
        >
          <i
            v-if="colour === form.options.backgroundColour"
            class="fas fa-check fa-fw fa-sm"
            :class="colour === '#FFFFFF' ? 'text-black' : 'text-white'"
          ></i>
        </button>
      </div>
    </div>

    <div v-if="dataItem.flags.includes('KIOSK')" class="w-full">
      <l-input v-model="form.options.redirectURL">
        <template>
          <span class="flex items-center"
            >Redirection URL
            <popup-information
              >When in Kiosk mode, after a survey is submitted, the page will
              refresh to allow for a new submission. If a URL is entered, it
              will redirect to given URL.</popup-information
            ></span
          >
        </template>
      </l-input>
    </div>
  </div>
</template>

<script>
import { convertSurveyFromApiToForm } from '~/services/survey-helpers'
import { SURVEY_COLOURS } from '~/assets/settings/survey-settings'
import LTextLink from '~/components/LTextLink'
import LSelect from '~/components/LSelect'
import LInput from '~/components/LInput'
import PopupInformation from '~/components/elements/PopupInformation'

export default {
  name: 'SurveySettings',
  components: { LSelect, LTextLink, LInput, PopupInformation },
  props: {
    dataItem: {
      type: Object,
      required: true,
    },
  },
  data() {
    return {
      form: null,
      headerImage: '',
      footerImage: '',
      accentColours: SURVEY_COLOURS.accentColours,
      backgroundColours: SURVEY_COLOURS.backgroundColours,
      themeColours: SURVEY_COLOURS.themes,
    }
  },
  watch: {
    form: {
      handler() {
        this.$emit('update', this.form)
      },
      deep: true,
    },
  },
  created() {
    this.form = convertSurveyFromApiToForm(this.dataItem)
  },
  methods: {
    activateInput(which) {
      document.getElementById(which).click()
    },
    updateLogo(whichElement, whichData) {
      const t = this
      this[whichData] = document.getElementById(whichElement).files[0]
      const reader = new FileReader()

      reader.addEventListener(
        'load',
        function () {
          if (reader.result.includes('data:image'))
            t.form.options[whichData] = reader.result
          else t.form.options[whichData] = ''
          t.$forceUpdate()
        },
        false
      )

      if (this[whichData]) {
        reader.readAsDataURL(this[whichData])
        if (whichData === 'headerImage')
          this.form.options.headerAlignment = 'mr-auto'
        else this.form.options.footerAlignment = 'mr-auto'
      }
    },
  },
}
</script>

<style scoped></style>

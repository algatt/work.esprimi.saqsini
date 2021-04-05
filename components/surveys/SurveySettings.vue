<template>
  <div class="flex flex-col justify-between w-full">
    <div class="flex flex-col w-full space-y-5">
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
            class="text-primary focus:outline-none hover:text-primary-darker h-24 w-36"
            @click="activateInput('inputHeaderImage')"
          >
            <img
              v-if="form.options.headerImage"
              :src="form.options.headerImage"
              class="rounded bg-cover"
            />
            <i v-else class="far fa-image fa-fw fa-3x"></i>
          </button>
          <button
            v-if="form.options.headerImage !== ''"
            class="btn-link my-1"
            @click="
              form.options.headerImage = ''
              headerImage = ''
            "
          >
            Clear
          </button>
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
            class="text-primary focus:outline-none hover:text-primary-darker h-24 w-36"
            @click="activateInput('inputFooterImage')"
          >
            <img
              v-if="form.options.footerImage"
              :src="form.options.footerImage"
              class="rounded bg-cover"
            />
            <i v-else class="far fa-image fa-fw fa-3x"></i>
          </button>
          <button
            v-if="form.options.footerImage !== ''"
            class="btn-link my-1"
            @click="
              form.options.footerImage = ''
              headerImage = ''
            "
          >
            Clear
          </button>
        </div>
      </div>

      <div class="flex flex-col">
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

      <div class="flex flex-col">
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
    </div>
    <edit-object-modal-bottom-part
      :form="form"
      which="surveys"
      :is-valid="true"
      :show-delete="false"
    ></edit-object-modal-bottom-part>
  </div>
</template>

<script>
import EditObjectModalBottomPart from '~/components/layouts/EditObjectModalBottomPart'
import { SURVEY_COLOURS, SURVEY_OPTIONS } from '~/helpers/constants'

export default {
  name: 'SurveySettings',
  components: { EditObjectModalBottomPart },
  data() {
    return {
      form: null,
      headerImage: '',
      footerImage: '',
      accentColours: SURVEY_COLOURS.accentColours,
      backgroundColours: SURVEY_COLOURS.backgroundColours,
    }
  },
  computed: {
    survey() {
      return this.$store.state.currentItemToBeEdited
    },
  },
  created() {
    this.form = JSON.parse(JSON.stringify(this.survey))
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
      }
    },
    resetSettings() {
      this.form.options = JSON.parse(JSON.stringify(SURVEY_OPTIONS))
      this.headerImage = ''
      this.footerImage = ''
      this.$forceUpdate()
    },
  },
}
</script>

<style scoped></style>

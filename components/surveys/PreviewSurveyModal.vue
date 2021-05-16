<template>
  <screen-overlay :dim="true" @click="$emit('modalClosed')">
    <div
      class="w-full md:w-8/12 mx-auto flex flex-col relative shadow-md overflow-y-auto"
      style="height: 90vh"
      :style="{ backgroundColor: survey.options.backgroundColour }"
      @click.stop
    >
      <preview-survey
        :original-survey="originalSurvey"
        :questions="questions"
        :show-start="true"
        @finishSurvey="$emit('modalClosed')"
      ></preview-survey>

      <div class="absolute" style="top: 10px; right: 10px">
        <l-button-circle @click="$emit('modalClosed')">
          <i class="fas fa-times fa-fw fa-3xl text-white"></i
        ></l-button-circle>
      </div>
    </div>
  </screen-overlay>
</template>

<script>
import PreviewSurvey from '~/components/surveys/PreviewSurvey'
import { convertSurveyFromApiToForm } from '~/services/survey-helpers'
import LButtonCircle from '~/components/LButtonCircle'
import ScreenOverlay from '~/components/elements/ScreenOverlay'

export default {
  name: 'PreviewSurveyModal',
  components: { ScreenOverlay, LButtonCircle, PreviewSurvey },
  props: {
    originalSurvey: {
      type: Object,
      required: true,
    },
    questions: {
      type: Array,
      required: true,
    },
  },
  computed: {
    survey() {
      return convertSurveyFromApiToForm(this.originalSurvey)
    },
  },
  mounted() {
    document.documentElement.style.overflow = 'hidden'
    document.body.scroll = 'no'
  },
  destroyed() {
    document.documentElement.style.overflow = 'visible'
    document.body.scroll = 'yes'
    this.$emit('modalClosed')
  },
}
</script>

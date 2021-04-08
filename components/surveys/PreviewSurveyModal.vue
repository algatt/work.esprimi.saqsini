<template>
  <div class="frosted p-0 md:p-8 z-20" @click="$emit('modalClosed')">
    <div
      class="w-full check-height md:w-8/12 mx-auto flex flex-col relative shadow-md overflow-y-auto"
      :style="{
        backgroundColor: true ? '#E5E7EB' : survey.options.accentColour,
      }"
      @click.stop
    >
      <preview-survey
        :original-survey="originalSurvey"
        :questions="questions"
        :show-start="true"
        @finishSurvey="$emit('modalClosed')"
      ></preview-survey>
      <div class="absolute" style="top: 10px; right: 10px">
        <button-icon-rounded bg-colour="blue" @click="$emit('modalClosed')">
          <i class="fas fa-times fa-fw fa-3xl text-white"></i>
        </button-icon-rounded>
      </div>
    </div>
  </div>
</template>

<script>
import PreviewSurvey from '~/components/surveys/PreviewSurvey'
import { parseSurveyToForm } from '~/helpers/parseSurveyObjects'
import ButtonIconRounded from '~/components/elements/ButtonIconRounded'

export default {
  name: 'PreviewSurveyModal',
  components: { ButtonIconRounded, PreviewSurvey },
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
      return parseSurveyToForm(this.originalSurvey)
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

<!--<style scoped>-->
<!--.frosted {-->
<!--  @apply flex fixed top-0 left-0 w-full h-screen;-->
<!--  background: rgba(255, 255, 255, 0.5);-->
<!--  /*box-shadow: 0 8px 32px 0 rgba(31, 38, 135, 0.37);*/-->
<!--  /*backdrop-filter: blur(2px);*/-->
<!--  /*-webkit-backdrop-filter: blur(2px);*/-->
<!--}-->

<!--@media only screen and (min-width: 768px) {-->
<!--  .check-height {-->
<!--    max-height: 90%;-->
<!--  }-->
<!--}-->

<!--@media only screen and (max-width: 768px) {-->
<!--  .check-height {-->
<!--    max-height: 100%;-->
<!--  }-->
<!--}-->
<!--</style>-->

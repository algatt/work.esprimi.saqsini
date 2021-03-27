<template>
  <div class="frosted p-0 md:p-8 z-20" @click="$emit('modalClosed')">
    <div
      class="w-full md:w-6/12 mx-auto flex flex-col relative shadow-md overflow-y-auto"
      :style="{ backgroundColor: survey.options.accentColour }"
      @click.stop
    >
      <preview-survey
        :survey-prop="survey"
        :questions="questions"
        @finishSurvey="$emit('modalClosed')"
      ></preview-survey>
      <div class="absolute" style="top: 5px; right: 5px">
        <button class="btn-link-rounded" @click="$emit('modalClosed')">
          <i class="fas fa-times fa-fw fa-3xl text-gray-800"></i>
        </button>
      </div>
    </div>
  </div>
</template>

<script>
import PreviewSurvey from '~/components/surveys/PreviewSurvey'
export default {
  name: 'PreviewSurveyModal',
  components: { PreviewSurvey },
  props: {
    survey: {
      type: Object,
      required: true,
    },
    questions: {
      type: Array,
      required: true,
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

<style scoped>
.frosted {
  @apply flex fixed top-0 left-0 w-full h-screen;
  background: rgba(255, 255, 255, 0.5);
  /*box-shadow: 0 8px 32px 0 rgba(31, 38, 135, 0.37);*/
  /*backdrop-filter: blur(2px);*/
  /*-webkit-backdrop-filter: blur(2px);*/
}

@media only screen and (min-width: 768px) {
  .check-height {
    max-height: 90%;
  }
}

@media only screen and (max-width: 768px) {
  .check-height {
    max-height: 100%;
  }
}
</style>

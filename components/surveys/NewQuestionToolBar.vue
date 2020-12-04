<template>
  <div class="flex items-center justify-center">
    <div class="flex space-x-0 border border-primary-darker shadow">
      <button
        class="bg-primary text-white font-semibold py-1 w-32"
        @click="$emit('newQuestion', 'SECTION')"
      >
        New Page
      </button>
      <popup-menu-vue direction="center">
        <template v-slot:menuButton
          ><span class="bg-primary text-white font-semibold py-1 w-32"
            >New Question<i class="fas fa-caret-down fa-fw ml-1"></i></span
        ></template>
        <template v-slot:menuItems>
          <button
            v-for="question in questions"
            :key="question.code"
            @click="$emit('newQuestion', question.flag)"
          >
            <span class="popup-menu-button">
              <i class="fa-fw fa-sm" :class="question.icon"></i
              >{{ question.text }}</span
            >
          </button>
        </template>
      </popup-menu-vue>
    </div>
  </div>
</template>

<script>
import PopupMenuVue from '~/components/layouts/PopupMenu'
import { QUESTION_TYPES } from '~/helpers/constants'

export default {
  name: 'NewQuestionToolBar',
  components: { PopupMenuVue },
  data() {
    return {
      showSubMenu: false,
    }
  },
  computed: {
    questions() {
      const questions = []
      for (const x in QUESTION_TYPES) {
        if (x !== 'SECTION') questions.push(QUESTION_TYPES[x])
      }
      return questions
    },
  },
}
</script>

<style scoped></style>

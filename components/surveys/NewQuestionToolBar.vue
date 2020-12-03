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
export default {
  name: 'NewQuestionToolBar',
  components: { PopupMenuVue },
  data() {
    return {
      showSubMenu: false,
      questions: [
        {
          code: 1,
          text: 'Multiple Choice',
          flag: 'MULTIPLE_CHOICE',
          icon: 'fas fa-ellipsis-v',
        },
        { code: 2, text: 'Likert', flag: 'LIKERT', icon: 'fas fa-ellipsis-h' },
        {
          code: 3,
          text: 'Dropdown',
          flag: 'DROPDOWN',
          icon: 'fas fa-chevron-circle-down',
        },
        { code: 4, text: 'Type In', flag: 'TYPE_IN', icon: 'fas fa-keyboard' },
        { code: 5, text: 'Ranking', flag: 'RANKING', icon: 'fas fa-trophy' },
        {
          code: 6,
          text: 'Radio Grid',
          flag: 'RADIO_GRID',
          icon: 'fas fa-grip-horizontal',
        },
      ],
    }
  },
}
</script>

<style scoped></style>

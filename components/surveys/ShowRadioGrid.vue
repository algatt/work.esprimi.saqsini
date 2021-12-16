<template>
  <div class="flex flex-col">
    <div
      class="flex font-semibold mb-2 items-center"
      :class="displayStyle.textColour"
    >
      <span>{{ question.text }}</span>
      <span v-if="question.isMandatory" class="ml-1 text-xs font-medium italic">
        {{ languageText['required'] }}</span
      >
    </div>
    <div class="overflow-auto">
      <div class="block lg:hidden">
        <div
          v-for="(option, optionIndex) in rows"
          :key="optionIndex"
          class="mb-4"
        >
          <div
            class="font-bold mb-2"
            :style="`color:${displayStyle.textColor}`"
          >
            {{ option.text }}
          </div>
          <div
            v-for="(value, valueIndex) in columns"
            :key="valueIndex"
            class="border-2 rounded p-2 mb-2 cursor-pointer transition duration-300"
            :class="[
              displayStyle.borderColour,
              checkIfExists(option, value)
                ? `${displayStyle.accentBackground} text-white`
                : `${displayStyle.accentText}`,
            ]"
            @click="setAnswer(option, value)"
          >
            {{ value.text }}
          </div>
        </div>
      </div>
      <table class="hidden lg:block">
        <tr class="border-b border-gray-200">
          <td
            :style="{
              width: `${100 / columns}%`,
              minWidth: `${minElWidth * 1.5}px`,
            }"
          >
            &nbsp;
          </td>
          <td
            v-for="(item, index) in columns"
            :key="index"
            :style="{
              width: `${100 / columns}%`,
              minWidth: `${minElWidth}px`,
            }"
            class="text-center py-2"
          >
            {{ item.text }}
          </td>
        </tr>
        <tr v-for="(item, index) in rows" :key="index" class="even:bg-gray-100">
          <td
            class="text-left py-2"
            :style="{ color: displayStyle.textColour }"
          >
            {{ item.text }}
          </td>
          <td
            v-for="(i, columnIndex) in columns"
            :key="columnIndex"
            class="text-center"
          >
            <button
              :style="{ color: displayStyle.textColour }"
              @click="setAnswer(item, i)"
            >
              <i
                v-if="checkIfExists(item, i)"
                class="far fa-check-circle fa-fw"
                :class="displayStyle.accentText"
              ></i>
              <i v-else class="far fa-circle fa-fw"></i>
            </button>
          </td>
        </tr>
      </table>
    </div>
    <div class="flex my-2">
      <button
        class="cursor-pointer font-semibold"
        :class="displayStyle.accentText"
        @click="answers = []"
      >
        {{ languageText['clear'] }}
      </button>
    </div>
  </div>
</template>

<script>
export default {
  name: 'ShowRadioGrid',
  props: {
    question: {
      required: true,
      type: Object,
    },
    displayStyle: {
      required: true,
      type: Object,
    },
    existingAnswer: {
      required: false,
      type: Array,
      default: null,
    },
    languageText: {
      type: Object,
      required: true,
    },
  },
  data() {
    return {
      answers: [],
      options: {
        scale: [],
        rows: [],
      },
      minElWidth: 150,
    }
  },

  computed: {
    convertedQuestion() {
      const temp = JSON.parse(JSON.stringify(this.question))

      temp.options.forEach((option) => {
        option.questionOption = option.value
      })

      return temp
    },
    columns() {
      return this.convertedQuestion.options.filter((el) => {
        return el.flags.includes('COLUMN')
      })
    },
    rows() {
      return this.convertedQuestion.options.filter((el) => {
        return el.flags.includes('ROW')
      })
    },
  },
  watch: {
    answers() {
      this.$emit('answers', this.answers)
    },
  },
  created() {
    if (this.existingAnswer)
      this.answers = JSON.parse(JSON.stringify(this.existingAnswer))
  },
  methods: {
    checkIfExists(row, column) {
      return this.answers.find((el) => {
        return el.questionOption === row.value && el.value === column.value
      })
    },
    setAnswer(row, column) {
      if (this.checkIfExists(row, column)) {
        this.answers = this.answers.filter((el) => {
          return el.questionOption !== row.value
        })
      } else if (
        this.answers.find((el) => {
          return el.questionOption === row.value
        })
      ) {
        this.answers = this.answers.filter((el) => {
          return el.questionOption !== row.value
        })
        this.answers.push({ questionOption: row.value, value: column.value })
      } else
        this.answers.push({ questionOption: row.value, value: column.value })
    },
  },
}
</script>

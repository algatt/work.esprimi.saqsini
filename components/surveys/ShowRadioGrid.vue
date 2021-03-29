<template>
  <div
    class="flex flex-col w-full overflow-auto max-w-xs sm:max-w-sm md:max-w-md lg:max-w-lg xl:max-w-none mx-auto"
  >
    <div
      class="flex font-semibold mb-2 items-center"
      :style="{ color: displayStyle.textColour }"
    >
      {{ question.text }}
      <span v-if="question.isMandatory" class="ml-1 text-xs font-medium italic">
        {{ languageText['required'] }}</span
      >
    </div>

    <div
      class="flex-col"
      :style="{ minWidth: `${columns.length + 1 * minElWidth}px` }"
    >
      <div class="flex">
        <div
          class="border-b-2 py-2"
          :style="{
            width: `${100 / (columns.length + 1)}%`,
            minWidth: `${minElWidth}px`,
          }"
        ></div>
        <div
          v-for="(item, index) in columns"
          :key="index"
          class="flex relative items-center py-2 border-b-2 py-2"
          :style="{
            width: `${100 / (columns.length + 1)}%`,
            minWidth: `${minElWidth}px`,
          }"
        >
          <p
            class="text-center w-full"
            :style="{ color: displayStyle.textColour }"
          >
            {{ item.text }}
          </p>
        </div>
      </div>
      <div class="flex flex-wrap w-full">
        <div
          v-for="(item, index) in rows"
          :key="index"
          class="flex items-center w-full"
        >
          <div
            class="flex items-center relative border-b-2 py-2"
            :style="{
              width: `${100 / (columns.length + 1)}%`,
              minWidth: `${minElWidth}px`,
            }"
          >
            <p
              class="text-center w-full"
              :style="{ color: displayStyle.textColour }"
            >
              {{ item.text }}
            </p>
          </div>
          <div
            v-for="(i, index) in columns"
            :key="index"
            class="text-center border-b-2 py-2"
            :style="{
              width: `${100 / (columns.length + 1)}%`,
              minWidth: `${minElWidth}px`,
            }"
          >
            <button
              :style="{ color: displayStyle.textColour }"
              @click="setAnswer(item, i)"
            >
              <i
                v-if="checkIfExists(item, i)"
                class="far fa-check-circle fa-fw"
                :style="{ color: displayStyle.accentColour }"
              ></i>
              <i v-else class="far fa-circle fa-fw"></i>
            </button>
          </div>
        </div>
      </div>
    </div>

    <div class="flex my-2">
      <button
        class="cursor-pointer font-semibold"
        :style="{ color: displayStyle.accentColour }"
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
      minElWidth: 100,
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

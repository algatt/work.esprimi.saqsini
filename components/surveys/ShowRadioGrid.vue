<template>
  <div class="flex flex-col">
    <div
      class="flex font-semibold mb-2 items-center"
      :style="
        displayStyle.textColour ? null : { color: displayStyle.textColour }
      "
    >
      {{ question.text
      }}<span
        v-if="question.isMandatory"
        class="ml-1 text-xs font-medium italic"
      >
        {{ languageText['required'] }}</span
      >
    </div>

    <div class="flex flex-col flex-grow flex-1">
      <div class="flex w-full flex justify-end border-b-2">
        <div
          v-for="(item, index) in options.scale"
          :key="index"
          class="flex relative items-center py-2"
          :style="{ width: `${100 / (options.scale.length + 1)}%` }"
        >
          <p
            class="text-center w-full"
            :style="
              displayStyle.textColour
                ? null
                : { color: displayStyle.textColour }
            "
          >
            {{ options.scale[index].text }}
          </p>
        </div>
      </div>
      <div class="flex flex-wrap w-full">
        <div
          v-for="(item, index) in options.rows"
          :key="index"
          class="flex items-center w-full border-b-2 py-2"
        >
          <div
            class="flex items-center relative"
            :style="{
              width: `${100 / (options.scale.length + 1)}%`,
            }"
          >
            <p
              class="text-center w-full"
              :style="
                displayStyle.textColour
                  ? null
                  : { color: displayStyle.textColour }
              "
            >
              {{ options.rows[index] }}
            </p>
          </div>
          <div
            v-for="i in options.scale.length"
            :key="i"
            class="text-center"
            :style="{ width: `${100 / (options.scale.length + 1)}%` }"
          >
            <button
              :style="
                displayStyle.textColour
                  ? null
                  : { color: displayStyle.textColour }
              "
              @click="setAnswer(item, i)"
            >
              <i
                v-if="checkIfExists(item, i)"
                class="far fa-check-circle fa-fw"
              ></i>
              <i v-else class="far fa-circle fa-fw"></i>
            </button>
          </div>
        </div>
      </div>
    </div>

    <div class="flex my-2">
      <button class="btn-link cursor-pointer" @click="answers = []">
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
      default: () => {
        return {}
      },
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
    }
  },

  watch: {
    answers() {
      this.$emit('answers', this.answers)
    },
  },
  created() {
    if (this.existingAnswer)
      this.answers = JSON.parse(JSON.stringify(this.existingAnswer))

    let foundOne = 0
    this.question.options.forEach((el) => {
      if (el.ordinalPosition === 1) foundOne++
      if (foundOne === 1) {
        this.options.scale.push({
          ordinalPosition: el.ordinalPosition,
          text: el.text,
          value: el.value,
        })
      } else {
        this.options.rows.push(el.text)
      }
    })
  },
  methods: {
    checkIfExists(row, column) {
      column = this.options.scale[column - 1].value
      return this.answers.find((el) => {
        return el.row === row && el.column === column
      })
    },
    setAnswer(row, column) {
      column = this.options.scale[column - 1].value
      const foundRow = this.answers.find((el) => {
        return el.row === row
      })
      const foundExactMatch = this.answers.find((el) => {
        return el.row === row && el.column === column
      })
      if (foundRow && foundExactMatch) {
        this.answers = this.answers.filter((el) => {
          return el.row !== row
        })
      } else if (foundRow && !foundExactMatch) {
        this.answers = this.answers.filter((el) => {
          return el.row !== row
        })
        this.answers.push({ row, column, code: `${row}#${column}` })
      } else {
        this.answers.push({ row, column, code: `${row}#${column}` })
      }
    },
  },
}
</script>

<style scoped>
.card-likert {
  @apply w-full md:flex-1 justify-center px-3 py-2 flex-wrap shadow-sm transition duration-300 font-semibold focus:outline-none;
}

.card-likert:first-child {
  @apply md:border-2 md:rounded-l border-2 rounded-t md:rounded-none;
}

.card-likert:last-child {
  @apply md:border-t-2 md:border-b-2 md:border-r-2  md:border-l-0 md:rounded-r border-l-2 border-r-2 border-b-2 rounded-b md:rounded-none;
}

.card-likert:not(:first-child):not(:last-child) {
  @apply md:border-t-2 md:border-b-2 md:border-r-2 md:border-l-0 border-l-2 border-r-2 border-b-2;
}
</style>

<template>
  <div class="flex flex-col w-full">
    <div class="flex flex-wrap w-full">
      <div class="flex flex-col flex-grow flex-1">
        <div class="flex w-full flex justify-end">
          <div
            v-for="(item, index) in form.options[0].scale"
            :key="index"
            class="flex relative items-center"
            :style="{ width: `${100 / (form.options[0].scale.length + 1)}%` }"
          >
            <input
              v-model="form.options[0].scale[index].text"
              class="input text-center w-full"
            />
            <button
              v-if="form.options[0].scale.length > 2"
              class="absolute right-0 mr-1 bg-white text-red-400 hover:text-red-500 transition duration-300"
              @click="deleteScale(index)"
            >
              <i class="fas fa-trash fa-fw fa-xs"></i>
            </button>
          </div>
        </div>
        <div class="flex flex-wrap w-full">
          <div
            v-for="(item, index) in form.options[0].rows"
            :key="index"
            class="flex items-center w-full"
          >
            <div
              class="flex items-center relative"
              :style="{
                width: `${100 / (form.options[0].scale.length + 1)}%`,
              }"
            >
              <input
                v-model="form.options[0].rows[index]"
                class="input text-center w-full"
              />
              <button
                v-if="form.options[0].rows.length > 1"
                class="absolute right-0 mr-1 bg-white text-red-400 hover:text-red-500 transition duration-300"
                @click="deleteRow(index)"
              >
                <i class="fas fa-trash fa-fw fa-xs"></i>
              </button>
            </div>
            <div
              v-for="i in form.options[0].scale.length"
              :key="i"
              class="text-center"
              :style="{ width: `${100 / (form.options[0].scale.length + 1)}%` }"
            >
              <input
                :id="index + '_' + i"
                type="radio"
                :name="index"
                :value="index + '_' + i"
              />
            </div>
          </div>
        </div>
      </div>
      <div class="w-24 flex justify-center items-center">
        <button
          class="text-gray-400 hover:text-gray-500 transition duration-300"
          @click="addScale"
        >
          <i class="fas fa-plus fa-fw"></i>
        </button>
      </div>
    </div>
    <div class="flex justify-center">
      <button
        class="text-gray-400 hover:text-gray-500 transition duration-300"
        @click="addRow"
      >
        <i class="fas fa-plus fa-fw"></i>
      </button>
    </div>
  </div>
</template>

<script>
import questionMixin from '~/helpers/questionMixin'

export default {
  name: 'NewQuestionRadioGrid',
  mixins: [questionMixin],
  props: {
    form: {
      type: Object,
      required: true,
    },
  },
  data() {
    return {
      options: [{ scale: [], rows: [] }],
    }
  },
  created() {
    if (!this.form.options) {
      this.form.options = this.options
      this.options[0].scale = [
        { ordinalPosition: 1, text: 'Strongly Disagree', value: 1 },
        { ordinalPosition: 2, text: 'Disagree', value: 2 },
        { ordinalPosition: 3, text: 'Neutral', value: 3 },
        { ordinalPosition: 4, text: 'Agree', value: 4 },
        { ordinalPosition: 5, text: 'Strongly Agree', value: 5 },
      ]
      this.options[0].rows = ['Default']
    } else {
      this.options[0].scale = this.form.options
    }
  },
  methods: {
    deleteScale(index) {
      this.form.options[0].scale.splice(index, 1)
      let i = 1
      this.options[0].scale.forEach((el) => {
        el.ordinalPosition = i
        el.value = i
        i++
      })
    },
    addScale() {
      const i =
        this.form.options[0].scale[this.form.options[0].scale.length - 1]
          .value + 1
      this.form.options[0].scale.push({
        ordinalPosition: i,
        text: 'Default',
        value: i,
      })
    },
    addRow() {
      this.form.options[0].rows.push('Default')
    },
    deleteRow(index) {
      this.options[0].rows.splice(index, 1)
    },
  },
}
</script>

<style scoped></style>

<template>
  <div class="flex flex-col w-full">
    <div class="flex flex-wrap w-full">
      <div class="flex flex-col flex-grow flex-1">
        <div class="flex w-full flex justify-end">
          <div
            v-for="(item, index) in options[0].scale"
            :key="index"
            class="flex relative items-center p-2"
            :style="{ width: `${100 / (options[0].scale.length + 1)}%` }"
          >
            <div
              class="w-full flex items-stretch border border-gray-200 rounded"
            >
              <input
                v-model="options[0].scale[index].text"
                class="text-center w-full bg-gray-50 py-2 focus:bg-white border-b border-transparent focus:border-primary transition duration-300"
              />
              <button
                v-if="options[0].scale.length > 2"
                class="w-8 text-red-400 hover:text-red-500 transition duration-300 flex items-center justify-center py-2 bg-gray-50 border-l-2 border-gray-100"
                @click="deleteScale(index)"
              >
                <i class="fas fa-trash fa-fw fa-xs"></i>
              </button>
            </div>
          </div>
        </div>
        <div class="flex flex-wrap w-full">
          <div
            v-for="(item, index) in options[0].rows"
            :key="index"
            class="flex items-center w-full my-2"
          >
            <div
              class="flex items-center relative"
              :style="{
                width: `${100 / (options[0].scale.length + 1)}%`,
              }"
            >
              <div
                class="w-full flex items-stretch border border-gray-200 rounded"
              >
                <input
                  v-model="options[0].rows[index]"
                  class="text-center w-full bg-gray-50 py-2 focus:bg-white border-b border-transparent focus:border-primary transition duration-300"
                />
                <button
                  v-if="options[0].rows.length > 1"
                  class="w-8 text-red-400 hover:text-red-500 transition duration-300 flex items-center justify-center py-2 bg-gray-50 border-l-2 border-gray-100"
                  @click="deleteRow(index)"
                >
                  <i class="fas fa-trash fa-fw fa-xs"></i>
                </button>
              </div>
            </div>
            <div
              v-for="i in options[0].scale.length"
              :key="i"
              class="text-center"
              :style="{ width: `${100 / (options[0].scale.length + 1)}%` }"
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
        <button class="btn-link-rounded" @click="addScale">
          <i class="fas fa-plus fa-fw"></i>
        </button>
      </div>
    </div>
    <div class="flex justify-center">
      <button class="btn-link-rounded" @click="addRow">
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
      convertedOptions: [],
    }
  },
  watch: {
    options: {
      handler() {
        this.convertedOptions = []
        this.options[0].scale.forEach((el) => {
          this.convertedOptions.push({
            ordinalPosition: el.ordinalPosition,
            text: el.text,
            value: el.value,
            mask: 2,
            flags: ['COLUMN'],
          })
        })
        let i = 1
        this.options[0].rows.forEach((el) => {
          this.convertedOptions.push({
            ordinalPosition: i++,
            text: el,
            value: el,
            mask: 1,
            flags: ['ROW'],
          })
        })
        this.$forceUpdate()
        this.$emit('updatedOptions', this.convertedOptions)
      },
      deep: true,
    },
  },
  created() {
    if (!this.form.options || this.form.options.length === 0) {
      this.options[0].scale = [
        { ordinalPosition: 1, text: 'Strongly Disagree', value: 1 },
        { ordinalPosition: 2, text: 'Disagree', value: 2 },
        { ordinalPosition: 3, text: 'Neutral', value: 3 },
        { ordinalPosition: 4, text: 'Agree', value: 4 },
        { ordinalPosition: 5, text: 'Strongly Agree', value: 5 },
      ]
      this.options[0].rows = ['Default']
    } else {
      let foundOne = 0
      this.form.options.forEach((el) => {
        if (el.ordinalPosition === 1) foundOne++
        if (foundOne === 1) {
          this.options[0].scale.push({
            ordinalPosition: el.ordinalPosition,
            text: el.text,
            value: el.value,
          })
        } else {
          this.options[0].rows.push(el.text)
        }
      })
    }
  },
  methods: {
    deleteScale(index) {
      this.options[0].scale.splice(index, 1)
      let i = 1
      this.options[0].scale.forEach((el) => {
        el.ordinalPosition = i
        el.value = i
        i++
      })
    },
    addScale() {
      const i =
        this.options[0].scale[this.options[0].scale.length - 1].value + 1
      this.options[0].scale.push({
        ordinalPosition: i,
        text: 'Default',
        value: i,
      })
    },
    addRow() {
      this.options[0].rows.push('Default')
    },
    deleteRow(index) {
      this.options[0].rows.splice(index, 1)
    },
  },
}
</script>

<style scoped></style>

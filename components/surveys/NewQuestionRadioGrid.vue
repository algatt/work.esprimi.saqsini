<template>
  <div class="flex flex-col w-full">
    <div
      class="flex flex-col w-full overflow-auto max-w-xs sm:max-w-sm md:max-w-md lg:max-w-lg xl:max-w-none mx-auto"
    >
      <div
        class="flex-col"
        :style="{ minWidth: `${(options[0].scale.length + 2) * minElWidth}px` }"
      >
        <div class="flex w-full flex">
          <div
            :style="{
              width: `${100 / (options[0].scale.length + 2)}%`,
              minWidth: `${minElWidth}px`,
            }"
          >
            &nbsp;
          </div>
          <div
            v-for="(item, index) in options[0].scale"
            :key="index"
            class="flex relative items-center p-2"
            :style="{
              width: `${100 / (options[0].scale.length + 2)}%`,
              minWidth: `${minElWidth}px`,
            }"
          >
            <l-input-button
              v-model="options[0].scale[index].text"
              button-color="red"
              :button-disabled="options[0].scale.length < 3"
              @click="deleteScale(index)"
            >
              <i class="fas fa-trash-alt fa-fw"></i>
            </l-input-button>
          </div>
          <div class="flex justify-center items-center pt-2 w-8">
            <l-button-circle @click="addScale">
              <i class="fas fa-plus fa-fw"></i>
            </l-button-circle>
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
                width: `${100 / (options[0].scale.length + 2)}%`,
                minWidth: `${minElWidth}px`,
              }"
            >
              <l-input-button
                v-model="options[0].rows[index]"
                button-color="red"
                :button-disabled="options[0].rows.length === 1"
                @click="deleteRow(index)"
              >
                <i class="fas fa-trash-alt fa-fw"></i>
              </l-input-button>
            </div>
            <div
              v-for="i in options[0].scale.length"
              :key="i"
              class="text-center"
              :style="{
                width: `${100 / (options[0].scale.length + 2)}%`,
                minWidth: `${minElWidth}px`,
              }"
            >
              <input
                :id="index + '_' + i"
                type="radio"
                :name="index"
                :value="index + '_' + i"
              />
            </div>
          </div>
          <div
            class="flex justify-center items-center mt-2"
            :style="{
              width: `${100 / (options[0].scale.length + 2)}%`,
              minWidth: `${minElWidth}px`,
            }"
          >
            <l-button-circle @click="addRow">
              <i class="fas fa-plus fa-fw"></i>
            </l-button-circle>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import LButtonCircle from '~/components/LButtonCircle'

export default {
  name: 'NewQuestionRadioGrid',
  components: {
    LButtonCircle,
  },
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
      minElWidth: 150,
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

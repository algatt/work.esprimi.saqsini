<script>
import { HorizontalBar, mixins } from 'vue-chartjs'
import { OPTIONS_HORIZONTAL_BAR } from '@/assets/settings/charts-settings'

export default {
  extends: HorizontalBar,
  mixins: [mixins.reactiveProp],
  props: {
    properties: {
      type: Object,
      required: false,
      default: () => {
        return { title: '' }
      },
    },
  },
  data() {
    return {
      OPTIONS_HORIZONTAL_BAR,
    }
  },

  mounted() {
    const options = this.OPTIONS_HORIZONTAL_BAR
    options.title.text = this.properties?.title
    this.renderChart(this.chartData, options)
  },
}
</script>

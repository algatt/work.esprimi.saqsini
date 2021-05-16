<script>
import { Pie, mixins } from 'vue-chartjs'
import { OPTIONS_PIE_CHART } from '~/assets/settings/charts-settings'

export default {
  extends: Pie,
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
      OPTIONS_PIE_CHART,
    }
  },

  mounted() {
    const options = this.OPTIONS_PIE_CHART
    options.title.text = this.properties?.title
    this.renderChart(this.chartData, options)
  },
}
</script>

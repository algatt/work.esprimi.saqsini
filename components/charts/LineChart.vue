<script>
import { Line, mixins } from 'vue-chartjs'
import { OPTIONS_LINE_CHART } from '~/assets/settings/charts-settings'

export default {
  extends: Line,
  mixins: [mixins.reactiveProp],
  props: {
    properties: {
      type: Object,
      required: false,
      default: () => {
        return { title: '', xAxes: '', yAxes: '' }
      },
    },
  },
  data() {
    return {
      OPTIONS_LINE_CHART,
    }
  },

  mounted() {
    const options = this.OPTIONS_LINE_CHART
    options.title.text = this.properties?.title
    options.scales.xAxes[0].scaleLabel.labelString = this.properties?.xAxes
    options.scales.yAxes[0].scaleLabel.labelString = this.properties?.yAxes
    this.renderChart(this.chartData, options)
  },
}
</script>

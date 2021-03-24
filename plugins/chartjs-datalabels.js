import Chart from 'chart.js'
import ChartDataLabels from 'chartjs-plugin-datalabels'

Chart.plugins.register(ChartDataLabels)

Chart.helpers.merge(Chart.defaults.global.plugins.datalabels, {
  anchor: 'end',
  align: 'bottom',
  backgroundColor: 'rgba(255, 255, 255, 0.6)',
  borderRadius: 5,
  color: '#333333',
  font: { size: '14', weight: 'bold', family: 'Poppins' },
  padding: { right: 6, left: 6 },
  formatter(value, context) {
    // return context.chart.data.labels[context.dataIndex]

    return value === 0 ? null : value
  },
})

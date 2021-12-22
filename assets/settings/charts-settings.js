export const CHART_TYPE_COMPONENT = {
  MULTIPLE_CHOICE: 'chart-multiple-choice',
  DROPDOWN: 'chart-multiple-choice',
  LIKERT: 'chart-likert',
  RANKING: 'chart-ranking',
  TYPE_IN: 'chart-type-in',
  RADIO_GRID: 'chart-radio-grid',
}

// export const CHART_TYPE_COMPONENT = {
//   MULTIPLE_CHOICE: 'chart-multiple-choice',
//   DROPDOWN: 'chart-multiple-choice',
//   LIKERT: 'chart-likert',
//   RANKING: 'chart-ranking',
//   TYPE_IN: 'chart-type-in',
//   RADIO_GRID: 'chart-radio-grid',
// }
//
// export const OPTIONS_PIE_CHART = {
//   title: {
//     display: true,
//     // text: 'Title Goes Here',
//     fontSize: 16,
//     fontFamily: 'Poppins',
//   },
//   legend: {
//     position: 'bottom',
//     labels: { fontFamily: 'Poppins' },
//   },
//   maintainAspectRatio: false,
//   responsive: true,
// }
//
// export const OPTIONS_LINE_CHART = {
//   title: {
//     display: true,
//     // text: 'Title Goes Here',
//     fontSize: 16,
//     fontFamily: 'Poppins',
//   },
//   legend: {
//     display: false,
//   },
//   maintainAspectRatio: false,
//   responsive: true,
//   scales: {
//     xAxes: [
//       {
//         display: true,
//         gridLines: {
//           display: true,
//           drawBorder: true,
//           drawOnChartArea: false,
//         },
//         scaleLabel: {
//           display: true,
//           // labelString: 'Date',
//         },
//       },
//     ],
//     yAxes: [
//       {
//         display: true,
//         gridLines: {
//           display: true,
//           drawBorder: true,
//           drawOnChartArea: false,
//         },
//         scaleLabel: {
//           display: true,
//           // labelString: 'Count',
//         },
//         ticks: {
//           beginAtZero: true,
//         },
//       },
//     ],
//   },
// }
//
// export const OPTIONS_HORIZONTAL_BAR = {
//   title: {
//     display: true,
//     // text: 'Title goes here',
//     fontSize: 16,
//     fontFamily: 'Poppins',
//   },
//   responsive: true,
//   maintainAspectRatio: false,
//   legend: {
//     display: false,
//   },
//   scales: {
//     xAxes: [
//       {
//         gridLines: {
//           display: true,
//           drawBorder: true,
//           drawOnChartArea: false,
//         },
//         ticks: {
//           beginAtZero: true,
//           precision: 0,
//         },
//       },
//     ],
//     yAxes: [
//       {
//         gridLines: {
//           display: true,
//           drawBorder: true,
//           drawOnChartArea: false,
//         },
//       },
//     ],
//   },
// }
//
// export const OPTIONS_BAR_CHART = {
//   title: {
//     display: true,
//     // text: 'Title goes here',
//     fontSize: 16,
//     fontFamily: 'Poppins',
//   },
//   responsive: false,
//   maintainAspectRatio: false,
//   legend: {
//     display: false,
//   },
//
//   scales: {
//     xAxes: [
//       {
//         gridLines: {
//           display: true,
//           drawBorder: true,
//           drawOnChartArea: false,
//         },
//       },
//     ],
//     yAxes: [
//       {
//         gridLines: {
//           display: true,
//           drawBorder: true,
//           drawOnChartArea: false,
//         },
//         ticks: {
//           beginAtZero: true,
//           precision: 0,
//         },
//       },
//     ],
//   },
// }
//
export const REPORT_CHART_SETTINGS = {
  maxQuestionHeight: 500,
  minQuestionHeight: 300,
  horizontalBar: {
    barHeight: 70,
  },
  theme: {
    monochrome: {
      enabled: true,
      color: '#1D4ED8',
      shadeTo: 'dark',
      shadeIntensity: 0.95,
    },
  },
  titleStyle: {
    fontSize: '14px',
    fontWeight: 'bold',
    fontFamily: 'Poppins',
    color: '#263238',
  },
  colors: [
    '#3B82F6',
    '#4F46E5',
    '#8B5CF6',
    '#EC4899',
    '#EF4444',
    '#F59E0B',
    '#10B981',
    '#1E40AF',
    '#5B21B6',
    '#9D174D',
    '#991B1B',
    '#B45309',
    '#065F46',
  ],
}

export const PIE_CHART_SETTINGS = (labels, series, title) => {
  return {
    chartOptions: {
      colors: REPORT_CHART_SETTINGS.colors,
      chart: {
        type: 'pie',
      },
      title: {
        text: title,
        align: 'center',
        style: REPORT_CHART_SETTINGS.titleStyle,
      },
      labels,
      legend: {
        position: 'bottom',
      },
    },
    series,
  }
}

export const LINE_CHART_SETTINGS = (labels, series, title, seriesTitle) => {
  return {
    chartOptions: {
      colors: REPORT_CHART_SETTINGS.colors,
      chart: {
        type: 'line',
        toolbar: {
          show: false,
        },
      },

      title: {
        text: title,
        align: 'center',
        style: REPORT_CHART_SETTINGS.titleStyle,
      },
      xaxis: { categories: labels },
      legend: {
        position: 'bottom',
      },
    },
    series: [{ name: seriesTitle, data: series }],
  }
}

export const HORIZONTAL_BAR_CHART_SETTINGS = (
  labels,
  series,
  title,
  seriesTitle
) => {
  return {
    chartOptions: {
      colors: REPORT_CHART_SETTINGS.colors,
      chart: {
        type: 'bar',
      },
      plotOptions: {
        bar: {
          horizontal: true,
        },
      },
      title: {
        text: title,
        align: 'center',
        style: REPORT_CHART_SETTINGS.titleStyle,
      },
      xaxis: { categories: labels },
      legend: {
        position: 'bottom',
      },
    },
    series: [{ name: seriesTitle, data: series }],
  }
}

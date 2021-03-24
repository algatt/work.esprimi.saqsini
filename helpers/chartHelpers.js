import colours from '~/assets/settings/colours.json'

export function getDataAggregateByDemographic(
  selectedList,
  selectedDemographic,
  originalData
) {
  const datasets = {
    labels: selectedList,
    datasets: [],
  }

  let idx = 0
  originalData.demographics[selectedDemographic].forEach((demo) => {
    const dataset = {
      label: demo,
      data: Array(selectedList.length).fill(0),
      backgroundColor: colours[idx++],
    }
    selectedList.forEach((value) => {
      originalData.responses.forEach((response) => {
        const respondents = originalData.invitees
          .filter((el) => {
            return el[selectedDemographic] && el[selectedDemographic] === demo
          })
          .map((el) => {
            return el.code
          })
        if (respondents.includes(response.invitee)) {
          response.value.forEach((el) => {
            if (value === el) {
              dataset.data[datasets.labels.indexOf(el)] += 1
            }
          })
        }
      })
    })
    datasets.datasets.push(dataset)
  })
  return datasets
}

export function getDataAggregate(legendData, selectedList, originalData) {
  let data = {}
  legendData.forEach((el) => {
    if (selectedList.includes(el)) data[el] = 0
  })

  originalData.responses.forEach((response) => {
    response.value.forEach((value) => {
      if (selectedList.includes(value)) data[value] += 1
    })
  })
  data = Object.values(data)

  return {
    labels: selectedList.map((el) => {
      return el
    }),
    datasets: [
      {
        data,
        backgroundColor: colours,
      },
    ],
  }
}

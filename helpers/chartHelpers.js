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

export function getDifferentAnswers(question, responses) {
  let data = []

  if (question.availableOptions) {
    question.availableOptions.forEach((el) => {
      data.push({ text: el.text, code: el.value })
    })
  }
  responses.forEach((response) => {
    response.value.forEach((value) => {
      if (
        !data.find((el) => {
          return el.code === value
        })
      )
        data.push({ text: value, code: value })
    })
  })

  data = data.sort((a, b) => {
    return a.code > b.code ? 1 : -1
  })

  return data
}

export function getDataAggregateRanking(
  legendData,
  selectedList,
  originalData,
  selectedDemographic
) {
  let answers = getDifferentAnswers(
    originalData.question,
    originalData.responses
  )

  answers = answers.map((el) => {
    return el.code
  })

  const dataToReturn = {
    labels: [],
    datasets: [],
  }

  for (let i = 0; i < answers.length; i++) {
    dataToReturn.labels.push(i + 1)
    dataToReturn.datasets.push({
      label: answers[i],
      data: new Array(answers.length).fill(0),
      backgroundColor: colours[i],
    })
  }

  const whichResponses = originalData.responses
  let invitees = []

  if (selectedDemographic.length !== 0) {
    const demographicValues = selectedDemographic.map((el) => {
      return el.name
    })
    const whichDemographic = selectedDemographic[0].type
    invitees = originalData.invitees
      .filter((el) => {
        return (
          el[whichDemographic] &&
          demographicValues.includes(el[whichDemographic])
        )
      })
      .map((el) => {
        return el.code
      })
  }

  whichResponses.forEach((response) => {
    for (let i = 0; i < response.value.length; i++) {
      const x = dataToReturn.datasets.find((el) => {
        return (
          (selectedDemographic.length === 0 &&
            el.label === response.value[i]) ||
          (selectedDemographic.length !== 0 &&
            invitees.includes(response.invitee) &&
            el.label === response.value[i])
        )
      })
      if (x) x.data[i] += 1
    }
  })
  return dataToReturn
}

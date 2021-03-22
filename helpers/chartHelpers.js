export function getDifferentAnswers(question, allResponses) {
  let data = []
  data.push(
    ...question.availableOptions.map((el) => {
      return { text: el.text, code: el.value }
    })
  )

  const responses = allResponses.filter((el) => {
    return el.question === question.code
  })

  responses.forEach((eachResponse) => {
    eachResponse.value.forEach((option) => {
      if (
        !data
          .map((el) => {
            return el.code
          })
          .includes(option)
      )
        data.push({ text: option, code: option })
    })
  })

  data = data.sort((a, b) => {
    return a.code > b.code ? 1 : -1
  })

  return data
}

import moment from 'moment'
import { PREFERRED_LANGUAGE } from '~/helpers/constants'

export function parseSurveyToForm(survey) {
  const temp = JSON.parse(JSON.stringify(survey))

  if (!temp.defaultLanguage) temp.defaultLanguage = PREFERRED_LANGUAGE
  if (!temp.referenceDate) temp.referenceDate = moment().format('YYYY-MM-DD')
  if (!temp.validFromTimestamp) {
    temp.validFromDate = moment().format('YYYY-MM-DD')
    temp.validFromTime = '08:00'
  } else {
    temp.validFromDate = moment(
      temp.validFromTimestamp.replace(' +', '+')
    ).format('YYYY-MM-DD')
    temp.validFromTime = moment(
      temp.validFromTimestamp.replace(' +', '+')
    ).format('HH:mm')
  }
  if (temp.validToTimestamp) {
    temp.validToDate = moment(temp.validToTimestamp.replace(' +', '+')).format(
      'YYYY-MM-DD'
    )
    temp.validToTime = moment(temp.validToTimestamp.replace(' +', '+')).format(
      'HH:mm'
    )
  }

  if (temp.text) {
    const text = temp.text.find((el) => {
      return el.language === PREFERRED_LANGUAGE
    })
    temp.text = text.text
  }

  return temp
}

export function parseSurveyToAPI(survey) {
  const temp = JSON.parse(JSON.stringify(survey))

  const dateStringFrom = temp.validFromDate + ' ' + temp.validFromTime
  temp.validFromTimestamp = moment(dateStringFrom).format(
    'YYYY-MM-DD HH:MM:SSZZ'
  )
  delete temp.validFromDate
  delete temp.validFromTime

  if (temp.validToDate) {
    const dateStringTo = temp.validToDate + ' ' + temp.validToTime
    temp.validToTimestamp = moment(dateStringTo).format('YYYY-MM-DD HH:MM:SSZZ')
    delete temp.validToDate
    delete temp.validToTime
  }

  temp.text = [{ language: PREFERRED_LANGUAGE, text: temp.text }]

  return temp
}

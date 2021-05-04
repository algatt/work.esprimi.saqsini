import SurveySettings from '@/assets/settings/surveySettings.json'

export default function convertSurveyFromApiToForm(survey) {
  const tempSurvey = JSON.parse(JSON.stringify(survey))
  tempSurvey.options = JSON.parse(tempSurvey.options)

  const text = tempSurvey.text.find((el) => {
    return el.language === SurveySettings.PREFERRED_LANGUAGE
  })
  if (text && text.text) tempSurvey.text = text.text

  return tempSurvey
}

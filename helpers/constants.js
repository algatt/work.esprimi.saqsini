export const PREFERRED_LANGUAGE = 'en'

export const SURVEY_OPTIONS = {
  accentColour: '#2563EB',
  backgroundColour: '#ffffff',
  textColour: '#374151',
  headerImage: '',
  footerImage: '',
}

export const QUESTION_TYPES = {
  MULTIPLE_CHOICE: {
    code: 1,
    text: 'Multiple Choice',
    flag: 'MULTIPLE_CHOICE',
    icon: 'fas fa-ellipsis-v',
    options: ['allowOther', 'allowMultiple'],
  },
  LIKERT: {
    code: 2,
    text: 'Likert',
    flag: 'LIKERT',
    icon: 'fas fa-ellipsis-h',
    options: ['showWeights'],
  },
  DROPDOWN: {
    code: 3,
    text: 'Dropdown',
    flag: 'DROPDOWN',
    icon: 'fas fa-chevron-circle-down',
  },
  TYPE_IN: {
    code: 4,
    text: 'Type In',
    flag: 'TYPE_IN',
    icon: 'fas fa-keyboard',
  },
  RANKING: { code: 5, text: 'Ranking', flag: 'RANKING', icon: 'fas fa-trophy' },
  RADIO_GRID: {
    code: 6,
    text: 'Radio Grid',
    flag: 'RADIO_GRID',
    icon: 'fas fa-grip-horizontal',
  },
}

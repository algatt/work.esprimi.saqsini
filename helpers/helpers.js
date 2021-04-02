import moment from 'moment'

export function createMomentFromDateAndTime(date, time) {
  const dateStringTo = date + ' ' + time
  return moment(dateStringTo).format('YYYY-MM-DD HH:mm:SSZZ')
}

const { DateTime } = require('luxon')

export function isDateBefore(date1, date2) {
  return DateTime.fromISO(date1) < DateTime.fromISO(date2)
}

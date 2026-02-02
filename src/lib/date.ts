export function validateDateFormat(value: string) {
  // DD/MM/YYYY
  return /^\d{1,2}\/\d{2}\/\d{4}$/.test(value)
}

export function validateDates(value: string[]) {
  return value.every(validateDateFormat)
}

export function parseDate(value: string) {
  const [day, month, year] = value.split('/')

  return new Date(
    parseInt(year!),
    parseInt(month!) - 1,
    parseInt(day!)
  ).getTime()
}

import * as Sentry from '@sentry/vue'
import Papa from 'papaparse'
import type { Result } from './findPayments'

export function readCsv<D = any>(
  file: File,
  config: Papa.ParseConfig<D>
): Promise<D[]> {
  const reader = new FileReader()

  return new Promise((resolve, reject) => {
    reader.onload = () => {
      const csv = reader.result as string
      resolve(Papa.parse<D>(csv, config).data)
    }

    reader.onerror = (e) => {
      Sentry.captureException(e)
      reject(e)
    }
    reader.readAsText(file)
  })
}

export function writeCsv(data: Result[], config: Papa.UnparseConfig) {
  const csvRows = data.flatMap((r) => {
    const deposits = r.deposits ?? []

    // Caso: total sin depósitos
    if (deposits.length === 0) {
      return [
        {
          date: r.payment.date,
          total: (r.payment.amount / 100).toFixed(2),
          'deposit date': '',
          deposit: ''
        }
      ]
    }

    // Caso: total con depósitos
    return deposits.map((d, index) => ({
      date: index === 0 ? r.payment.date : '',
      total: index === 0 ? (r.payment.amount / 100).toFixed(2) : '',
      'deposit date': d.date,
      deposit: (d.amount / 100).toFixed(2)
    }))
  })

  return Papa.unparse(csvRows, config)
}

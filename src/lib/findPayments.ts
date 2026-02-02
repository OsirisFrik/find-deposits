import * as Sentry from '@sentry/vue'

export interface Data {
  date: string
  amount: number
  id: string
  dateValue: number
}

export interface Result {
  payment: Data
  deposits: Data[]
}

function findDeposits(
  deposits: Data[],
  target: number,
  usedDeposits: Set<string>
): Data[] | null {
  function backtrack(
    start: number,
    currentSum: number,
    current: Data[]
  ): Data[] | null {
    if (currentSum === target) {
      return [...current]
    }

    if (currentSum > target) return null

    for (let i = start; i < deposits.length; i++) {
      const d = deposits[i]

      if (usedDeposits.has(d!.id)) continue

      current.push(d!)

      const result = backtrack(i + 1, currentSum + d!.amount, current)

      current.pop()

      if (result) return result
    }

    return null
  }

  return backtrack(0, 0, [])
}

function getDeposits(
  payment: Data,
  deposits: Data[],
  usedDeposits: Set<string>
): Result | null {
  const availableDeposits = deposits
    .filter(
      (item) =>
        item.dateValue >= payment.dateValue && !usedDeposits.has(item.id)
    )
    .sort((a, b) =>
      a.date === b.date ? a.amount - b.amount : a.date.localeCompare(b.date)
    )

  const match = findDeposits(availableDeposits, payment.amount, usedDeposits)

  if (match) {
    for (const deposit of match) {
      usedDeposits.add(deposit.id)
    }

    return {
      payment,
      deposits: match
    }
  }

  return null
}

export function findPayments(deposits: Data[], payments: Data[]) {
  try {
    const results: Result[] = []
    const usedDeposits = new Set<string>()

    for (const payment of payments) {
      const result = getDeposits(payment, deposits, usedDeposits)

      if (result) {
        results.push(result)
      }
    }

    return results
  } catch (err) {
    console.trace(err)

    Sentry.captureException(err)

    throw err
  }
}

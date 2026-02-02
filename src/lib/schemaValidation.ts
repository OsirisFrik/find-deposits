import z from 'zod'

z.config(z.locales.es())

export const dataSchema = z.array(
  z.object({
    date: z.string().regex(/^\d{1,2}\/\d{2}\/\d{4}$/),
    amount: z.number().min(0)
  })
)

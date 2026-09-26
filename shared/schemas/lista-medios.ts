import { z } from 'zod'

export default {
  crear: z.object({
    medio: z.string().min(1),
    detalles: z.string().optional()
  }),
  actualizar: z.object({
    medio: z.string().min(1),
    detalles: z.string().optional()
  })
}

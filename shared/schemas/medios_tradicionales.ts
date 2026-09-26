import { z } from 'zod'

export default {
  impresos: z.object({
    medio: z.string().min(1),
    tipo_medio: z.string().min(1),
    detalle: z.string().optional(),
    fecha: z.string().min(1)
  }),
  tvRadio: z.object({
    tipo_medio: z.string().min(1),
    medio_programa: z.string().min(1),
    detalle: z.string().optional(),
    fecha_emision: z.string().min(1),
    texto: z.string().optional()
  })
}

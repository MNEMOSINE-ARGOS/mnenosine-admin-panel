import { z } from 'zod'

export default {
  generar: z.object({
    tipo: z.enum(['movil', 'escritorio']),
    tipo_reporte: z.enum(['Finanzas Saltillo', 'Finanzas Laguna', 'Político Saltillo', 'Político Laguna']),
    prompt: z.string().optional()
  })
}

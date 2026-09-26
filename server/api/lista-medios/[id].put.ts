import { Prisma } from '~~/app/generated/prisma/client'

export default defineEventHandler(async (event) => {
  const z = useZod()
  const { params, body } = await event.validate({
    params: z.object({ id: z.coerce.number().int() }),
    body: useZodSchemas().listaMedios.actualizar
  })

  try {
    return await prisma.lista_medios.update({
      where: { id: params.id },
      data: body
    })
  } catch (error) {
    if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === 'P2025') {
      throw createError({ statusCode: 404, statusMessage: 'Medio no encontrado' })
    }
    throw error
  }
})

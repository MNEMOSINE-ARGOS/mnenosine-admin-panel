import { Prisma } from '~~/app/generated/prisma/client'

export default defineEventHandler(async (event) => {
  const z = useZod()
  const { params } = await event.validate({ params: z.object({ id: z.coerce.number().int() }) })

  try {
    await prisma.lista_medios.delete({ where: { id: params.id } })
    setResponseStatus(event, 204)
    return null
  } catch (error) {
    if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === 'P2025') {
      throw createError({ statusCode: 404, statusMessage: 'Medio no encontrado' })
    }
    throw error
  }
})

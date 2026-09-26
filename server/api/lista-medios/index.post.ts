export default defineEventHandler(async (event) => {
  const { body } = await event.validate({ body: useZodSchemas().listaMedios.crear })

  const medio = await prisma.lista_medios.create({ data: body })
  setResponseStatus(event, 201)
  return medio
})

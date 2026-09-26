export default defineEventHandler(() => {
  return prisma.lista_medios.findMany({ orderBy: { medio: 'asc' } })
})

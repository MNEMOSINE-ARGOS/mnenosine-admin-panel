const WEBHOOK_URL = 'https://n8n.argos.org.mx/webhook/20b686df-5bb9-4e38-a8d8-b413c86568d5'

export default defineEventHandler(async (event) => {
  const { body } = await event.validate({ body: useZodSchemas().reportesTematicos.generar })

  let respuesta: Response
  try {
    respuesta = await fetch(WEBHOOK_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body)
    })
  } catch (error) {
    console.error('[reportes-tematicos/generar] error de red al llamar al webhook de n8n', error)
    throw createError({ statusCode: 502, statusMessage: 'No se pudo generar el reporte, intenta de nuevo' })
  }

  if (!respuesta.ok) {
    const cuerpo = await respuesta.text().catch(() => '')
    console.error(`[reportes-tematicos/generar] el webhook de n8n respondió ${respuesta.status}: ${cuerpo}`)
    throw createError({
      statusCode: 502,
      statusMessage: 'No se pudo generar el reporte, intenta de nuevo',
      data: { n8nStatus: respuesta.status, n8nBody: cuerpo }
    })
  }

  setResponseHeaders(event, {
    'Content-Type': 'application/pdf',
    'Content-Disposition': `attachment; filename="reporte_tematico_${Date.now()}.pdf"`
  })

  return Buffer.from(await respuesta.arrayBuffer())
})

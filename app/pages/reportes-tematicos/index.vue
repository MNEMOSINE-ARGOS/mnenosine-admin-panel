<template>
  <div class="mx-auto max-w-3xl space-y-6 p-4 sm:space-y-8 sm:p-6 lg:p-8">
    <TitulosPages
      titulo="Reportes Temáticos"
      subtitulo="Genera reportes en PDF por tema y zona"
      icon="i-lucide-file-chart-column"
      icon-class="text-cyan-600 dark:text-cyan-400"
    />

    <div class="overflow-hidden rounded-3xl border border-default bg-default/60 shadow-sm">
      <form class="divide-y divide-default" @submit.prevent="generar">
        <section class="space-y-4 p-5 sm:p-6">
          <PasoEncabezado
            numero="1"
            titulo="Dispositivo"
            descripcion="¿Para qué formato se generará el PDF?"
          />

          <div class="grid grid-cols-2 gap-3 sm:gap-4">
            <button
              v-for="opcion in DISPOSITIVOS"
              :key="opcion.value"
              type="button"
              class="group relative flex flex-col items-center gap-2 rounded-2xl border-2 p-5 text-center transition-all duration-200 hover:-translate-y-0.5"
              :class="state.tipo === opcion.value
                ? 'border-cyan-600 bg-cyan-50/60 shadow-md shadow-cyan-600/10 dark:bg-cyan-500/5'
                : 'border-default bg-default hover:border-cyan-600/30 hover:shadow-sm'"
              @click="state.tipo = opcion.value"
            >
              <UIcon
                v-if="state.tipo === opcion.value"
                name="i-lucide-circle-check"
                class="absolute right-3 top-3 size-5 text-cyan-600 dark:text-cyan-400"
              />
              <div
                class="flex size-12 items-center justify-center rounded-full transition-colors"
                :class="state.tipo === opcion.value ? 'bg-cyan-600 text-white' : 'bg-muted text-muted group-hover:text-cyan-600 dark:group-hover:text-cyan-400'"
              >
                <UIcon :name="opcion.icon" class="size-6" />
              </div>
              <p class="font-semibold">
                {{ opcion.label }}
              </p>
              <p class="text-xs text-muted">
                {{ opcion.desc }}
              </p>
            </button>
          </div>
        </section>

        <section class="space-y-4 p-5 sm:p-6">
          <PasoEncabezado
            numero="2"
            titulo="Tipo de reporte"
            descripcion="Elige la categoría y la zona a reportar"
          />

          <USelect
            v-model="state.tipo_reporte"
            :items="TIPOS_REPORTE"
            icon="i-lucide-file-chart-column"
            size="xl"
            placeholder="Selecciona el tipo de reporte"
            class="w-full"
            :ui="{
              base: 'rounded-2xl border-2 border-default bg-default px-4 py-4 hover:border-cyan-600/30 transition-colors',
              value: 'font-semibold',
              leadingIcon: 'text-cyan-600 dark:text-cyan-400'
            }"
          />
        </section>

        <section class="space-y-4 p-5 sm:p-6">
          <PasoEncabezado
            numero="3"
            titulo="Instrucciones"
            etiqueta="Opcional"
            descripcion="Dale contexto extra a la generación del reporte"
          />

          <UTextarea
            v-model="state.prompt"
            :rows="4"
            class="w-full"
            :ui="{ base: 'rounded-2xl' }"
            placeholder="Ej. Enfatiza los temas de seguridad y economía de la última semana..."
          />
        </section>

        <div class="flex flex-col-reverse items-stretch gap-3 p-5 sm:flex-row sm:items-center sm:justify-between sm:p-6">
          <p class="text-xs text-muted">
            La generación puede tardar varios minutos; no cierres esta pestaña.
          </p>
          <UButton
            type="submit"
            label="Generar reporte"
            icon="i-lucide-file-down"
            trailing-icon="i-lucide-arrow-right"
            size="xl"
            class="justify-center bg-cyan-600 hover:bg-cyan-700 sm:w-auto"
            :loading="generando"
            :disabled="!puedeGenerar"
          />
        </div>
      </form>
    </div>
  </div>
</template>

<script lang="ts" setup>
type Dispositivo = 'movil' | 'escritorio'

const DISPOSITIVOS: { value: Dispositivo, label: string, desc: string, icon: string }[] = [
  { value: 'movil', label: 'Móvil', desc: 'Para WhatsApp y pantallas pequeñas', icon: 'i-lucide-smartphone' },
  { value: 'escritorio', label: 'Escritorio', desc: 'Formato completo para correo o impresión', icon: 'i-lucide-monitor' }
]

const TIPOS_REPORTE = ['Finanzas Saltillo', 'Finanzas Laguna', 'Político Saltillo', 'Político Laguna']

const toast = useToast()

const state = reactive<{
  tipo?: Dispositivo
  tipo_reporte?: string
  prompt?: string
}>({
  tipo: undefined,
  tipo_reporte: undefined,
  prompt: undefined
})

const generando = ref(false)
const puedeGenerar = computed(() => !!state.tipo && !!state.tipo_reporte)

async function generar() {
  if (!puedeGenerar.value) {
    toast.add({ title: 'Selecciona el dispositivo y el tipo de reporte', color: 'warning' })
    return
  }

  generando.value = true

  try {
    const blob = await $fetch<Blob>('/api/reportes-tematicos/generar', {
      method: 'POST',
      body: state,
      responseType: 'blob'
    })

    const url = URL.createObjectURL(blob)
    const enlace = document.createElement('a')
    enlace.href = url
    enlace.download = `reporte_${state.tipo_reporte!.replaceAll(' ', '_')}.pdf`
    enlace.click()
    URL.revokeObjectURL(url)

    toast.add({ title: 'Reporte generado', color: 'success' })
  } catch (error: any) {
    const detalleN8n = error?.data?.data?.n8nBody
    toast.add({
      title: error?.statusMessage ?? 'No se pudo generar el reporte',
      description: detalleN8n ? `n8n (${error.data.data.n8nStatus}): ${detalleN8n}` : undefined,
      color: 'error'
    })
  } finally {
    generando.value = false
  }
}
</script>

<template>
  <div class="space-y-4">
    <UInput
      v-model="busqueda"
      icon="i-lucide-search"
      placeholder="Buscar por cliente prospecto..."
      class="w-full sm:w-90"
    />

    <SeccionColapsable
      titulo="Reportes automáticos activados"
      icon="i-lucide-send"
      icon-class="size-6 text-green-50"
      header-class="bg-emerald-700 text-white"
      class="mt-5"

      floating
      default-open
    >
      <p class="mb-4 text-sm text-muted">
        Estos reportes están activos para envíos automáticos de correo y WhatsApp.
      </p>

      <TablaReportePdfBase
        :filas="automaticos"
        :loading="status === 'pending'"
        @editar="reporte => emit('editar', reporte)"
        @eliminado="refresh"
      />
    </SeccionColapsable>

    <SeccionColapsable
      titulo="Tabla general de actores y reportes"
      icon="i-lucide-table"
      icon-class="size-6 text-blue-50"
      header-class="bg-mist-800 text-white"
      class="mt-10"
      floating
      default-open
    >
      <TablaReportePdfBase
        :filas="generales"
        :loading="status === 'pending'"
        @editar="reporte => emit('editar', reporte)"
        @eliminado="refresh"
      />
    </SeccionColapsable>
  </div>
</template>

<script lang="ts" setup>
interface ReportePdf {
  id: number
  cliente_propsecto: string
  descripcion: string | null
  nombre_actor: string
  instruccion_reporte: string | null
  tipo_reporte: string | null
  caducidad: string | null
  correo: string | null
  whatsapp: string | number | null
  activo: boolean | null
}

const emit = defineEmits<{
  editar: [reporte: ReportePdf]
}>()

const { data, refresh, status } = useFetch<ReportePdf[]>('/api/reporte_pdf')

const busqueda = ref('')

function esAutomatico(reporte: ReportePdf) {
  return !!reporte.tipo_reporte?.toLowerCase().includes('aut-') && !!reporte.activo
}

function ordenAlfabetico(a: ReportePdf, b: ReportePdf) {
  return a.cliente_propsecto.localeCompare(b.cliente_propsecto, 'es', { sensitivity: 'base' })
}

const filtrados = computed(() => {
  const busquedaNormalizada = busqueda.value.trim().toLowerCase()
  const filas = data.value ?? []

  if (!busquedaNormalizada) return filas

  return filas.filter(reporte => reporte.cliente_propsecto.toLowerCase().includes(busquedaNormalizada))
})

const automaticos = computed(() => filtrados.value.filter(esAutomatico).sort(ordenAlfabetico))
const generales = computed(() => filtrados.value.filter(reporte => !esAutomatico(reporte)).sort(ordenAlfabetico))

defineExpose({ refresh })
</script>

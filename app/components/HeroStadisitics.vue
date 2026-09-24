<template>
  <div class="space-y-6">
    <a
      href="https://monitoreomedios.vercel.app/"
      target="_blank"
      rel="noopener noreferrer"
      class="block transition-transform hover:-translate-y-0.5"
    >
      <UCard
        variant="outline"
        :ui="{ root: 'shadow-lg hover:shadow-xl transition-shadow bg-white dark:bg-gray-900', body: 'flex flex-col gap-4 py-6 sm:flex-row sm:items-center sm:justify-between' }"
      >
        <div class="flex items-center gap-4">
          <div class="flex size-14 shrink-0 items-center justify-center rounded-full bg-slate-100 text-slate-700 dark:bg-slate-500/10 dark:text-slate-300">
            <UIcon name="i-lucide-radar" class="size-7" />
          </div>
          <div>
            <p class="text-lg font-bold text-highlighted">
              Monitoreo de Medios en vivo
            </p>
            <p class="text-sm text-muted">
              monitoreomedios.vercel.app — el sitio actual de monitoreo de ARGOS
            </p>
          </div>
        </div>

        <UButton
          label="Abrir sitio de monitoreo"
          icon="i-lucide-external-link"
          trailing
          size="lg"
          class="w-full justify-center bg-slate-700 hover:bg-slate-800 sm:w-auto"
        />
      </UCard>
    </a>

    <div class="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-5">
      <NuxtLink
        v-for="tarjeta in tarjetas"
        :key="tarjeta.href"
        :to="tarjeta.href"
        class="flex flex-col items-center gap-2 text-center transition-transform hover:-translate-y-0.5"
      >
        <div
          class="flex size-28 flex-col items-center justify-center gap-1 rounded-full bg-muted"
          :class="CLASES_COLOR[tarjeta.color]"
        >
          <UIcon :name="tarjeta.icon" class="size-6" />
          <span class="text-xl font-bold">{{ tarjeta.valor }}</span>
        </div>
        <span class="text-sm text-muted">{{ tarjeta.label }}</span>
      </NuxtLink>
    </div>

    <UCard variant="subtle">
      <template #header>
        <h3 class="font-semibold">
          Reportes automáticos activados
        </h3>
      </template>

      <UTable
        :data="reportesAutomaticos"
        :columns="columnasReportes"
        :loading="statusReportes === 'pending'"
        :ui="{ th: 'px-3 py-2', td: 'px-3 py-2' }"
      >
        <template #tipo_reporte-cell="{ row }">
          <UBadge color="success" variant="subtle">
            {{ row.original.tipo_reporte }}
          </UBadge>
        </template>
      </UTable>
    </UCard>
  </div>
</template>

<script lang="ts" setup>
import type { TableColumn } from '@nuxt/ui'

interface Institucion {
  activa: boolean | null
}

interface Actor {
  activo: boolean | null
}

interface Tema {
  activo: boolean | null
}

interface ReportePdf {
  id: number
  cliente_propsecto: string
  nombre_actor: string
  tipo_reporte: string | null
  correo: string | null
  whatsapp: string | number | null
  caducidad: string | null
  activo: boolean | null
}

interface PaginaFacebook {
  id: number
}

// clases completas y literales a propósito: Tailwind no genera CSS para nombres de clase armados
// dinámicamente con interpolación (ej. `text-${color}`), solo detecta strings completos en el código.
// El fondo del círculo es el mismo (bg-muted) para todas las tarjetas; solo el color de ícono/número cambia.
const CLASES_COLOR: Record<string, string> = {
  actores: 'text-pink-700 dark:text-pink-400',
  instituciones: 'text-amber-600 dark:text-amber-400',
  temas: 'text-teal-700 dark:text-teal-400',
  reportes: 'text-emerald-700 dark:text-emerald-400',
  facebook: 'text-[#1877F2]'
}

const { data: instituciones } = useFetch<Institucion[]>('/api/instituciones')
const { data: actores } = useFetch<Actor[]>('/api/actores')
const { data: temas } = useFetch<Tema[]>('/api/temas')
const { data: reportesPdf, status: statusReportes } = useFetch<ReportePdf[]>('/api/reporte_pdf')
const { data: paginasFacebook } = useFetch<PaginaFacebook[]>('/api/fb_cuentas')

function esReporteAutomatico(reporte: ReportePdf) {
  return !!reporte.tipo_reporte?.toLowerCase().includes('aut-') && !!reporte.activo
}

const reportesAutomaticos = computed(() => (reportesPdf.value ?? []).filter(esReporteAutomatico))

const columnasReportes: TableColumn<ReportePdf>[] = [
  { accessorKey: 'cliente_propsecto', header: 'Cliente prospecto' },
  { accessorKey: 'nombre_actor', header: 'Nombre del actor' },
  { accessorKey: 'tipo_reporte', header: 'Tipo de reporte' },
  { accessorKey: 'correo', header: 'Correo' },
  { accessorKey: 'whatsapp', header: 'WhatsApp' },
  { accessorKey: 'caducidad', header: 'Caducidad' }
]

const tarjetas = computed(() => [
  {
    href: '/actores',
    icon: 'i-lucide-users',
    color: 'actores',
    label: 'Actores activos',
    valor: (actores.value ?? []).filter(a => a.activo).length
  },
  {
    href: '/instituciones',
    icon: 'i-lucide-landmark',
    color: 'instituciones',
    label: 'Instituciones activas',
    valor: (instituciones.value ?? []).filter(i => i.activa).length
  },
  {
    href: '/temas',
    icon: 'i-lucide-tag',
    color: 'temas',
    label: 'Temas activos',
    valor: (temas.value ?? []).filter(t => t.activo).length
  },
  {
    href: '/reporte_pdf',
    icon: 'i-lucide-send',
    color: 'reportes',
    label: 'Reportes automáticos activados',
    valor: reportesAutomaticos.value.length
  },
  {
    href: '/social-media',
    icon: 'i-simple-icons-facebook',
    color: 'facebook',
    label: 'Páginas de Facebook monitoreadas',
    valor: (paginasFacebook.value ?? []).length
  }
])
</script>

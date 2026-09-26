<template>
  <div class="space-y-3">
    <div class="flex flex-wrap gap-3">
      <USelect
        v-model="filtroNivel"
        :items="opcionesNivel"
        placeholder="Nivel"
        class="w-48"
      />

      <USelect
        v-model="filtroEstado"
        :items="opcionesEstado"
        placeholder="Estado"
        class="w-40"
      />

      <USelect
        v-model="filtroMunicipio"
        :items="opcionesMunicipio"
        placeholder="Municipio"
        class="w-40"
      />

      <UButton
        v-if="hayFiltrosActivos"
        label="Limpiar filtros"
        color="neutral"
        variant="ghost"
        @click="limpiarFiltros"
      />
    </div>

    <UTable
      v-model:sorting="sorting"
      :data="filtrados"
      :columns="columns"
      :loading="status === 'pending'"
      :ui="{ th: 'px-3 py-2', td: 'px-3 py-2' }"
    >
      <template #activa-cell="{ row }">
        <UBadge
          :color="row.original.activa ? 'success' : 'neutral'"
          variant="subtle"
        >
          {{ row.original.activa ? 'Activa' : 'Inactiva' }}
        </UBadge>
      </template>

      <template #acciones-cell="{ row }">
        <UButton
          icon="i-lucide-pencil"
          size="xs"
          color="neutral"
          variant="ghost"
          aria-label="Editar institución"
          @click="emit('editar', row.original)"
        />
      </template>
    </UTable>
  </div>
</template>

<script lang="ts" setup>
import { h, resolveComponent } from 'vue'
import type { TableColumn } from '@nuxt/ui'
import type { SortingState } from '@tanstack/vue-table'

interface Institucion {
  id: number
  nombre: string
  nivel: string
  estado: string | null
  municipio: string | null
  activa: boolean | null
}

const emit = defineEmits<{
  editar: [institucion: Institucion]
}>()

const { data, refresh, status } = useFetch<Institucion[]>('/api/instituciones')

const sorting = ref<SortingState>([{ id: 'nombre', desc: false }])

function encabezadoOrdenable(etiqueta: string) {
  return ({ column }: { column: any }) => {
    const orden = column.getIsSorted()
    return h(resolveComponent('UButton'), {
      label: etiqueta,
      color: 'neutral',
      variant: 'ghost',
      class: '-mx-2.5 px-2.5',
      icon: orden === 'asc' ? 'i-lucide-arrow-up' : orden === 'desc' ? 'i-lucide-arrow-down' : 'i-lucide-arrow-up-down',
      onClick: () => column.toggleSorting(orden === 'asc')
    })
  }
}

const filtroNivel = ref<string>()
const filtroEstado = ref<string>()
const filtroMunicipio = ref<string>()

const opcionesNivel = computed(() => {
  const niveles = new Set((data.value ?? []).map(i => i.nivel))
  return [...niveles].sort()
})

const opcionesEstado = computed(() => {
  const estados = new Set((data.value ?? []).map(i => i.estado).filter((e): e is string => !!e))
  return [...estados].sort()
})

const opcionesMunicipio = computed(() => {
  const municipios = new Set((data.value ?? []).map(i => i.municipio).filter((m): m is string => !!m))
  return [...municipios].sort()
})

const hayFiltrosActivos = computed(() =>
  !!filtroNivel.value || !!filtroEstado.value || !!filtroMunicipio.value
)

function limpiarFiltros() {
  filtroNivel.value = undefined
  filtroEstado.value = undefined
  filtroMunicipio.value = undefined
}

const filtrados = computed(() => {
  return (data.value ?? []).filter((institucion) => {
    if (filtroNivel.value && institucion.nivel !== filtroNivel.value) return false
    if (filtroEstado.value && institucion.estado !== filtroEstado.value) return false
    if (filtroMunicipio.value && institucion.municipio !== filtroMunicipio.value) return false
    return true
  })
})

const columns: TableColumn<Institucion>[] = [
  { id: 'acciones', header: '' },
  { accessorKey: 'activa', header: encabezadoOrdenable('Activa') },
  { accessorKey: 'nombre', header: encabezadoOrdenable('Nombre') },
  { accessorKey: 'nivel', header: encabezadoOrdenable('Nivel') },
  { accessorKey: 'estado', header: encabezadoOrdenable('Estado') },
  { accessorKey: 'municipio', header: encabezadoOrdenable('Municipio') }
]

defineExpose({ refresh })
</script>

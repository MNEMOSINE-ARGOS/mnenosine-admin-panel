<template>
  <UTable
    :data="data ?? []"
    :columns="columns"
    :loading="status === 'pending'"
    :ui="{ th: 'px-3 py-2', td: 'px-3 py-2' }"
  >
    <template #created_at-cell="{ row }">
      {{ new Date(row.original.created_at).toLocaleDateString('es-MX') }}
    </template>

    <template #acciones-cell="{ row }">
      <UButton
        icon="i-lucide-pencil"
        size="xs"
        color="neutral"
        variant="ghost"
        aria-label="Editar medio"
        @click="emit('editar', row.original)"
      />
    </template>
  </UTable>
</template>

<script lang="ts" setup>
import type { TableColumn } from '@nuxt/ui'

interface Medio {
  id: number
  medio: string
  detalles: string | null
  created_at: string
}

const emit = defineEmits<{
  editar: [medio: Medio]
}>()

const { data, refresh, status } = useFetch<Medio[]>('/api/lista-medios')

const columns: TableColumn<Medio>[] = [
  { id: 'acciones', header: '' },
  { accessorKey: 'medio', header: 'Medio' },
  { accessorKey: 'detalles', header: 'Detalle' },
  { accessorKey: 'created_at', header: 'Creado' }
]

defineExpose({ refresh, data })
</script>

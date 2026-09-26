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
      <div class="flex gap-1">
        <UButton
          icon="i-lucide-pencil"
          size="xs"
          color="neutral"
          variant="ghost"
          aria-label="Editar medio"
          @click="emit('editar', row.original)"
        />
        <UButton
          icon="i-lucide-trash-2"
          size="xs"
          color="error"
          variant="ghost"
          aria-label="Eliminar medio"
          :loading="borrandoId === row.original.id"
          @click="confirmarBorrado(row.original)"
        />
      </div>
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

const toast = useToast()
const borrandoId = ref<number | null>(null)

const { data, refresh, status } = useFetch<Medio[]>('/api/lista-medios')

const columns: TableColumn<Medio>[] = [
  { id: 'acciones', header: '' },
  { accessorKey: 'medio', header: 'Medio' },
  { accessorKey: 'detalles', header: 'Detalle' },
  { accessorKey: 'created_at', header: 'Creado' }
]

function confirmarBorrado(medio: Medio) {
  // eslint-disable-next-line no-alert
  if (!confirm(`¿Eliminar el medio "${medio.medio}"? Esta acción no se puede deshacer.`)) return
  borrar(medio)
}

async function borrar(medio: Medio) {
  borrandoId.value = medio.id

  try {
    await $fetch(`/api/lista-medios/${medio.id}`, { method: 'DELETE' })
    toast.add({ title: 'Medio eliminado', color: 'success' })
    await refresh()
  } catch {
    toast.add({ title: 'No se pudo eliminar el medio, intenta de nuevo', color: 'error' })
  } finally {
    borrandoId.value = null
  }
}

defineExpose({ refresh, data })
</script>

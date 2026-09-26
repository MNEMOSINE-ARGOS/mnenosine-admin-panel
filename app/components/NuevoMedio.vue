<template>
  <UModal
    v-model:open="open"
    :title="esEdicion ? 'Editar medio' : 'Agregar medio'"
  >
    <template #body>
      <UForm
        ref="formRef"
        :schema="schema"
        :state="state"
        class="space-y-4"
        @submit="onSubmit"
      >
        <UFormField label="Medio" name="medio" required>
          <UInput v-model="state.medio" class="w-full" />
        </UFormField>

        <UFormField label="Detalle" name="detalles">
          <UTextarea v-model="state.detalles" :rows="3" class="w-full" />
        </UFormField>

        <div class="flex justify-end gap-2">
          <UButton label="Cancelar" color="neutral" variant="ghost" @click="open = false" />
          <UButton label="Guardar" type="submit" :loading="guardando" />
        </div>
      </UForm>
    </template>
  </UModal>
</template>

<script lang="ts" setup>
import type { FormSubmitEvent } from '@nuxt/ui'

interface Medio {
  id: number
  medio: string
  detalles: string | null
}

const props = defineProps<{
  medio?: Medio | null
}>()

const emit = defineEmits<{
  guardado: []
}>()

const open = defineModel<boolean>('open', { default: false })

const esEdicion = computed(() => !!props.medio)
const schema = computed(() => esEdicion.value ? useZodSchemas().listaMedios.actualizar : useZodSchemas().listaMedios.crear)

const state = reactive<{
  medio?: string
  detalles?: string
}>({})

const formRef = ref()
const guardando = ref(false)

watch(open, (isOpen) => {
  if (!isOpen) return

  if (props.medio) {
    state.medio = props.medio.medio
    state.detalles = props.medio.detalles ?? undefined
  } else {
    state.medio = undefined
    state.detalles = undefined
  }
}, { immediate: true })

async function onSubmit(event: FormSubmitEvent<any>) {
  guardando.value = true

  try {
    if (esEdicion.value && props.medio) {
      await $fetch(`/api/lista-medios/${props.medio.id}`, { method: 'PUT', body: event.data })
    } else {
      await $fetch('/api/lista-medios', { method: 'POST', body: event.data })
    }

    open.value = false
    emit('guardado')
  } catch (error: any) {
    formRef.value?.setErrors([{ name: 'medio', message: error?.statusMessage ?? 'No se pudo guardar el medio' }])
  } finally {
    guardando.value = false
  }
}
</script>

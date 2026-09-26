<template>
  <div class="p-4 sm:p-6 lg:p-8 space-y-4">
    <TitulosPages
      titulo="Medios Tradicionales"
      subtitulo="Captura de medios impresos, TV y radio"
      icon="i-lucide-newspaper"
    />

    <SeccionColapsable titulo="Medios impresos" icon="i-lucide-newspaper" icon-class="size-6 text-gray-700 dark:text-gray-300" default-open>
      <UForm
        ref="formImpresosRef"
        :schema="schemaImpresos"
        :state="stateImpresos"
        class="space-y-4"
        @submit="enviarImpresos"
      >
        <UFormField label="Medio" name="medio" required>
          <USelectMenu
            v-model="stateImpresos.medio"
            :items="opcionesMedios"
            value-key="value"
            placeholder="Selecciona un medio"
            class="w-full"
          />
        </UFormField>

        <UFormField label="Tipo de medio" required>
          <USelect v-model="tipoMedioImpresoSeleccion" :items="['Periódico', 'Impreso general', 'Revista', 'Libre']" class="w-full sm:w-64" />
        </UFormField>

        <UFormField v-if="tipoMedioImpresoSeleccion === 'Libre'" label="Especifica el tipo de medio" name="tipo_medio" required>
          <UInput v-model="tipoMedioImpresoLibre" placeholder="Ej. Suplemento, Boletín..." class="w-full sm:w-64" />
        </UFormField>

        <UFormField
          label="Detalle"
          name="detalle"
          description="En este campo puede dar instrucciones o datos de los reporteros o estructura del medio, impreso o programa del que trata, para poder entender el contexto en la carga de los datos."
        >
          <UTextarea v-model="stateImpresos.detalle" :rows="2" class="w-full" />
        </UFormField>

        <UFormField label="Fecha" name="fecha" required>
          <UInput v-model="stateImpresos.fecha" type="date" class="w-full sm:w-64" />
        </UFormField>

        <UFormField label="Archivos (PDF)">
          <UFileUpload
            v-model="archivosImpresos"
            multiple
            layout="list"
            :file-image="false"
            accept="application/pdf"
            size="sm"
            label="Arrastra tus PDFs aquí"
            description="O haz clic para seleccionarlos"
            class="w-full"
          />
        </UFormField>

        <div class="flex justify-end">
          <UButton label="Enviar" type="submit" :loading="enviandoImpresos" />
        </div>
      </UForm>
    </SeccionColapsable>

    <SeccionColapsable
      titulo="TV y Radio"
      icon="i-lucide-tv"
      icon-class="size-6 text-amber-700 dark:text-amber-400"
      icon-wrapper-class="bg-slate-200 dark:bg-slate-700 p-1.5"
      default-open
    >
      <UForm
        ref="formTvRadioRef"
        :schema="schemaTvRadio"
        :state="stateTvRadio"
        class="space-y-4"
        @submit="enviarTvRadio"
      >
        <UFormField label="Tipo de medio" required>
          <USelect v-model="tipoMedioSeleccion" :items="['TV', 'Radio', 'Impreso', 'Libre']" class="w-full sm:w-48" />
        </UFormField>

        <UFormField v-if="tipoMedioSeleccion === 'Libre'" label="Especifica el tipo de medio" name="tipo_medio" required>
          <UInput v-model="tipoMedioLibre" placeholder="Ej. Podcast, Streaming..." class="w-full sm:w-64" />
        </UFormField>

        <UFormField label="Medio o programa" name="medio_programa" required>
          <USelectMenu
            v-model="stateTvRadio.medio_programa"
            :items="opcionesMedios"
            value-key="value"
            placeholder="Selecciona un medio"
            class="w-full"
          />
        </UFormField>

        <UFormField
          label="Detalle"
          name="detalle"
          description="En este campo puede dar instrucciones o datos de los reporteros o estructura del medio, impreso o programa del que trata, para poder entender el contexto en la carga de los datos."
        >
          <UTextarea v-model="stateTvRadio.detalle" :rows="2" class="w-full" />
        </UFormField>

        <UFormField label="Fecha de emisión" name="fecha_emision" required>
          <UInput v-model="stateTvRadio.fecha_emision" type="date" class="w-full sm:w-64" />
        </UFormField>

        <UFormField label="Archivo de texto (opcional)">
          <UFileUpload
            v-model="archivoTexto"
            accept=".txt,text/plain"
            label="Arrastra un .txt aquí"
            description="Su contenido llenará el texto de abajo"
            class="w-full"
            @change="cargarArchivoTexto"
          />
        </UFormField>

        <UFormField label="Texto" name="texto">
          <UTextarea v-model="stateTvRadio.texto" :rows="8" class="w-full" />
        </UFormField>

        <div class="flex justify-end">
          <UButton label="Enviar" type="submit" :loading="enviandoTvRadio" />
        </div>
      </UForm>
    </SeccionColapsable>

    <SeccionColapsable titulo="Lista de medios" icon="i-lucide-list">
      <div class="space-y-4">
        <div class="flex justify-end">
          <UButton
            label="Agregar medio"
            icon="i-lucide-plus"
            @click="medioEnEdicion = null; modalMedioAbierto = true"
          />
        </div>

        <TablaListaMedios ref="tablaListaMediosRef" @editar="medioEnEdicion = $event; modalMedioAbierto = true" />
      </div>
    </SeccionColapsable>

    <NuevoMedio
      v-model:open="modalMedioAbierto"
      :medio="medioEnEdicion"
      @guardado="refrescarCatalogo(); tablaListaMediosRef?.refresh()"
    />
  </div>
</template>

<script lang="ts" setup>
import type { FormSubmitEvent } from '@nuxt/ui'

interface Medio {
  id: number
  medio: string
  detalles: string | null
  created_at: string
}

function hoy() {
  return new Date().toISOString().slice(0, 10)
}

const toast = useToast()

const { data: catalogoMedios, refresh: refrescarCatalogo } = useFetch<Medio[]>('/api/lista-medios')

const opcionesMedios = computed(() => {
  return (catalogoMedios.value ?? []).map(m => ({ label: m.medio, value: m.medio }))
})

const catalogoDetalles = computed(() => {
  return new Map((catalogoMedios.value ?? []).map(m => [m.medio, m.detalles ?? '']))
})

const modalMedioAbierto = ref(false)
const medioEnEdicion = ref<Medio | null>(null)
const tablaListaMediosRef = ref()

const schemaImpresos = useZodSchemas().mediosTradicionales.impresos
const stateImpresos = reactive<{ medio?: string, tipo_medio?: string, detalle?: string, fecha: string }>({
  medio: undefined,
  tipo_medio: undefined,
  detalle: undefined,
  fecha: hoy()
})
const archivosImpresos = ref<File[]>([])
const enviandoImpresos = ref(false)
const formImpresosRef = ref()

const tipoMedioImpresoSeleccion = ref<'Periódico' | 'Impreso general' | 'Revista' | 'Libre' | undefined>(undefined)
const tipoMedioImpresoLibre = ref<string | undefined>(undefined)

watch(tipoMedioImpresoSeleccion, (seleccion) => {
  if (seleccion !== 'Libre') {
    tipoMedioImpresoLibre.value = undefined
  }
})

watch([tipoMedioImpresoSeleccion, tipoMedioImpresoLibre], ([seleccion, libre]) => {
  stateImpresos.tipo_medio = seleccion === 'Libre' ? libre : seleccion
})

watch(() => stateImpresos.medio, (medio) => {
  stateImpresos.detalle = medio ? catalogoDetalles.value.get(medio) ?? '' : undefined
})

async function enviarImpresos(event: FormSubmitEvent<any>) {
  if (archivosImpresos.value.length === 0) {
    toast.add({ title: 'Adjunta al menos un archivo', color: 'error' })
    return
  }

  enviandoImpresos.value = true

  try {
    const formData = new FormData()
    formData.append('medio', event.data.medio)
    formData.append('tipo_medio', event.data.tipo_medio)
    formData.append('detalle', event.data.detalle ?? '')
    formData.append('fecha', event.data.fecha)
    for (const archivo of archivosImpresos.value) {
      formData.append('archivos', archivo)
    }

    await $fetch('/api/medios-tradicionales/impresos', { method: 'POST', body: formData })

    toast.add({ title: 'Medio impreso enviado', color: 'success' })
    stateImpresos.medio = undefined
    tipoMedioImpresoSeleccion.value = undefined
    tipoMedioImpresoLibre.value = undefined
    stateImpresos.detalle = undefined
    stateImpresos.fecha = hoy()
    archivosImpresos.value = []
  } catch (error: any) {
    const detalleN8n = error?.data?.data?.n8nBody
    toast.add({
      title: error?.statusMessage ?? 'No se pudo enviar el medio impreso',
      description: detalleN8n ? `n8n (${error.data.data.n8nStatus}): ${detalleN8n}` : undefined,
      color: 'error'
    })
  } finally {
    enviandoImpresos.value = false
  }
}

const schemaTvRadio = useZodSchemas().mediosTradicionales.tvRadio
const stateTvRadio = reactive<{
  tipo_medio?: string
  medio_programa?: string
  detalle?: string
  fecha_emision: string
  texto?: string
}>({
  tipo_medio: undefined,
  medio_programa: undefined,
  detalle: undefined,
  fecha_emision: hoy(),
  texto: undefined
})
const archivoTexto = ref<File | null>(null)
const enviandoTvRadio = ref(false)
const formTvRadioRef = ref()

const tipoMedioSeleccion = ref<'TV' | 'Radio' | 'Impreso' | 'Libre' | undefined>(undefined)
const tipoMedioLibre = ref<string | undefined>(undefined)

watch(tipoMedioSeleccion, (seleccion) => {
  if (seleccion !== 'Libre') {
    tipoMedioLibre.value = undefined
  }
})

watch([tipoMedioSeleccion, tipoMedioLibre], ([seleccion, libre]) => {
  stateTvRadio.tipo_medio = seleccion === 'Libre' ? libre : seleccion
})

watch(() => stateTvRadio.medio_programa, (medio) => {
  stateTvRadio.detalle = medio ? catalogoDetalles.value.get(medio) ?? '' : undefined
})

function cargarArchivoTexto() {
  const archivo = archivoTexto.value
  if (!archivo) return

  const lector = new FileReader()
  lector.onload = () => {
    stateTvRadio.texto = String(lector.result ?? '')
  }
  lector.readAsText(archivo)
}

async function enviarTvRadio(event: FormSubmitEvent<any>) {
  enviandoTvRadio.value = true

  try {
    await $fetch('/api/medios-tradicionales/tv-radio', { method: 'POST', body: event.data })

    toast.add({ title: 'Registro enviado', color: 'success' })
    tipoMedioSeleccion.value = undefined
    tipoMedioLibre.value = undefined
    stateTvRadio.medio_programa = undefined
    stateTvRadio.detalle = undefined
    stateTvRadio.fecha_emision = hoy()
    stateTvRadio.texto = undefined
    archivoTexto.value = null
  } catch (error: any) {
    toast.add({ title: error?.statusMessage ?? 'No se pudo enviar el registro', color: 'error' })
  } finally {
    enviandoTvRadio.value = false
  }
}
</script>

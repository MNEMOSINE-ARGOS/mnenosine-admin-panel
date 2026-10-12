<template>
  <div class="flex items-center gap-3">
    <span class="flex size-8 shrink-0 items-center justify-center rounded-full bg-cyan-500/10 text-sm font-bold text-cyan-600 dark:text-cyan-400">
      {{ numero }}
    </span>
    <div>
      <p class="font-semibold text-highlighted">
        {{ titulo }}
        <span v-if="etiqueta" class="font-normal text-muted">({{ etiqueta }})</span>
      </p>
      <p v-if="descripcion" class="text-xs text-muted">
        {{ descripcion }}
      </p>
    </div>
  </div>
</template>

<script lang="ts" setup>
defineProps<{
  numero: string | number
  titulo: string
  etiqueta?: string
  descripcion?: string
}>()
</script>

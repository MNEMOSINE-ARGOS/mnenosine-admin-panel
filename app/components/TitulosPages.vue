<template>
  <div>
    <div class="flex items-center gap-2">
      <UIcon v-if="icon" :name="icon" class="size-6" :class="iconClass" />
      <h1 class="text-2xl font-bold">
        {{ titulo }}
      </h1>
    </div>
    <p v-if="subtitulo" class="text-muted">
      {{ subtitulo }}
    </p>
  </div>
</template>

<script lang="ts" setup>
withDefaults(defineProps<{
  titulo: string
  subtitulo?: string
  icon?: string
  iconClass?: string
}>(), { iconClass: 'text-primary' })
</script>

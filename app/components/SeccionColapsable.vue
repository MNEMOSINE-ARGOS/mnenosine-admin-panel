<template>
  <UCard
    variant="subtle"
    :ui="{ body: 'p-0 sm:p-0' }"
    :class="floating ? 'shadow-lg ring-1 ring-default/60 transition-shadow hover:shadow-xl' : undefined"
  >
    <UCollapsible v-model:open="abierto">
      <button
        type="button"
        class="flex w-full items-center justify-between gap-2 rounded-t-lg p-4 sm:p-6 text-left"
        :class="headerClass"
      >
        <div class="flex items-center gap-2">
          <div v-if="icon" class="flex items-center justify-center rounded-md" :class="iconWrapperClass">
            <UIcon :name="icon" :class="iconClass ?? 'size-5 text-primary'" />
          </div>
          <span class="font-semibold">{{ titulo }}</span>
        </div>
        <UIcon
          name="i-lucide-chevron-down"
          class="size-5 shrink-0 transition-transform duration-200"
          :class="{ 'rotate-180': abierto }"
        />
      </button>

      <template #content>
        <div class="border-t border-default p-4 sm:p-6">
          <slot />
        </div>
      </template>
    </UCollapsible>
  </UCard>
</template>

<script lang="ts" setup>
const props = withDefaults(defineProps<{
  titulo: string
  icon?: string
  iconClass?: string
  iconWrapperClass?: string
  headerClass?: string
  floating?: boolean
  defaultOpen?: boolean
}>(), { defaultOpen: false, floating: false })

const abierto = ref(props.defaultOpen)
</script>

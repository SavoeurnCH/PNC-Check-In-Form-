<script setup>
defineProps({
  variant: { type: String, default: 'error', validator: (v) => ['error', 'success', 'info'].includes(v) },
  message: { type: String, required: true },
  retryLabel: { type: String, default: '' },
})

defineEmits(['retry'])

const variants = {
  error: 'bg-red-50 text-red-700 border-red-200',
  success: 'bg-emerald-50 text-emerald-700 border-emerald-200',
  info: 'bg-brand-50 text-brand-700 border-brand-200',
}
</script>

<template>
  <div
    role="alert"
    class="flex items-center justify-between gap-3 rounded-lg border px-4 py-3 text-sm"
    :class="variants[variant]"
  >
    <span>{{ message }}</span>
    <button
      v-if="retryLabel"
      type="button"
      class="shrink-0 font-semibold underline underline-offset-2"
      @click="$emit('retry')"
    >
      {{ retryLabel }}
    </button>
  </div>
</template>

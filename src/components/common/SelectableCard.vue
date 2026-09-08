<script setup>
defineProps({
  labelKm: { type: String, required: true },
  labelEn: { type: String, required: true },
  selected: { type: Boolean, default: false },
})

defineEmits(['select'])
</script>

<template>
  <button
    type="button"
    class="flex min-h-[76px] w-full flex-col items-center justify-center gap-1 rounded-lg border px-2.5 py-3 text-center leading-snug transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-500"
    :class="
      selected
        ? 'border-brand-500 bg-brand-500 text-white'
        : 'border-gray-300 bg-white text-gray-800 hover:border-brand-300'
    "
    :aria-pressed="selected"
    @click="$emit('select')"
  >
    <span lang="km" class="text-xs">{{ labelKm }}</span>
    <span class="text-xs">{{ labelEn }}</span>
  </button>
</template>

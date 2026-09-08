<script setup>
defineProps({
  modelValue: { type: Boolean, default: false },
  label: { type: String, default: '' },
  ariaLabel: { type: String, default: '' },
})

defineEmits(['update:modelValue'])
</script>

<template>
  <label class="inline-flex cursor-pointer items-center gap-2 select-none">
    <input
      type="checkbox"
      class="sr-only"
      :checked="modelValue"
      :aria-label="ariaLabel || label || undefined"
      @change="$emit('update:modelValue', $event.target.checked)"
    />
    <span
      class="flex h-7 w-7 shrink-0 items-center justify-center rounded-md border-2 transition-colors"
      :class="modelValue ? 'border-white bg-white' : 'border-white/70 bg-white/10'"
      aria-hidden="true"
    >
      <svg
        v-if="modelValue"
        class="h-4 w-4 text-brand-600"
        viewBox="0 0 20 20"
        fill="currentColor"
      >
        <path
          fill-rule="evenodd"
          d="M16.704 5.29a1 1 0 010 1.415l-7.5 7.5a1 1 0 01-1.414 0l-3.5-3.5a1 1 0 111.414-1.414l2.793 2.792 6.793-6.793a1 1 0 011.414 0z"
          clip-rule="evenodd"
        />
      </svg>
    </span>
    <span v-if="label" class="text-sm">{{ label }}</span>
  </label>
</template>

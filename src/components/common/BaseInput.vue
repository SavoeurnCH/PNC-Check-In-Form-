<script setup>
import { computed, useId } from 'vue'

const props = defineProps({
  modelValue: { type: [String, Number], default: '' },
  labelKm: { type: String, default: '' },
  labelEn: { type: String, default: '' },
  placeholder: { type: String, default: '' },
  type: { type: String, default: 'text' },
  required: { type: Boolean, default: false },
  error: { type: String, default: '' },
})

defineEmits(['update:modelValue'])

const inputId = useId()
const describedBy = computed(() => (props.error ? `${inputId}-error` : undefined))
</script>

<template>
  <div>
    <label :for="inputId" class="mb-1.5 block text-sm text-gray-800">
      <span lang="km">{{ labelKm }}</span>
      <span v-if="labelKm && labelEn"> / </span>
      <span>{{ labelEn }}</span>
      <span v-if="required" class="text-red-500"> *</span>
    </label>
    <input
      :id="inputId"
      :type="type"
      :value="modelValue"
      :placeholder="placeholder"
      :required="required"
      :aria-invalid="Boolean(error)"
      :aria-describedby="describedBy"
      class="w-full rounded-lg border px-4 py-3 text-sm text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-brand-400"
      :class="error ? 'border-red-400' : 'border-gray-300'"
      @input="$emit('update:modelValue', $event.target.value)"
    />
    <p v-if="error" :id="`${inputId}-error`" class="mt-1 text-xs text-red-500">{{ error }}</p>
  </div>
</template>

<script setup>
import { onBeforeUnmount, onMounted, useId } from 'vue'

const props = defineProps({
  modelValue: { type: Boolean, required: true },
  titleId: { type: String, default: null },
})

const emit = defineEmits(['update:modelValue'])

const headingId = props.titleId ?? useId()

function close() {
  emit('update:modelValue', false)
}

function onKeydown(e) {
  if (e.key === 'Escape') close()
}

onMounted(() => document.addEventListener('keydown', onKeydown))
onBeforeUnmount(() => document.removeEventListener('keydown', onKeydown))
</script>

<template>
  <Teleport to="body">
    <div v-if="modelValue" class="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div class="absolute inset-0 bg-black/40" @click="close" />
      <div
        role="dialog"
        aria-modal="true"
        :aria-labelledby="headingId"
        class="relative w-full max-w-md rounded-2xl bg-white p-6 shadow-card"
      >
        <button
          type="button"
          class="absolute right-4 top-4 rounded-full p-1 text-gray-400 hover:bg-gray-100 hover:text-gray-600 focus-visible:outline focus-visible:outline-2 focus-visible:outline-brand-500"
          aria-label="Close"
          @click="close"
        >
          <svg class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
            <path
              d="M6.28 5.22a.75.75 0 00-1.06 1.06L8.94 10l-3.72 3.72a.75.75 0 101.06 1.06L10 11.06l3.72 3.72a.75.75 0 101.06-1.06L11.06 10l3.72-3.72a.75.75 0 00-1.06-1.06L10 8.94 6.28 5.22z"
            />
          </svg>
        </button>
        <slot :heading-id="headingId" />
      </div>
    </div>
  </Teleport>
</template>

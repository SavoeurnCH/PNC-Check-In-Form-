<script setup>
import { computed } from 'vue'

const props = defineProps({
  currentStep: { type: Number, required: true },
  total: { type: Number, default: 5 },
})

const steps = computed(() => Array.from({ length: props.total }, (_, i) => i + 1))
</script>

<template>
  <div class="flex flex-col items-center gap-2">
    <p class="text-xs text-gray-400">
      <span lang="km">ជំហាន</span> / Step
    </p>
    <ol class="flex items-center" aria-label="Progress">
      <li v-for="step in steps" :key="step" class="flex items-center">
        <span
          class="flex h-8 w-8 items-center justify-center rounded-full text-sm font-semibold transition-colors"
          :class="step <= currentStep ? 'bg-brand-500 text-white' : 'bg-gray-100 text-gray-400'"
          :aria-current="step === currentStep ? 'step' : undefined"
        >
          {{ step }}
        </span>
        <span
          v-if="step !== total"
          class="h-0.5 w-6 sm:w-9"
          :class="step < currentStep ? 'bg-brand-500' : 'bg-gray-200'"
          aria-hidden="true"
        />
      </li>
    </ol>
  </div>
</template>

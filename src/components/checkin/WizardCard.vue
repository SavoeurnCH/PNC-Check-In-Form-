<script setup>
import pnLogo from '@/assets/images/pn-logo.png'
import pssLogo from '@/assets/images/pss-logo.png'
import StepIndicator from './StepIndicator.vue'

defineProps({
  currentStep: { type: Number, required: true },
  totalSteps: { type: Number, default: 5 },
})
</script>

<template>
  <div class="w-full max-w-lg rounded-2xl bg-white p-6 shadow-card sm:p-8">
    <div class="flex items-center justify-center gap-3">
      <img :src="pnLogo" alt="Passerelles Numeriques logo" class="h-12 w-12 rounded-full" />
      <img :src="pssLogo" alt="PSS logo" class="h-13 w-13 rounded-full" />
    </div>

    <h1 class="mt-4 text-center text-xl font-bold text-gray-900 sm:text-2xl">
      <span lang="km">សូមស្វាគមន៍</span> - Welcome
    </h1>
    <p lang="km" class="mt-1 text-center text-sm text-gray-500">
      សូមបំពេញព័ត៌មានខាងក្រោមមុននឹងចូលបរិវេណអង្គការ
    </p>
    <p class="text-center text-sm text-gray-500">Please complete this form before entering campus.</p>

    <div class="mt-5">
      <StepIndicator :current-step="currentStep" :total="totalSteps" />
    </div>

    <div class="mt-5">
      <slot />
    </div>
  </div>
</template>

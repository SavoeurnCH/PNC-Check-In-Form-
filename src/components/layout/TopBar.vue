<script setup>
import { ref } from 'vue'

import HelpModal from '@/components/common/HelpModal.vue'

const isHelpOpen = ref(false)
</script>

<template>
  <header class="flex items-center justify-between px-6 py-6 sm:px-10">
    <div class="flex items-center gap-3">
      <span
        class="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-brand-500 shadow"
        aria-hidden="true"
      >
        <svg class="h-6 w-6 text-white" viewBox="0 0 24 24" fill="none">
          <path
            d="M12 3l7 3v5c0 4.5-3 8.5-7 10-4-1.5-7-5.5-7-10V6l7-3z"
            stroke="currentColor"
            stroke-width="1.6"
            stroke-linejoin="round"
          />
          <path
            d="M9 12l2 2 4-4.5"
            stroke="currentColor"
            stroke-width="1.6"
            stroke-linecap="round"
            stroke-linejoin="round"
          />
        </svg>
      </span>
      <div class="text-white">
        <p lang="km" class="text-sm font-medium leading-tight sm:text-base">
          ទម្រង់ចុះឈ្មោះភ្ញៀវមកទស្សនកិច្ចអង្គការ PNC - PSS
        </p>
        <p class="text-xs leading-tight text-white/90 sm:text-sm">PNC - PSS Visitor Check-In System</p>
      </div>
    </div>

    <button
      type="button"
      class="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-white/30 text-white backdrop-blur transition-colors hover:bg-white/40 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
      aria-label="Help"
      @click="isHelpOpen = true"
    >
      <svg class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
        <path
          fill-rule="evenodd"
          d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.94 6.94a1.5 1.5 0 112.36 1.62c-.36.31-.8.68-.8 1.44v.25a.75.75 0 01-1.5 0v-.25c0-1.14.66-1.68 1.13-2.08a.5.5 0 10-.83-.38.75.75 0 01-1.36-.63 2 2 0 011-1.97zM10 15a1 1 0 100-2 1 1 0 000 2z"
          clip-rule="evenodd"
        />
      </svg>
    </button>

    <HelpModal v-model="isHelpOpen" />
  </header>
</template>

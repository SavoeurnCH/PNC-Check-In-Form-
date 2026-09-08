<script setup>
import { computed } from 'vue'

import BaseCheckbox from '@/components/common/BaseCheckbox.vue'
import { TERMS_CARDS } from '@/constants/checkin.constants'

const props = defineProps({
  currentIndex: { type: Number, required: true },
  accepted: { type: Object, required: true },
})

defineEmits(['toggle'])

const card = computed(() => TERMS_CARDS[props.currentIndex])
</script>

<template>
  <div
    class="relative rounded-xl bg-gradient-to-br from-brand-700 to-brand-500 p-5 text-white shadow-lg"
  >
    <div class="absolute right-4 top-4">
      <BaseCheckbox
        :model-value="accepted[card.key]"
        :aria-label="`I agree: ${card.titleEn}`"
        @update:model-value="$emit('toggle', card.key)"
      />
    </div>

    <h3 class="pr-10 text-base font-bold leading-snug" lang="km">{{ card.titleKm }}</h3>
    <p class="pr-10 text-sm font-bold uppercase tracking-wide">{{ card.titleEn }}</p>

    <p lang="km" class="mt-3 text-sm leading-relaxed text-white/90">{{ card.bodyKm }}</p>
    <p class="mt-3 text-sm italic leading-relaxed text-white/90">{{ card.quoteEn }}</p>

    <div class="mt-4 flex items-center justify-center gap-1.5" aria-hidden="true">
      <span
        v-for="(dot, i) in TERMS_CARDS"
        :key="dot.key"
        class="h-2 w-2 rounded-full"
        :class="i <= currentIndex ? 'bg-accent-orange' : 'bg-brand-300'"
      />
    </div>
  </div>
</template>

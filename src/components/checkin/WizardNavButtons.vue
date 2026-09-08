<script setup>
import BaseButton from '@/components/common/BaseButton.vue'

defineProps({
  showBack: { type: Boolean, default: true },
  nextDisabled: { type: Boolean, default: false },
  nextLoading: { type: Boolean, default: false },
  nextLabel: { type: String, default: 'បន្ទាប់/Next' },
  backLabel: { type: String, default: 'ត្រឡប់ក្រោយ/Back' },
})

defineEmits(['back', 'next'])
</script>

<template>
  <div class="mt-6 flex items-center justify-between gap-3">
    <BaseButton v-if="showBack" variant="secondary" @click="$emit('back')">
      <svg class="h-4 w-4" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
        <path
          fill-rule="evenodd"
          d="M12.79 5.23a.75.75 0 010 1.06L9.06 10l3.73 3.71a.75.75 0 11-1.06 1.06l-4.25-4.25a.75.75 0 010-1.06l4.25-4.25a.75.75 0 011.06 0z"
          clip-rule="evenodd"
        />
      </svg>
      <span lang="km">{{ backLabel }}</span>
    </BaseButton>
    <span v-else />

    <BaseButton
      variant="primary"
      :disabled="nextDisabled"
      :loading="nextLoading"
      class="ml-auto"
      @click="$emit('next')"
    >
      <span lang="km">{{ nextLabel }}</span>
      <svg class="h-4 w-4" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
        <path
          fill-rule="evenodd"
          d="M7.21 14.77a.75.75 0 010-1.06L10.94 10 7.21 6.29a.75.75 0 111.06-1.06l4.25 4.25a.75.75 0 010 1.06l-4.25 4.25a.75.75 0 01-1.06 0z"
          clip-rule="evenodd"
        />
      </svg>
    </BaseButton>
  </div>
</template>

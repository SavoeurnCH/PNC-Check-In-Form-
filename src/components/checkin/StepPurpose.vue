<script setup>
import SelectableCard from '@/components/common/SelectableCard.vue'
import { PURPOSE_OPTIONS } from '@/constants/checkin.constants'
import { useCheckInStore } from '@/stores/checkin.store'
import SectionHeading from './SectionHeading.vue'
import WizardNavButtons from './WizardNavButtons.vue'

const store = useCheckInStore()
</script>

<template>
  <div>
    <SectionHeading />
    <div class="mt-4">
      <p class="mb-2 text-sm text-gray-800">
        <span lang="km">គោលបំណងនៃការមកទស្សនកិច្ច</span> / Purpose of Visit
        <span class="text-red-500">*</span>
      </p>
      <div class="grid grid-cols-2 gap-2 sm:grid-cols-3">
        <SelectableCard
          v-for="option in PURPOSE_OPTIONS"
          :key="option.value"
          :label-km="option.km"
          :label-en="option.en"
          :selected="store.form.purpose === option.value"
          @select="store.form.purpose = option.value"
        />
      </div>
    </div>

    <WizardNavButtons
      :next-disabled="!store.isCurrentStepValid"
      @back="store.goBack"
      @next="store.goNext"
    />
  </div>
</template>

<script setup>
import BaseInput from '@/components/common/BaseInput.vue'
import SelectableCard from '@/components/common/SelectableCard.vue'
import { COMING_FROM_OPTIONS } from '@/constants/checkin.constants'
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
        <span lang="km">មកពី</span> / Coming From <span class="text-red-500">*</span>
      </p>
      <div class="grid grid-cols-2 gap-2 sm:grid-cols-3">
        <SelectableCard
          v-for="option in COMING_FROM_OPTIONS"
          :key="option.value"
          :label-km="option.km"
          :label-en="option.en"
          :selected="store.form.comingFrom === option.value"
          @select="store.form.comingFrom = option.value"
        />
      </div>
    </div>

    <div class="mt-4">
      <BaseInput
        v-model="store.form.organizationName"
        label-km="ឈ្មោះអង្គភាព"
        label-en="Organization Name"
        placeholder="e.g. PSE Organization"
      />
    </div>

    <WizardNavButtons
      :next-disabled="!store.isCurrentStepValid"
      @back="store.goBack"
      @next="store.goNext"
    />
  </div>
</template>

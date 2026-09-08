<script setup>
import BaseInput from '@/components/common/BaseInput.vue'
import { useCheckInStore } from '@/stores/checkin.store'
import SectionHeading from './SectionHeading.vue'
import WizardNavButtons from './WizardNavButtons.vue'

const store = useCheckInStore()
</script>

<template>
  <div>
    <SectionHeading />
    <div class="mt-4 space-y-4">
      <BaseInput
        v-model="store.form.accompanyingVisitors"
        label-km="ចំនួនសមាជិកអមដំណើរ"
        label-en="Number of Accompanying Visitors"
        placeholder="e.g. 01"
        type="number"
      />
      <BaseInput
        v-model="store.form.accompanyingPositions"
        label-km="តួនាទី របស់ពួកគាត់"
        label-en="Their Positions"
        placeholder="e.g. Media Assistant"
      />
      <BaseInput
        v-model="store.form.personToMeet"
        label-km="បុគ្គល ឬ ផ្នែក ដែលត្រូវជួប"
        label-en="Person or Department You Are Meeting"
        placeholder="e.g. Mr. Sim - Education manager"
        required
      />
    </div>

    <WizardNavButtons
      :next-disabled="!store.isCurrentStepValid"
      @back="store.goBack"
      @next="store.goNext"
    />
  </div>
</template>

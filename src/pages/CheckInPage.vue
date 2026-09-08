<script setup>
import { computed } from 'vue'

import WizardCard from '@/components/checkin/WizardCard.vue'
import StepAffiliation from '@/components/checkin/StepAffiliation.vue'
import StepPersonalInfo from '@/components/checkin/StepPersonalInfo.vue'
import StepPurpose from '@/components/checkin/StepPurpose.vue'
import StepTerms from '@/components/checkin/StepTerms.vue'
import StepVisitDetails from '@/components/checkin/StepVisitDetails.vue'
import DefaultLayout from '@/layouts/DefaultLayout.vue'
import { useCheckInStore } from '@/stores/checkin.store'

const store = useCheckInStore()

const stepComponents = {
  1: StepPersonalInfo,
  2: StepAffiliation,
  3: StepVisitDetails,
  4: StepPurpose,
  5: StepTerms,
}

const activeStepComponent = computed(() => stepComponents[store.currentStep])
</script>

<template>
  <DefaultLayout>
    <WizardCard :current-step="store.currentStep">
      <component :is="activeStepComponent" />
    </WizardCard>
  </DefaultLayout>
</template>

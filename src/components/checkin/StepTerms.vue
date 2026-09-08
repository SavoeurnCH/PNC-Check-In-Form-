<script setup>
import { useRouter } from 'vue-router'
import { watch } from 'vue'

import AlertBanner from '@/components/common/AlertBanner.vue'
import { useCheckInStore } from '@/stores/checkin.store'
import TermsCarousel from './TermsCarousel.vue'
import WizardNavButtons from './WizardNavButtons.vue'

const store = useCheckInStore()
const router = useRouter()

async function handleNext() {
  if (store.isLastTermCard) {
    await store.submit()
    if (store.isSubmitted) router.push({ name: 'checkin-success' })
    return
  }
  store.goNext()
}

// If the term's own error banner is showing and the visitor unchecks/checks
// again, clear the stale error so it doesn't linger after a fix.
watch(
  () => store.form.acceptedTerms,
  () => {
    if (store.submitError) store.submitError = ''
  },
  { deep: true },
)
</script>

<template>
  <div>
    <h2 class="text-center text-sm font-semibold text-gray-800">
      <span lang="km">លក្ខខណ្ឌ និងគោលការណ៍</span> / TERMS &amp; POLICIES
    </h2>
    <p lang="km" class="mt-1 text-center text-xs text-gray-500">
      សូមអាន និងចុចលក្ខខណ្ឌក្នុងប្រអប់នីមួយៗ។
    </p>
    <p class="text-center text-xs text-gray-500">Please read and check each box</p>

    <div class="mt-4">
      <TermsCarousel
        :current-index="store.currentTermIndex"
        :accepted="store.form.acceptedTerms"
        @toggle="store.toggleTerm"
      />
    </div>

    <AlertBanner
      v-if="store.submitError"
      class="mt-4"
      variant="error"
      :message="store.submitError"
      retry-label="Retry"
      @retry="handleNext"
    />

    <WizardNavButtons
      :next-disabled="!store.isCurrentTermValid"
      :next-loading="store.isSubmitting"
      :next-label="store.isLastTermCard ? 'ចុះឈ្មោះចូល/Check-In' : undefined"
      @back="store.goBack"
      @next="handleNext"
    />
  </div>
</template>

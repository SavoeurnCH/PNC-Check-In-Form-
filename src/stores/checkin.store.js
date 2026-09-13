import { defineStore } from 'pinia'
import { computed, reactive, ref } from 'vue'

import { TERMS_CARDS, TOTAL_STEPS } from '@/constants/checkin.constants'
import { submitCheckIn } from '@/services/modules/checkin.api'
import { isRequired, isValidContact, isValidEmail } from '@/utils/validators'

function emptyAcceptedTerms() {
  return Object.fromEntries(TERMS_CARDS.map((card) => [card.key, false]))
}

export const useCheckInStore = defineStore('checkin', () => {
  // ---- Wizard position -----------------------------------------------
  const currentStep = ref(1)
  /** Which of the 6 terms cards is currently shown inside step 5. */
  const currentTermIndex = ref(0)

  // ---- Form fields, one bucket per step (mirrors CheckInPayload) ------
  const form = reactive({
    fullName: '',
    contactInfo: '',
    email: '',
    comingFrom: '',
    organizationName: '',
    accompanyingVisitors: '',
    accompanyingPositions: '',
    personToMeet: '',
    purpose: '',
    acceptedTerms: emptyAcceptedTerms(),
  })

  // ---- Submission lifecycle --------------------------------------------
  const isSubmitting = ref(false)
  const submitError = ref('')
  const isSubmitted = ref(false)
  const submissionResult = ref(null)

  // ---- Per-step validity -------------------------------------------------
  const stepValidity = computed(() => ({
    1: isRequired(form.fullName) && isValidContact(form.contactInfo) && (!form.email || isValidEmail(form.email)),
    2: isRequired(form.comingFrom),
    3: isRequired(form.personToMeet),
    4: isRequired(form.purpose),
    5: Object.values(form.acceptedTerms).every(Boolean),
  }))

  /** Whether the term card currently shown in the step-5 carousel is checked. */
  const isCurrentTermValid = computed(
    () => form.acceptedTerms[TERMS_CARDS[currentTermIndex.value].key],
  )

  const isCurrentStepValid = computed(() =>
    currentStep.value === 5 ? isCurrentTermValid.value : stepValidity.value[currentStep.value],
  )
  const allTermsAccepted = computed(() => stepValidity.value[5])
  const isLastTermCard = computed(() => currentTermIndex.value === TERMS_CARDS.length - 1)

  function goNext() {
    if (!isCurrentStepValid.value) return

    // Step 5 is a self-contained carousel of term cards; goNext walks
    // through those instead of advancing past the last wizard step.
    // Reaching (and checking) the final card is handled by submit(), not here.
    if (currentStep.value === 5) {
      if (currentTermIndex.value < TERMS_CARDS.length - 1) {
        currentTermIndex.value += 1
      }
      return
    }

    if (currentStep.value < TOTAL_STEPS) currentStep.value += 1
  }

  function goBack() {
    if (currentStep.value === 5 && currentTermIndex.value > 0) {
      currentTermIndex.value -= 1
      return
    }
    if (currentStep.value === 1) return
    currentStep.value -= 1
  }

  function toggleTerm(key) {
    form.acceptedTerms[key] = !form.acceptedTerms[key]
  }

  function buildPayload() {
    return {
      fullName: form.fullName.trim(),
      contactInfo: form.contactInfo.trim(),
      email: form.email.trim() || undefined,
      comingFrom: form.comingFrom,
      organizationName: form.organizationName.trim() || undefined,
      accompanyingVisitors: form.accompanyingVisitors ? Number(form.accompanyingVisitors) : null,
      accompanyingPositions: form.accompanyingPositions.trim() || undefined,
      personToMeet: form.personToMeet.trim(),
      purpose: form.purpose,
      acceptedTerms: { ...form.acceptedTerms },
    }
  }

  async function submit() {
    if (!allTermsAccepted.value || isSubmitting.value) return

    isSubmitting.value = true
    submitError.value = ''

    try {
      const { data } = await submitCheckIn(buildPayload())
      submissionResult.value = data
      isSubmitted.value = true
    } catch (error) {
      submitError.value = error?.message || 'Something went wrong. Please try again.'
    } finally {
      isSubmitting.value = false
    }
  }

  /** Resets the wizard for the next visitor (kiosk-style flow). */
  function reset() {
    currentStep.value = 1
    currentTermIndex.value = 0
    Object.assign(form, {
      fullName: '',
      contactInfo: '',
      email: '',
      comingFrom: '',
      organizationName: '',
      accompanyingVisitors: '',
      accompanyingPositions: '',
      personToMeet: '',
      purpose: '',
      acceptedTerms: emptyAcceptedTerms(),
    })
    isSubmitting.value = false
    submitError.value = ''
    isSubmitted.value = false
    submissionResult.value = null
  }

  return {
    currentStep,
    currentTermIndex,
    form,
    isSubmitting,
    submitError,
    isSubmitted,
    submissionResult,
    stepValidity,
    isCurrentStepValid,
    isCurrentTermValid,
    allTermsAccepted,
    isLastTermCard,
    goNext,
    goBack,
    toggleTerm,
    submit,
    reset,
  }
})

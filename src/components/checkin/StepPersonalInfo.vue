<script setup>
import { computed } from 'vue'

import BaseInput from '@/components/common/BaseInput.vue'
import { useCheckInStore } from '@/stores/checkin.store'
import { isValidContact, isValidEmail } from '@/utils/validators'
import SectionHeading from './SectionHeading.vue'
import WizardNavButtons from './WizardNavButtons.vue'

const store = useCheckInStore()

const contactError = computed(() =>
  store.form.contactInfo && !isValidContact(store.form.contactInfo)
    ? 'Please enter a valid phone number.'
    : '',
)
const emailError = computed(() =>
  store.form.email && !isValidEmail(store.form.email) ? 'Please enter a valid email.' : '',
)
</script>

<template>
  <div>
    <SectionHeading />
    <div class="mt-4 space-y-4">
      <BaseInput
        v-model="store.form.fullName"
        label-km="ឈ្មោះពេញ"
        label-en="Full name"
        placeholder="e.g. Jonh Smith"
        required
      />
      <BaseInput
        v-model="store.form.contactInfo"
        label-km="លេខទំនាក់ទំនង"
        label-en="Contact Info"
        placeholder="e.g. +855 88 33 44 55"
        required
        :error="contactError"
      />
      <BaseInput
        v-model="store.form.email"
        label-km="អ៊ីមែល"
        label-en="Email (Optional)"
        placeholder="e.g. jonh.smith@example.com"
        type="email"
        :error="emailError"
      />
    </div>

    <WizardNavButtons
      :show-back="false"
      :next-disabled="!store.isCurrentStepValid"
      @next="store.goNext"
    />
  </div>
</template>

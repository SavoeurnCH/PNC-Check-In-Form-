<script setup>
import BaseModal from './BaseModal.vue'

defineProps({
  modelValue: { type: Boolean, required: true },
})

defineEmits(['update:modelValue'])

// The Figma export doesn't include the content behind the "?" help icon —
// this is a reasonable, minimal placeholder consistent with the rest of the
// flow's tone until real copy is provided.
</script>

<template>
  <BaseModal :model-value="modelValue" @update:model-value="$emit('update:modelValue', $event)">
    <template #default="{ headingId }">
      <h2 :id="headingId" class="text-lg font-semibold text-gray-900">
        <span lang="km">ជំនួយ</span> / Help
      </h2>
      <p class="mt-3 text-sm leading-relaxed text-gray-600">
        Complete each step of the form with your visit details, then read and check every box in
        the Terms &amp; Policies step. Use the
        <span class="font-medium text-gray-800">Back</span> and
        <span class="font-medium text-gray-800">Next</span> buttons to move between steps. If you
        need assistance, please ask a staff member at the front desk.
      </p>
    </template>
  </BaseModal>
</template>

<script setup>
import { useRouter } from 'vue-router'

import BaseButton from '@/components/common/BaseButton.vue'
import pnLogo from '@/assets/images/pn-logo.png'
import pssLogo from '@/assets/images/pss-logo.png'
import DefaultLayout from '@/layouts/DefaultLayout.vue'
import { useCheckInStore } from '@/stores/checkin.store'

// Not present in the Figma export — built to match the rest of the flow's
// look (white card, org logos, brand-blue accents) since every check-in
// needs a confirmation screen. See README assumptions.

const store = useCheckInStore()
const router = useRouter()

function startNewCheckIn() {
  store.reset()
  router.push({ name: 'checkin' })
}
</script>

<template>
  <DefaultLayout>
    <div class="w-full max-w-lg rounded-2xl bg-white p-6 text-center shadow-card sm:p-8">
      <div class="flex items-center justify-center gap-3">
        <img :src="pnLogo" alt="Passerelles Numeriques logo" class="h-12 w-12 rounded-full" />
        <img :src="pssLogo" alt="PSS logo" class="h-12 w-12 rounded-full" />
      </div>

      <span
        class="mx-auto mt-5 flex h-16 w-16 items-center justify-center rounded-full bg-emerald-100"
        aria-hidden="true"
      >
        <svg class="h-8 w-8 text-emerald-600" viewBox="0 0 20 20" fill="currentColor">
          <path
            fill-rule="evenodd"
            d="M16.704 5.29a1 1 0 010 1.415l-7.5 7.5a1 1 0 01-1.414 0l-3.5-3.5a1 1 0 111.414-1.414l2.793 2.792 6.793-6.793a1 1 0 011.414 0z"
            clip-rule="evenodd"
          />
        </svg>
      </span>

      <h1 class="mt-4 text-xl font-bold text-gray-900 sm:text-2xl">
        <span lang="km">អ្នកបានចុះឈ្មោះជោគជ័យ</span> - You're Checked In
      </h1>
      <p class="mt-2 text-sm text-gray-600">
        Thank you, <span class="font-semibold">{{ store.submissionResult?.fullName }}</span
        >. Please wear your visitor badge at all times while on campus.
      </p>

      <div v-if="store.submissionResult?.badgeCode" class="mt-5 rounded-xl bg-brand-50 p-4">
        <p class="text-xs uppercase tracking-wide text-brand-600">Visitor Badge Code</p>
        <p class="mt-1 text-2xl font-bold tracking-widest text-brand-700">
          {{ store.submissionResult.badgeCode }}
        </p>
      </div>

      <BaseButton class="mt-6 w-full justify-center" @click="startNewCheckIn">
        <span lang="km">ចុះឈ្មោះភ្ញៀវថ្មី</span> / New Check-In
      </BaseButton>
    </div>
  </DefaultLayout>
</template>

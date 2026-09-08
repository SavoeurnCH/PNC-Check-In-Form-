<script setup>
import { useRouter } from 'vue-router'

import BaseButton from '@/components/common/BaseButton.vue'
import DefaultLayout from '@/layouts/DefaultLayout.vue'

const router = useRouter()
</script>

<template>
  <DefaultLayout>
    <div class="w-full max-w-md rounded-2xl bg-white p-8 text-center shadow-card">
      <p class="text-5xl font-bold text-brand-500">404</p>
      <h1 class="mt-2 text-lg font-semibold text-gray-900">Page not found</h1>
      <p class="mt-1 text-sm text-gray-500">The page you're looking for doesn't exist.</p>
      <BaseButton class="mt-6" @click="router.push({ name: 'checkin' })">
        Back to Check-In
      </BaseButton>
    </div>
  </DefaultLayout>
</template>

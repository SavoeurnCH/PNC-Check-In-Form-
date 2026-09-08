<script setup>
import AppFooter from '@/components/layout/AppFooter.vue'
import TopBar from '@/components/layout/TopBar.vue'
</script>

<template>
  <div
    class="flex min-h-screen flex-col bg-gradient-to-tr from-[#F29639] to-[#189BD7]"
  >
    <TopBar />
    <main class="flex flex-1 items-center justify-center px-4 py-6 sm:px-6">
      <slot />
    </main>
    <AppFooter />
  </div>
</template>

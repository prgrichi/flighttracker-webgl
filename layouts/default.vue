<template>
  <div class="app-shell flex flex-col h-screen">
    <TheHeader />

    <main class="flex-1 relative" id="main-content" tabindex="-1">
      <slot></slot>
    </main>
    <TheFooter />
  </div>
</template>

<script setup>
import TheHeader from './TheHeader.vue';
import TheFooter from './TheFooter.vue';

useFlightsLifecycle();
</script>

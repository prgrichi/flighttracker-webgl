<template>
  <div class="app-shell flex flex-col h-screen">
    <TheHeader />

    <main class="flex-1 relative" id="main-content" tabindex="-1">
      <slot></slot>
    </main>
  </div>
</template>

<script setup>
import TheHeader from './TheHeader.vue';

useFlightsLifecycle('bavaria');
</script>

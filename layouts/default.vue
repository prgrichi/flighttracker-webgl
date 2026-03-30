<template>
  <div class="app-shell flex h-dvh flex-col">
    <TheHeader />

    <main id="main-content" tabindex="-1" class="relative min-h-0 flex-1">
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

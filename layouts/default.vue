<template>
  <div class="app-shell flex h-dvh flex-col">
    <main id="main-content" tabindex="-1" class="relative min-h-0 flex-1">
      <slot></slot>
    </main>
  </div>
</template>

<script setup>
useFlightsLifecycle();
</script>

<template>
  <header class="w-full h-16 border-b border-border bg-surface">
    <div class="relative flex items-center justify-between h-full px-4">
      <!-- LEFT: Favorites -->

      <NuxtLink
        :to="isFavorites ? '/' : '/favorites'"
        class="flex items-center justify-center w-10 h-10 rounded-lg hover:bg-muted transition"
        :aria-label="isFavorites ? 'Go to home' : 'Favorites'"
      >
        <transition name="icon-switch" mode="out-in">
          <UIcon
            :key="isFavorites ? 'back' : 'heart'"
            :name="isFavorites ? 'i-lucide-arrow-left' : 'i-lucide-heart'"
            class="w-5 h-5"
          />
        </transition>
      </NuxtLink>

      <!-- CENTER -->
      <NuxtLink to="/" class="absolute left-1/2 -translate-x-1/2 flex items-center gap-2">
        <UIcon name="i-lucide-plane" class="w-4 h-4 opacity-70" />
        <span class="text-sm font-medium tracking-wider uppercase text-muted-foreground">
          Flighttracker
        </span>
      </NuxtLink>

      <!-- RIGHT: Settings -->
      <button
        class="flex items-center justify-center w-10 h-10 rounded-lg hover:bg-muted transition"
        aria-label="Settings"
        @click="open = !open"
      >
        <UIcon name="i-lucide-settings" class="w-5 h-5" />
      </button>
    </div>
  </header>

  <!-- SLIDEOVER -->
  <USlideover
    v-model:open="open"
    title="Settings"
    :close="{
      color: 'neutral',
      variant: 'soft',
    }"
    description="Custom settings ... WIP"
  >
    <template #body>
      <div class="space-y-6">
        <div>
          <p class="text-sm font-medium mb-2">Show Airbase Type</p>

          <div class="space-y-2">
            <UCheckbox v-model="filters.large" label="Large Airbases" />
            <UCheckbox v-model="filters.small" label="Small Airbases" />
            <UCheckbox v-model="filters.helipad" label="Heliports" />
          </div>
        </div>
      </div>
    </template>
  </USlideover>
</template>

<script setup>
import { ref, computed } from 'vue';
import { useRoute } from 'vue-router';

const route = useRoute();

const open = ref(false);

const isFavorites = computed(() => route.path === '/favorites');

const filters = ref({
  large: true,
  small: false,
  helipad: false,
});
</script>

<style>
.icon-switch-enter-active,
.icon-switch-leave-active {
  transition: all 0.12s ease-out;
}

.icon-switch-enter-from {
  opacity: 0;
  transform: translateX(-6px) scale(0.9);
}

.icon-switch-leave-to {
  opacity: 0;
  transform: translateX(6px) scale(0.9);
}
</style>

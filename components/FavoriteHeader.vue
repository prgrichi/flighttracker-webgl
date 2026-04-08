<template>
  <header class="absolute top-0 inset-x-0 mx-auto w-full h-[50px] z-1000 border-border bg-surface">
    <div class="relative flex items-center justify-between h-full px-1">
      <!-- LEFT: Favorites -->

      <NuxtLink
        :to="isFavorites ? '/' : '/favorites'"
        class="flex items-center justify-center w-10 h-10 rounded-lg hover:bg-muted transition"
        :aria-label="isFavorites ? 'Go to home' : 'Favorites'"
      >
        <transition name="icon-switch" mode="out-in">
          <UIcon
            :key="isFavorites ? 'back' : 'bookmark'"
            :name="isFavorites ? 'i-lucide-arrow-left' : 'i-lucide-bookmark'"
            class="w-5 h-5"
          />
        </transition>
      </NuxtLink>

      <!-- CENTER -->
      <NuxtLink to="/" class="absolute left-1/2 -translate-x-1/2 flex items-center gap-2">
        <span
          class="text-shadow-mauve-50 font-sans font-semiboldtracking-wider uppercase text-muted-foreground"
        >
          Favoriten
        </span>
      </NuxtLink>
    </div>
  </header>
</template>

<script setup>
import { ref, computed } from 'vue';
import { useRoute } from 'vue-router';
import { REGIONS } from '@/constants/regions';
import { useAirportsState } from '@/composables/airports/useAirportsState';
import { useMapState } from '@/composables/map/useMapState';
import TheHeaderStatusBanners from '@/layouts/components/TheHeaderStatusBanners.vue';

const route = useRoute();
const { isMapLoading } = useMapState();

const { region } = useFlightsState();

const { showLargeAirports, showMediumAirports, showSmallAirports, showHeliports } =
  useAirportsState();

const handleRegionClick = item => {
  if (region.value === item.id) return;
  region.value = item.id;
};

const open = ref(false);

const isFavorites = computed(() => route.path === '/favorites');
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

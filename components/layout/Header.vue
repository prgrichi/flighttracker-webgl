<template>
  <header
    class="absolute top-2 inset-x-0 mx-auto w-[95%] h-[45px] z-1000 rounded-lg shadow-md border-border bg-surface/90 backdrop-blur-md"
  >
    <MapLoader v-if="isMapLoading" />

    <MapStatusBanners />

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
          Flight Tracker
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
      variant: 'ghost',
    }"
    description=""
  >
    <template #body>
      <div class="space-y-6">
        <div>
          <p class="text-sm font-medium mb-2">Show Airport Type</p>

          <div class="space-y-2">
            <UCheckbox v-model="showLargeAirports" size="lg" label="Large airports" />
            <UCheckbox v-model="showMediumAirports" size="lg" label="Medium airports" />
            <UCheckbox v-model="showSmallAirports" size="lg" label="Small airports" />
            <UCheckbox v-model="showHeliports" size="lg" label="Heliports" />
          </div>
        </div>
        <div>
          <div class="space-y-2">
            <p class="text-sm font-medium mb-2">Flight data region</p>

            <div class="grid grid-cols-3 gap-2">
              <button
                v-for="item in REGIONS"
                :key="item.id"
                type="button"
                @click="handleRegionClick(item)"
                :class="[
                  'rounded-lg border px-3 py-2 text-sm',
                  item.id === region
                    ? 'border-primary bg-primary/10 text-primary'
                    : 'border-border bg-surface text-text-primary',
                ]"
              >
                {{ item.label }}
              </button>
            </div>
          </div>
        </div>

        <div>
          <p class="text-sm font-medium mb-2">Request Stats</p>

          <div class="rounded-lg border border-border bg-muted/30 p-3 space-y-2 text-sm">
            <div v-if="requestStatsPending" class="text-muted-foreground">
              Loading request stats...
            </div>

            <div v-else-if="requestStatsError" class="text-red-500">
              Request stats currently unavailable.
            </div>

            <template v-else>
              <div class="flex items-center justify-between">
                <span class="text-muted-foreground">Flights API</span>
                <span class="font-medium">{{ stats.flightsApiRequests }}</span>
              </div>

              <div class="flex items-center justify-between">
                <span class="text-muted-foreground">Favorites API</span>
                <span class="font-medium">{{ stats.favoritesApiRequests }}</span>
              </div>

              <div class="flex items-center justify-between">
                <span class="text-muted-foreground">Flights OpenSky</span>
                <span class="font-medium">{{ stats.flightsOpenSkyRequests }}</span>
              </div>

              <div class="flex items-center justify-between">
                <span class="text-muted-foreground">Favorites OpenSky</span>
                <span class="font-medium">{{ stats.favoritesOpenSkyRequests }}</span>
              </div>

              <div class="flex items-center justify-between pt-2 border-t border-border">
                <span class="text-muted-foreground">Total API</span>
                <span class="font-semibold">{{ totalApiRequests }}</span>
              </div>

              <div class="flex items-center justify-between">
                <span class="text-muted-foreground">Total OpenSky</span>
                <span class="font-semibold">{{ totalOpenSkyRequests }}</span>
              </div>
            </template>
          </div>
        </div>
      </div>
    </template>
  </USlideover>
</template>

<script setup>
import { ref, computed, watch } from 'vue';
import { useRoute } from 'vue-router';
import { REGIONS } from '@/constants/regions';
import { useAirportsState } from '@/composables/airports/useAirportsState';
import { useMapState } from '@/composables/map/useMapState';
import MapStatusBanners from '@/components/banners/MapStatusBanners.vue';

const route = useRoute();
const { isMapLoading } = useMapState();

const { region } = useFlightsState();

const { showLargeAirports, showMediumAirports, showSmallAirports, showHeliports } =
  useAirportsState();

const {
  stats,
  pending: requestStatsPending,
  error: requestStatsError,
  refresh: refreshRequestStats,
  totalApiRequests,
  totalOpenSkyRequests,
} = useRequestStats();

const handleRegionClick = item => {
  if (region.value === item.id) return;
  region.value = item.id;
};

const open = ref(false);

const isFavorites = computed(() => route.path === '/favorites');

watch(open, isOpen => {
  if (!isOpen) return;

  refreshRequestStats();
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

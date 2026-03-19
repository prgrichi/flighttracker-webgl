<template>
  <div class="relative w-full h-full">
    <ClientOnly>
      <!-- PHASE 1: App lädt -->
      <template #fallback>
        <MapLoader />
      </template>

      <!-- PHASE 2: Map lädt -->
      <div class="relative w-full h-full">
        <div id="map" class="h-full"></div>

        <!-- <MapLoader v-if="isLoading" /> -->
        <!-- <MapZoomControls /> -->
        <!-- <MapReset /> -->
        <!-- <MapTypeSwitcher
          v-model="currentMapType"
          :mapTypes="MAP_TYPES"
          @update:modelValue="setMapType"
        /> -->

        <Transition name="slide-up">
          <FlightCard
            v-if="selectedFlight"
            :flight="selectedFlight"
            @close="clearSelectedFlight()"
          />
        </Transition>
      </div>
    </ClientOnly>
  </div>
</template>

<script setup>
definePageMeta({});
</script>

<style></style>

<template>
  <div class="h-full overflow-y-auto px-4 py-4 max-w-3xl mx-auto w-full">
    <template v-if="showFavorites">
      <TransitionGroup name="favorites-soft" tag="div">
        <FavoriteCard
          v-for="fav in favoriteStates"
          :key="fav.icao24"
          :fav="fav"
          @remove="removeFavorite"
        ></FavoriteCard>
      </TransitionGroup>
    </template>

    <template v-else>
      <header class="mb-6">
        <h1 class="text-xl font-semibold">Favorites</h1>
        <p class="text-sm text-muted-foreground mt-1">Your saved aircrafts will appear here.</p>
      </header>

      <div
        class="flex flex-col items-center justify-center text-center py-16 border border-dashed border-border rounded-lg"
      >
        <UIcon name="i-lucide-heart" class="w-8 h-8 mb-3 opacity-50" />
        <p class="text-sm text-muted-foreground">No favorites yet.</p>
      </div>
    </template>
  </div>
</template>

<script setup>
import { computed, watch } from 'vue';

import { useFavorites } from '@/composables/favorites/useFavorites';
import { useFavoritesState } from '@/composables/favorites/useFavoritesState';
import { useFavoritesLifecycle } from '@/composables/favorites/useFavoritesLifecycle';
import FavoriteCard from '@/components/FavoriteCard.vue';

const { favorites, removeFavorite } = useFavorites();
const { favoriteStates } = useFavoritesState();

useFavoritesLifecycle();

const showFavorites = computed(() => favorites.value.length > 0);

watch(
  favoriteStates,
  val => {
    console.log('🔥 favoriteStates:', val);
  },
  { immediate: true }
);
</script>

<style scoped>
.favorites-soft-enter-active,
.favorites-soft-leave-active {
  transition: all 0.22s ease;
}

.favorites-soft-enter-from {
  opacity: 0;
  transform: translateY(8px) scale(0.985);
}

.favorites-soft-leave-to {
  opacity: 0;
  transform: translateX(-14px) scale(0.985);
}

.favorites-soft-move {
  transition: transform 0.22s ease;
}
</style>

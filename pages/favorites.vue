<template>
  <div class="h-full overflow-y-auto px-4 pt-4 pb-8 max-w-3xl mx-auto w-full">
    <FavoriteHeader></FavoriteHeader>

    <div class="relative top-12 mb-10">
      <div v-if="showFavorites" class="mb-4 flex items-center justify-between gap-3">
        <div class="text-sm text-muted-foreground">
          <span class="font-medium text-toned">{{ visibleFavoritesCount }}</span>
          {{ visibleFavoritesCountLabel }}
        </div>

        <div
          class="inline-flex items-center rounded-xl border border-border bg-muted/30 p-1"
          role="group"
          aria-label="Sortierung der Favoriten"
        >
          <!-- Neueste -->
          <button
            type="button"
            @click="sortNewestFirst = true"
            class="inline-flex items-center gap-2 rounded-lg px-3 py-1.5 text-sm font-medium transition-all duration-150 focus:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2"
            :class="
              sortNewestFirst
                ? 'bg-primary text-white shadow'
                : 'text-muted-foreground hover:text-toned hover:bg-muted'
            "
            :aria-pressed="sortNewestFirst"
          >
            <UIcon name="i-lucide-arrow-down-wide-narrow" class="w-4 h-4" aria-hidden="true" />
            <span>Neueste</span>
          </button>

          <!-- Älteste -->
          <button
            type="button"
            @click="sortNewestFirst = false"
            class="inline-flex items-center gap-2 rounded-lg px-3 py-1.5 text-sm font-medium transition-all duration-150 focus:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2"
            :class="
              !sortNewestFirst
                ? 'bg-primary text-white shadow'
                : 'text-muted-foreground hover:text-toned hover:bg-muted'
            "
            :aria-pressed="!sortNewestFirst"
          >
            <UIcon name="i-lucide-arrow-up-wide-narrow" class="w-4 h-4" aria-hidden="true" />
            <span>Älteste</span>
          </button>
        </div>
      </div>

      <!-- Skeleton -->
      <template v-if="isLoading">
        <div>
          <FavoriteCardSkeleton v-for="n in 3" :key="n" />
        </div>
      </template>

      <template v-else-if="showFavorites">
        <TransitionGroup name="favorites-soft" tag="div">
          <FavoriteCard
            v-for="fav in sortedFavoriteStates"
            :key="fav.icao24"
            :fav="fav"
            :is-navigating="navigatingIcao24 === fav.icao24"
            @remove="requestRemove(fav)"
            @show-on-map="showFavoriteOnMap"
          />
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
          <UIcon name="i-lucide-bookmark" class="w-8 h-8 mb-3 opacity-50" />
          <p class="text-sm text-muted-foreground">No favorites yet.</p>
        </div>
      </template>
    </div>

    <FavoriteUndoToast
      :item="pendingRemoval"
      :progress-percent="progressPercent"
      @undo="undoRemove"
    />
  </div>
</template>

<script setup>
import { computed, ref, onMounted } from 'vue';

import FavoriteHeader from '@/components/favorites/FavoriteHeader';
import FavoriteCardSkeleton from '@/components/favorites/FavoriteCardSkeleton.vue';

import { useFavorites } from '@/composables/favorites/useFavorites';
import { useFavoriteState } from '@/composables/favorites/useFavoriteState';
import { useFavoriteLifeCycle } from '@/composables/favorites/useFavoriteLifeCycle';
import { useFavoriteUndo } from '@/composables/favorites/useFavoriteUndo';
import { useMapNavigation } from '@/composables/map/useMapNavigation';

import FavoriteCard from '@/components/favorites/FavoriteCard.vue';
import FavoriteUndoToast from '@/components/favorites/FavoriteUndoToast.vue';

const { favorites, removeFavorite } = useFavorites();
const favoriteState = useFavoriteState(favorites);
const { favoriteStates, fetchFreshFavorite, pending } = favoriteState;
const { navigateToFlight } = useMapNavigation();

useFavoriteLifeCycle(favoriteState);

const { pendingRemoval, progressPercent, hiddenIcao24Set, requestRemove, undoRemove } =
  useFavoriteUndo(removeFavorite);

const isHydrated = ref(false);
onMounted(() => {
  isHydrated.value = true;
});

const sortNewestFirst = ref(true);
const navigatingIcao24 = ref(null);

const showFavoriteOnMap = async fav => {
  if (!fav?.icao24 || navigatingIcao24.value) return;

  navigatingIcao24.value = fav.icao24;

  try {
    const freshFavorite = await fetchFreshFavorite(fav.icao24);
    const flightForNavigation = freshFavorite?.found ? { ...fav, ...freshFavorite } : fav;

    await navigateToFlight(flightForNavigation, 9);
  } catch (err) {
    console.error('Failed to refresh favorite before map navigation:', err);
    await navigateToFlight(fav, 9);
  } finally {
    navigatingIcao24.value = null;
  }
};

const visibleFavoriteStates = computed(() => {
  return favoriteStates.value.filter(fav => !hiddenIcao24Set.value.has(fav.icao24));
});

const isLoading = computed(() => {
  return pending.value && isHydrated.value;
});

const showFavorites = computed(() => {
  return visibleFavoriteStates.value.length > 0;
});

const sortedFavoriteStates = computed(() => {
  return [...visibleFavoriteStates.value].sort((a, b) => {
    const aTime = a.savedAt || 0;
    const bTime = b.savedAt || 0;

    return sortNewestFirst.value ? bTime - aTime : aTime - bTime;
  });
});

const visibleFavoritesCount = computed(() => visibleFavoriteStates.value.length);

const visibleFavoritesCountLabel = computed(() => {
  return visibleFavoritesCount.value > 1 ? 'Favoriten' : 'Favorit';
});

// watch(
//   favoriteStates,
//   val => {
//     console.log('🔥 favoriteStates:', val);
//   },
//   { immediate: true }
// );
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

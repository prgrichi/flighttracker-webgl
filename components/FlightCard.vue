<template>
  <div class="absolute bottom-3 left-3 right-3 z-[1000]">
    <UCard
      class="w-full rounded-3xl border border-slate-300 bg-white/95 text-slate-950 shadow-md backdrop-blur-sm"
    >
      <div class="relative">
        <div class="min-w-0">
          <div class="mb-6 flex items-start gap-2 pr-10">
            <div class="min-w-0 flex-1">
              <div class="flex items-center justify-between gap-3">
                <!-- Left: ICAO + Title -->
                <div class="min-w-0">
                  <!-- ICAO24 -->
                  <div class="text-[10px] font-medium uppercase tracking-[0.2em] text-slate-400">
                    {{ flight.icao24 }}
                  </div>

                  <!-- Title + Badge Row -->
                  <div class="flex items-center gap-2">
                    <div class="truncate text-base font-semibold tracking-[0.02em] text-slate-900">
                      {{ displayTitle }}
                    </div>

                    <!-- Status Badge -->
                    <span :class="statusBadgeClass">
                      {{ onGroundLabel }}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div
            class="mb-4 flex items-center gap-4 rounded-2xl border border-slate-200 bg-slate-50 p-2"
          >
            <div
              v-if="flight.airlineLogo"
              class="flex h-14 w-20 shrink-0 items-center justify-center rounded-xl bg-white ring-1 ring-slate-200"
            >
              <img
                class="max-h-9 max-w-[4.5rem] object-contain"
                :src="flight.airlineLogo"
                :alt="flight.airlineName || 'Airline logo'"
              />
            </div>

            <div class="min-w-0">
              <p v-if="!isHelicopter" class="truncate text-sm font-semibold text-slate-900">
                {{ flight.airlineName || 'Unknown airline' }}
              </p>

              <div
                class="mt-1 flex flex-wrap items-center gap-x-2 gap-y-1 text-sm font-medium text-slate-700"
              >
                <span>{{ flight.aircraftManufacturer || 'Unknown manufacturer' }}</span>
                <span class="text-slate-400">•</span>
                <span>{{ flight.aircraftModel || 'Unknown model' }}</span>
              </div>

              <p v-if="helicopterInfoText" class="mt-1 text-sm font-medium text-slate-700">
                {{ helicopterInfoText }}
              </p>
            </div>
          </div>

          <div class="flex flex-wrap gap-2.5">
            <div :class="infoBoxClass()">
              <div :class="infoLabelClass()">Speed</div>
              <div :class="infoValueClass()">{{ formatSpeed(flight.speedKmh) }}</div>
            </div>

            <div :class="infoBoxClass()">
              <div :class="infoLabelClass()">Altitude</div>
              <div :class="infoValueClass()">{{ formatAltitude(flight.altitudeM) }}</div>
            </div>

            <div :class="infoBoxClass()">
              <div :class="infoLabelClass()">Vertical rate</div>
              <div :class="infoValueClass()">{{ formatVerticalRate(flight.verticalRate) }}</div>
            </div>
          </div>
        </div>

        <div class="absolute right-0 top-0 flex items-center gap-1">
          <UButton
            variant="ghost"
            size="lg"
            class="h-10 w-10 rounded-xl transition-colors duration-200"
            :class="isCurrentFlightFavorite ? 'bg-emerald-50 text-emerald-600' : 'text-slate-700'"
            @click.stop="handleFavoriteClick"
          >
            <UIcon
              :name="isCurrentFlightFavorite ? 'i-lucide-bookmark-check' : 'i-lucide-bookmark'"
              class="h-[22px] w-[22px]"
              :class="animateFavorite ? 'animate-fav-icon-pop' : ''"
            />
          </UButton>
          <UButton
            icon="i-lucide-x"
            color="neutral"
            variant="ghost"
            size="lg"
            class="flex h-9 w-9 items-center justify-center rounded-lg text-slate-600 transition"
            @click.stop="emit('close')"
          />
        </div>
      </div>
    </UCard>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue';
import { useFavorites } from '@/composables/favorites/useFavorites';

const props = defineProps({
  flight: {
    type: Object,
    required: true,
  },
});

const emit = defineEmits(['close']);

const { isFavorite, toggleFavorite } = useFavorites();

const isCurrentFlightFavorite = computed(() => {
  return isFavorite(props.flight?.icao24);
});

const toggleCurrentFlightFavorite = () => {
  toggleFavorite(props.flight);
};

const animateFavorite = ref(false);

const handleFavoriteClick = () => {
  const willBeFavorite = !isCurrentFlightFavorite.value;

  toggleCurrentFlightFavorite();

  if (willBeFavorite) {
    animateFavorite.value = true;

    setTimeout(() => {
      animateFavorite.value = false;
    }, 350);
  }
};

const displayTitle = computed(() => props.flight?.callsign || props.flight?.icao24 || 'Flight');

const isHelicopter = computed(() => {
  return props.flight?.aircraftCategory === 'helicopter' || Boolean(props.flight?.helicopter);
});

const onGroundLabel = computed(() => {
  if (props.flight?.onGround == null) return '—';
  return props.flight.onGround ? 'On ground' : 'In air';
});

const statusBadgeClass = computed(() => {
  if (props.flight?.onGround == null) {
    return 'inline-flex shrink-0 items-center rounded-full border border-slate-400 bg-slate-200 px-2 py-0.5 text-[11px] font-bold uppercase tracking-[0.12em] text-slate-700';
  }

  return props.flight.onGround
    ? 'inline-flex shrink-0 items-center rounded-full border border-rose-400 bg-rose-100 px-2 py-0.5 text-[11px] font-bold uppercase tracking-[0.12em] text-rose-800'
    : 'inline-flex shrink-0 items-center rounded-full border border-emerald-400 bg-emerald-100 px-2 py-0.5 text-[11px] font-bold uppercase tracking-[0.12em] text-emerald-800';
});

const infoBoxClass = () => {
  return 'min-w-0 basis-[calc(50%-0.3125rem)] rounded-2xl border border-slate-200 bg-slate-100 p-2';
};

const infoLabelClass = () => {
  return 'text-[11px] uppercase tracking-[0.16em] text-slate-500';
};

const infoValueClass = () => {
  return 'mt-1 text-sm font-semibold text-slate-900';
};

const formatAltitude = alt => {
  if (alt == null) return '—';
  return `${Math.round(alt)} m`;
};

const formatSpeed = speed => {
  if (speed == null) return '—';
  return `${Math.round(speed)} km/h`;
};

const formatVerticalRate = rate => {
  if (rate == null) return '—';

  const rounded = Math.round(rate * 10) / 10;
  return `${rounded > 0 ? '+' : ''}${rounded} m/s`;
};

const helicopterInfoText = computed(() => {
  if (!isHelicopter.value) return null;

  const parts = [
    props.flight?.helicopter?.organization,
    props.flight?.helicopter?.name,
    props.flight?.helicopter?.location,
  ].filter(Boolean);

  return parts.length ? parts.join(' • ') : 'Unknown operator';
});
</script>

<style scoped>
@keyframes fav-icon-pop {
  0% {
    transform: scale(1);
  }
  35% {
    transform: scale(1.35);
  }
  100% {
    transform: scale(1);
  }
}

.animate-fav-icon-pop {
  animation: fav-icon-pop 0.35s ease-out;
  transform-origin: center;
}
</style>

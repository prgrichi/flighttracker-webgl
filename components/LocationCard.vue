<template>
  <div class="absolute bottom-3 left-3 right-3 z-[1000]">
    <UCard
      class="w-full rounded-3xl border border-slate-300 bg-white text-slate-950 shadow-md backdrop-blur-sm"
    >
      <div class="relative">
        <div class="min-w-0">
          <div class="flex items-center gap-2">
            <div class="min-w-0">
              <div class="flex items-center gap-2">
                <div class="truncate text-base font-semibold text-slate-900">
                  {{
                    location?.properties?.name ||
                    location?.properties?.iata ||
                    location?.properties?.icao ||
                    'Unknown location'
                  }}
                </div>
              </div>

              <div class="mt-1 text-sm text-slate-500">
                {{ location?.properties?.iata || '—' }} ·
                {{ location?.properties?.icao || '—' }}
              </div>

              <div class="mt-2 flex items-center gap-2 text-xs">
                <span
                  class="inline-flex items-center gap-1 rounded-md px-2 py-0.5 font-medium"
                  :class="airportTypeMeta.class"
                >
                  <UIcon :name="airportTypeMeta.icon" class="h-3 w-3" /> {{ airportTypeMeta.label }}
                </span>
              </div>

              <div v-if="formattedCoordinates" class="mt-2 text-xs font-mono text-slate-500">
                {{ formattedCoordinates }}
              </div>
            </div>
          </div>
        </div>

        <UButton
          icon="i-lucide-x"
          color="neutral"
          variant="ghost"
          size="lg"
          class="absolute right-0 top-0 flex h-9 w-9 items-center justify-center rounded-lg text-slate-600 transition"
          @click.stop="emit('close')"
        />
      </div>
    </UCard>
  </div>
</template>

<script setup>
import { computed } from 'vue';

const props = defineProps({
  location: Object, // jetzt: komplettes Feature
});

const emit = defineEmits(['close']);

const airportTypeMeta = computed(() => {
  const type = props.location?.properties?.airportType;

  return (
    {
      large_airport: {
        label: 'Large Airport',
        class: 'bg-blue-100 text-blue-700',
        icon: 'i-lucide-plane',
      },
      medium_airport: {
        label: 'Medium Airport',
        class: 'bg-green-100 text-green-700',
        icon: 'i-lucide-plane',
      },
      small_airport: {
        label: 'Small Airport',
        class: 'bg-slate-100 text-slate-600',
        icon: 'i-lucide-plane',
      },
      heliport: {
        label: 'Heliport',
        class: 'bg-purple-100 text-purple-700',
        icon: 'i-lucide-helicopter',
      },
    }[type] || {
      label: 'Unknown',
      class: 'bg-slate-100 text-slate-500',
      icon: 'i-lucide-map-pin',
    }
  );
});

// 5️⃣ Coordinates
const formattedCoordinates = computed(() => {
  const coords = props.location?.geometry?.coordinates;

  if (!coords || coords.length < 2) return null;

  const [lon, lat] = coords;

  return `${lat.toFixed(4)}, ${lon.toFixed(4)}`;
});
</script>

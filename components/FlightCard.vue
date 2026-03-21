<template>
  <div class="absolute bottom-3 left-3 right-3 z-[1000]">
    <UCard
      class="w-full cursor-pointer rounded-2xl shadow-xl backdrop-blur bg-white/80"
      @click="emit('close')"
    >
      <div class="flex justify-between items-start">
        <div>
          <div class="font-bold text-lg">
            {{ flight.callsign || 'Unknown' }}
          </div>
          <div class="text-sm text-gray-500">ICAO24: {{ flight.icao24 }}</div>
        </div>
        <UIcon name="i-lucide-x" class="w-5 h-5 text-gray-400" />
      </div>

      <div class="mt-3 grid grid-cols-2 gap-2 text-sm">
        <div>
          <div class="text-gray-400">Altitude</div>
          <div class="font-medium">
            {{ formatAltitude(flight.altitudeM) }}
          </div>
        </div>

        <div>
          <div class="text-gray-400">Heading</div>
          <div class="font-medium">
            {{ formatHeading(flight.heading) }}
          </div>
        </div>
      </div>
    </UCard>
  </div>
</template>

<script setup>
defineProps({
  flight: Object,
});

const emit = defineEmits(['close']);

const formatAltitude = alt => {
  if (!alt) return '—';
  return `${Math.round(alt)} m`;
};

const formatHeading = hdg => {
  if (hdg == null) return '—';
  return `${Math.round(hdg)}°`;
};
</script>

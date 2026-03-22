<template>
  <div class="absolute bottom-3 left-3 right-3 z-[1000]">
    <UCard
      class="w-full rounded-3xl border border-slate-300 bg-white text-slate-950 shadow-xl backdrop-blur-sm"
    >
      <div class="relative">
        <div class="min-w-0">
          <div class="mb-6 flex items-center gap-2">
            <div class="min-w-0">
              <div class="flex items-center gap-2">
                <div class="truncate text-base font-semibold text-slate-900">
                  {{ displayTitle }}
                </div>
                <span :class="statusBadgeClass">
                  {{ onGroundLabel }}
                </span>
              </div>
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
              <div :class="infoLabelClass()">Climb status</div>
              <div :class="infoValueClass()">{{ formatClimbStatus(flight) }}</div>
            </div>

            <div :class="infoBoxClass()">
              <div :class="infoLabelClass()">Vertical rate</div>
              <div :class="infoValueClass()">{{ formatVerticalRate(flight.verticalRate) }}</div>
            </div>
          </div>
        </div>

        <button
          class="absolute right-0 top-0 flex h-9 w-9 items-center justify-center rounded-xl border border-slate-300 text-slate-600 transition hover:bg-slate-200 hover:text-slate-950"
          type="button"
          @click.stop="emit('close')"
        >
          <UIcon name="i-lucide-x" class="h-4 w-4" />
        </button>
      </div>
    </UCard>
  </div>
</template>

<script setup>
import { computed } from 'vue';

const props = defineProps({
  flight: Object,
});

const emit = defineEmits(['close']);

const displayTitle = computed(() => props.flight?.callsign || props.flight?.icao24 || 'Flight');

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
  return 'min-w-0 basis-[calc(50%-0.3125rem)] rounded-2xl border border-slate-200 bg-slate-100 px-3 py-2.5';
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

const formatClimbStatus = flight => {
  if (!flight) return '—';
  if (flight.onGround) return 'Level';
  if (flight.climbing) return 'Climbing';
  if (flight.descending) return 'Descending';
  return 'Level';
};
</script>

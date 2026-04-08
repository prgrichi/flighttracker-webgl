<template>
  <transition name="fade">
    <div v-if="show" class="absolute left-0 top-[calc(100%+6px)] z-1200 w-full">
      <div
        :class="[
          'flex items-center justify-between px-4 py-2 rounded-md text-sm text-white backdrop-blur border-b',
          color === 'success'
            ? 'bg-green-600/95 border-green-400/30'
            : 'bg-red-500/95 border-red-400/30',
        ]"
      >
        <div class="flex items-center gap-2">
          <component :is="resolvedIcon" class="w-4 h-4 opacity-90" />
          <span class="font-medium">{{ message }}</span>
        </div>

        <button
          v-if="showRetry"
          class="flex items-center gap-1 text-xs underline opacity-80 hover:opacity-100 disabled:opacity-50"
          :disabled="loading"
          @click="$emit('retry')"
        >
          <component
            :is="loading ? LoaderIcon : RotateCwIcon"
            :class="['w-3 h-3', loading ? 'animate-spin' : '']"
          />

          <span>Retry</span>
        </button>
      </div>
    </div>
  </transition>
</template>

<script setup>
import LoaderIcon from '@/components/icons/IconLoader.vue';
import RotateCwIcon from '@/components/icons/IconRotateCw.vue';
import CircleSuccessCheckIcon from '@/components/icons/IconCircleSuccessCheck.vue';
import CircleAlertCheckIcon from '@/components/icons/IconCircleAlertCheck.vue';

const props = defineProps({
  show: Boolean,
  message: {
    type: String,
    default: 'Error',
  },
  loading: {
    type: Boolean,
    default: false,
  },
  showRetry: {
    type: Boolean,
    default: false,
  },
  icon: {
    type: [String, Object],
    default: null,
  },
  color: {
    type: String,
    default: 'error',
  },
});

const resolvedIcon = computed(() => {
  if (props.icon) return props.icon;

  if (props.color === 'success') {
    return CircleSuccessCheckIcon;
  }

  return CircleAlertCheckIcon;
});

defineEmits(['retry']);
</script>

<style scoped>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.15s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>

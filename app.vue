<template>
  <UApp>
    <div>
      <transition name="splash-fade">
        <div
          v-if="visibleSplash"
          class="fixed inset-0 z-[9999] flex items-center justify-center bg-white"
        >
          <!-- Map -->
          <div class="absolute inset-0 flex items-center justify-center overflow-hidden">
            <img
              src="/europe-map.svg"
              class="w-full h-full object-cover max-w-none opacity-50 blur-[2px]"
            />
          </div>

          <!-- Overlay -->
          <div class="absolute inset-0 bg-white/75"></div>

          <div class="relative z-10 flex flex-col items-center justify-center text-center">
            <img
              src="/logo-inverted-transparent.png"
              alt="Flighttracker Logo"
              class="mb-[10px] w-[150px] h-auto object-contain"
            />

            <h1
              class="m-0 flex flex-col uppercase text-black text-[2rem] font-bold tracking-[0.15rem] leading-[2.3rem] animate-[splash-text-in_150ms_ease-out]"
            >
              <span class="font-sans font-semibold tracking-[0.5rem]"> Flight </span>
              <span class="font-sans font-light tracking-[0.18rem] ml-[-0.2rem]"> Tracker </span>
            </h1>
          </div>
        </div>
      </transition>

      <NuxtLayout>
        <NuxtPage />
      </NuxtLayout>
    </div>
  </UApp>
</template>

<script setup>
import { computed, ref, onMounted } from 'vue';

// const splashCookie = useCookie('ft_splash_seen', {
//   default: () => null,
//   maxAge: 60 * 60 * 6, // 6 Stunden
//   sameSite: 'lax',
// });

// const shouldShowSplash = computed(() => splashCookie.value !== '1');
// const visibleSplash = ref(shouldShowSplash.value);

// if (shouldShowSplash.value) {
//   splashCookie.value = '1';
// }

const visibleSplash = ref(true);
onMounted(() => {
  // if (!shouldShowSplash.value) return;
  setTimeout(() => {
    visibleSplash.value = false;
  }, 800);
});
</script>

<style scoped>
.splash-fade-enter-active,
.splash-fade-leave-active {
  transition: opacity 0.35s ease;
}

.splash-fade-enter-from,
.splash-fade-leave-to {
  opacity: 0;
}
@keyframes splash-text-in {
  from {
    opacity: 0.96;
  }
  to {
    opacity: 1;
  }
}
</style>

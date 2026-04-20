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
              fetchpriority="high"
              src="/europe-map.webp"
              class="w-full h-full object-cover max-w-none opacity-50 blur-[2px]"
            />
          </div>

          <!-- Overlay -->
          <div class="absolute inset-0 bg-white/75"></div>

          <div class="relative z-10 flex flex-col items-center justify-center text-center">
            <img
              width="150"
              height="150"
              fetchpriority="high"
              src="/logo-inverted-transparent-256.png"
              alt="Flighttracker Logo"
              class="mb-[10px] w-[150px] h-auto object-contain"
            />

            <h1
              class="m-0 flex flex-col uppercase text-black text-[2rem] font-bold tracking-[0.15rem] leading-[2.3rem]"
            >
              <span class="font-semibold tracking-[0.5rem]"> Flight </span>
              <span class="font-light tracking-[0.18rem] ml-[-0.2rem]"> Tracker </span>
            </h1>

            <!-- Loader -->
            <div class="mt-8 h-[2px] w-24 overflow-hidden rounded-full bg-black/10">
              <div class="splash-line"></div>
            </div>
          </div>
        </div>
      </transition>

      <NuxtLayout>
        <NuxtPage :keepalive="{ include: ['index'] }" />
      </NuxtLayout>
    </div>
  </UApp>
</template>

<script setup>
import { ref, onMounted } from 'vue';

const visibleSplash = ref(true);

onMounted(() => {
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

.splash-line {
  height: 100%;
  width: 40%;
  border-radius: 9999px;
  background: linear-gradient(90deg, transparent, rgba(0, 0, 0, 0.6), transparent);
  animation: splash-line-flow 1.2s infinite cubic-bezier(0.4, 0, 0.2, 1);
}

@keyframes splash-line-flow {
  0% {
    transform: translateX(-120%);
  }
  100% {
    transform: translateX(260%);
  }
}
</style>

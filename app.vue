<template>
  <UApp>
    <div>
      <transition name="splash-fade">
        <div v-if="visibleSplash" class="splash-screen">
          <div class="splash-content">
            <img src="/logo.png" alt="Flighttracker Logo" class="splash-logo" />
            <h1 class="splash-title">Flighttracker24</h1>
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

useHead({
  meta: [{ name: 'viewport', content: 'width=device-width, initial-scale=1' }],
  link: [{ rel: 'icon', href: '/favicon.ico' }],
  htmlAttrs: {
    lang: 'de',
  },
});

const splashCookie = useCookie('ft_splash_seen', {
  default: () => null,
  maxAge: 60 * 60 * 6, // 6 Stunden
  sameSite: 'lax',
});

const shouldShowSplash = computed(() => splashCookie.value !== '1');
const visibleSplash = ref(shouldShowSplash.value);

if (shouldShowSplash.value) {
  splashCookie.value = '1';
}

onMounted(() => {
  if (!shouldShowSplash.value) return;

  setTimeout(() => {
    visibleSplash.value = false;
  }, 800);
});
</script>

<style scoped>
.splash-screen {
  position: fixed;
  inset: 0;
  z-index: 9999;
  display: flex;
  align-items: center;
  justify-content: center;
  background: #fff;
}

.splash-content {
  text-align: center;
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
}

.splash-logo {
  width: 88px;
  height: 88px;
  object-fit: contain;
  margin-bottom: 18px;
}

.splash-title {
  margin: 0;
  font-size: 2rem;
  font-weight: 700;
  letter-spacing: 0.15rem;
  color: #000;
  text-transform: uppercase;
}
.splash-title h1 {
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Inter, system-ui, sans-serif;
}

.splash-fade-enter-active,
.splash-fade-leave-active {
  transition: opacity 0.35s ease;
}

.splash-fade-enter-from,
.splash-fade-leave-to {
  opacity: 0;
}
</style>

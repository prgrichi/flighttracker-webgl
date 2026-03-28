<template>
  <div class="map-placeholder"></div>
</template>

<script setup></script>

<style>
.map-placeholder {
  background-image: url('/map-blur.png');
  background-size: cover;
  background-position: center;
  width: 100%;
  height: 100%;
  position: absolute;
  top: 0;
  left: 0;

  filter: blur(7px);
  transform: scale(1.05);

  animation: mapBreathing 4s ease-in-out infinite;
}

@keyframes mapBreathing {
  0% {
    transform: scale(1.05);
  }
  50% {
    transform: scale(1.12);
  }
  100% {
    transform: scale(1.05);
  }
}
</style>

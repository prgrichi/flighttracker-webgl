// composables/useMapInstance.js

import { ref } from 'vue';

const map = ref(null);

export function useMapInstance() {
  return { map };
}

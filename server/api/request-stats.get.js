import { getRequestStats } from '@/server/utils/requestStats.js';

export default defineEventHandler(() => {
  return getRequestStats();
});

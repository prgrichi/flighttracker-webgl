import { getRequestStats } from '@/server/utils/stats/requestStats.js';

export default defineEventHandler(() => {
  return getRequestStats();
});

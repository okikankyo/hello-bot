const axios = require('axios');

const WEBHOOK_URL = process.env.SCHEDULE_TRIGGER_URL;

(async () => {
  try {
    const res = await axios.get(WEBHOOK_URL);
    console.log('✅ Cron呼び出し成功:', res.status);
    process.exit(0);
  } catch (e) {
    console.error('❌ Cron呼び出し失敗:', e.response?.data || e.message);
    process.exit(1);
  }
})();

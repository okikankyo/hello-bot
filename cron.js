const axios = require('axios');
const jwt = require('jsonwebtoken');

const CLIENT_ID = process.env.LW_CLIENT_ID;
const CLIENT_SECRET = process.env.LW_CLIENT_SECRET;
const SERVICE_ACCOUNT = process.env.LW_SERVICE_ACCOUNT;
const PRIVATE_KEY = process.env.LW_PRIVATE_KEY;
const BOT_ID = process.env.LW_BOT_ID;

// 送信先をどちらか使う
const TARGET_USER_ID = process.env.LW_TARGET_USER_ID; // 個人宛
const TARGET_ROOM_ID = process.env.LW_TARGET_ROOM_ID; // トークルーム宛

async function getAccessToken() {
  const now = Math.floor(Date.now() / 1000);

  const payload = {
    iss: CLIENT_ID,
    sub: SERVICE_ACCOUNT,
    iat: now,
    exp: now + 300
  };

  const privateKey = PRIVATE_KEY
    .replace(/^"(.*)"$/s, '$1')
    .replace(/\\n/g, '\n')
    .trim();

  const assertion = jwt.sign(payload, privateKey, {
    algorithm: 'RS256'
  });

  const params = new URLSearchParams();
  params.append('grant_type', 'urn:ietf:params:oauth:grant-type:jwt-bearer');
  params.append('client_id', CLIENT_ID);
  params.append('client_secret', CLIENT_SECRET);
  params.append('assertion', assertion);

  const response = await axios.post(
    'https://auth.worksmobile.com/oauth2/v2.0/token',
    params,
    {
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded'
      }
    }
  );

  return response.data.access_token;
}

async function sendMessage(accessToken, text) {
  const headers = {
    Authorization: `Bearer ${accessToken}`,
    'Content-Type': 'application/json'
  };

  if (TARGET_ROOM_ID) {
    await axios.post(
      `https://www.worksapis.com/v1.0/bots/${BOT_ID}/channels/${TARGET_ROOM_ID}/messages`,
      {
        content: {
          type: 'text',
          text
        }
      },
      { headers }
    );
    return;
  }

  if (TARGET_USER_ID) {
    await axios.post(
      `https://www.worksapis.com/v1.0/bots/${BOT_ID}/users/${TARGET_USER_ID}/messages`,
      {
        content: {
          type: 'text',
          text
        }
      },
      { headers }
    );
    return;
  }

  throw new Error('LW_TARGET_USER_ID または LW_TARGET_ROOM_ID を設定してください');
}

(async () => {
  try {
    const token = await getAccessToken();

    const text = `【定期送信】
本日は定例案内日です。
必要事項の確認をお願いします。`;

    await sendMessage(token, text);
    console.log('送信成功');
    process.exit(0);
  } catch (e) {
    console.error('送信失敗:', e.response?.data || e.message);
    process.exit(1);
  }
})();

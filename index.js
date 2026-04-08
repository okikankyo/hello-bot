const express = require('express');
const axios = require('axios');
const app = express();

app.use(express.json());

const BOT_ID = process.env.LW_BOT_ID;

app.post('/', async (req, res) => {
  console.log("受信:", req.body);

  // まず200返す（必須）
  res.sendStatus(200);

  try {
    const userId = req.body.source.userId;

    await axios.post(
      `https://www.worksapis.com/v1.0/bots/${BOT_ID}/users/${userId}/messages`,
      {
        content: {
          type: "text",
          text: "Hello World"
        }
      },
      {
        headers: {
          Authorization: `Bearer ${process.env.LW_CLIENT_SECRET}`
        }
      }
    );

  } catch (e) {
    console.error("エラー:", e.response?.data || e.message);
  }
});

app.listen(10000, () => {
  console.log("Server started");
});

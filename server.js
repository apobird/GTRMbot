// server.js
const express = require('express');
const app = express();
const port = process.env.PORT || 3000;

// ルートエンドポイントを設定
app.get('/', (req, res) => {
  res.send('Bot is running!');
});

// サーバーを起動
app.listen(port, () => {
  console.log(`Express server is running on port ${port}`);
});

const express = require('express');
const app = express();

app.use(express.json());

app.post('/', (req, res) => {
  console.log("受信:", req.body);
  res.sendStatus(200);
});

app.get('/', (req, res) => {
  res.send("Hello World Server");
});

app.listen(10000, () => {
  console.log("Server started");
});

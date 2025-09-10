const express = require('express');
const fs = require('fs');
const app = express();
const data = require('./data.json');

app.use(express.json());
app.use(express.static('public'));

const stressFile = './stressData.json';

app.post('/chat', (req, res) => {
  const msg = req.body.message.trim();
  if (!isNaN(msg) && msg !== "") {
    let stressData = {};
    if (fs.existsSync(stressFile)) {
      stressData = JSON.parse(fs.readFileSync(stressFile));
    }
    const user = "user1";
    if (!stressData[user]) stressData[user] = [];
    stressData[user].push(Number(msg));
    fs.writeFileSync(stressFile, JSON.stringify(stressData, null, 2));
    res.json({ reply: `Got it! You rated your stress as ${msg}. I’ll track this for your progress. `});
  } else {
    const reply = data[msg.toLowerCase()] || data["default"];
    res.json({ reply });
  }
});

app.listen(3000, () => {
  console.log('Chatbot running on http://localhost:3000');
});

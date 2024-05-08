const express = require('express');
const bodyParser = require('body-parser');
const { NlpManager } = require('node-nlp');
const trainnlp = require('./train-nlp.js');
const path = require('path');
const fs = require('fs');

// Import the ServerChatbot class
const ServerChatbot = require('./ServerChatbot');

const chatbot = new ServerChatbot();

const app = express();
app.use(bodyParser.json());

const port = 3000;
const manager = new NlpManager({ languages: ['en'], ner: { builtins: [] }, threshold: 0.5, forceNER: true });
const modelPath = path.join(__dirname, 'model.nlp');
const trainingDataPath = path.join(__dirname, 'trainingNames.json');

async function loadModel() {
  await trainnlp(manager);
  console.log('Model is ready to use.');
}

loadModel();


// not usedd
function loadTrainingData() {
  if (fs.existsSync(trainingDataPath)) {
      return JSON.parse(fs.readFileSync(trainingDataPath, 'utf8'));
  } else {
      // Ensure minimum categories exist
      return {
          "russianMasculine": [],
          "russianFeminine": [],
          "englishMasculine": [],
          "englishFeminine": [],
          "estonianMasculine": [],
          "estonianFeminine": []
      };
  }
}

// not used
function saveTrainingData(data) {
  fs.writeFileSync(trainingDataPath, JSON.stringify(data, null, 2));
}





function handleNameResponse(chatbot,response, res) {
  let answer = response.answer || "I'm not sure how to respond to that.";
  const nameEntity = response.entities.find(entity => entity.entity === 'person');
  const nameToUse = nameEntity ? nameEntity.sourceText : extractName(response.utterance);

  if (nameToUse) {
      chatbot.setUserName(nameToUse); // Set user name in Chatbot instance
      if (response.answer) {
          answer = response.answer.replace('{{name}}', nameToUse);
      } else {
          answer = `Hello ${nameToUse}, how can I help you today?`;
      }
  } else if (!nameToUse && response.answer) {
      answer = response.answer.replace('{{name}}', 'Guest');
  }

  res.json({
    answer: answer,
    userName: chatbot.userName,
    botName: chatbot.botName  
  });
} 

/* //  message handling logic for bot
if (message.toLowerCase().includes('bot') && /(\b\w+\b)(?:.*?\b\1\b){2,}/.test(message.toLowerCase())) {
  return handleRepetitions(message);
} */

function handleRepetitions(input) {
  const count = (input.match(/bot/gi) || []).length;
  if (count > 2) {
      return "Playing our favorite echo game, aren’t we? How can I help you today?";
  }
  return "Just getting my circuits warmed up! What can I do for you?";
}

function extractName(inputText) {
  // RegEx various ways a name 
  const patterns = [
    /(?:my name is|I am known as|you can call me|I go by|it's|I'm|people call me|my friends call me|I prefer to be called|just call me) ([\w\s\-']+)/i,
    /(?:^|\s)([\w\s\-']+)(?:,?\s+is my name|,?\s+here|,?\s+everyone knows me as|,?\s+the name's|,?\s+please address me as|,?\s+i identify as)/i,
    /in case you're wondering, I'm ([\w\s\-']+)/i,
    /for your information, I'm ([\w\s\-']+)/i,
    /to make things easy, you can call me ([\w\s\-']+)/i,
    /let's keep it simple, I'm ([\w\s\-']+)/i,
    /^\s*([\w\s\-']+)/i // "[userName]"
  ];

  // Check each pattern to find a match
  for (let pattern of patterns) {
    const match = inputText.match(pattern);
    if (match) {
      return match[1].trim(); // Return the first captured group, trimmed of any extra whitespace
    }
  }

  return null; // Return null 
}

app.post('/nlp-process-message', async (req, res) => {
  const { message } = req.body;
  try {
    const response = await manager.process('en', message);
    console.log("NLP Full Response:", JSON.stringify(response, null, 2));
    handleNameResponse(chatbot,response, res);
  } catch (error) {
    console.error('Error processing message:', error);
    res.status(500).send('Error processing your message.');
  }
});

app.listen(port, () => console.log(`Server running on http://localhost:${port}`));



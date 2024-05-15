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



/* function handleNameResponse(chatbot, response, res) {
  let answer = response.answer || "I'm not sure how to respond to that.";
  const nameEntity = response.entities.find(entity => entity.entity === 'person');
  const botNameEntity = response.entities.find(entity => entity.entity === 'botNamePerson');
  
  const botNameIntent = response.classifications.find(classification => classification.label === 'botName.userNamesBot');
  
  
  // Determine the name to use based on entity detection
  const nameToUse = nameEntity ? nameEntity.sourceText : null;

  if (nameToUse && !chatbot.userNameAlreadySet) {
    chatbot.setUserName(nameToUse);
    chatbot.userNameAlreadySet = true; // Prevents changing the name again
    answer = response.answer ? response.answer.replace('{{name}}', nameToUse) : `Hello ${nameToUse}, how can I help you today?`;
  } else {
    answer = response.answer ? response.answer.replace('{{name}}', chatbot.userName || 'Guest') : "How can I assist you?";
  }

  if (botNameEntity && botNameIntent.value < 0.15) { // Adjust threshold as necessary
      // Set bot name in Chatbot instance only if the intent score is high enough
      chatbot.setBotName(botNameEntity.sourceText);
      console.log(`Bot name set to: ${botNameEntity.sourceText}`);

      // Modify the response answer if a name is included
      if (response.answer) {
          answer = response.answer.replace('{{name}}', botNameEntity.sourceText);
      } else {
          answer = `Hello ${botNameEntity.sourceText}, how can I help you today?`;
      }
  } else if (response.answer) {
    // answer = response.answer.replace('{{name}}', 'Guest'); 
    chatbot.setBotName(botNameEntity.sourceText);
    answer = response.answer.replace('{{name}}', botNameEntity.sourceText);
  }

  // Return the modified response
  res.json({
    answer: answer,
    userName: chatbot.userName,
    botName: chatbot.botName  
  });
} */


function handleNameResponse(chatbot, response, res) {
  let answer = response.answer || "I'm not sure how to respond to that.";
  const nameEntity = response.entities.find(entity => entity.entity === 'person');
  const botNameEntity = response.entities.find(entity => entity.entity === 'botNamePerson');
  const botNameIntent = response.classifications.find(classification => classification.label === 'botName.userNamesBot');

  // Determine the user name to use based on entity detection
  if (nameEntity && !chatbot.userNameAlreadySet) {
      chatbot.setUserName(nameEntity.sourceText);
      chatbot.userNameAlreadySet = true; // Prevents changing the user name again
      answer = `Hello ${nameEntity.sourceText}, how can I help you today?`;
  }

  // Determine the bot name to use based on entity and intent score
  if (botNameEntity && botNameIntent && botNameIntent.value > 0.15) {
      chatbot.setBotName(botNameEntity.sourceText);
      console.log(`Bot name set to: ${botNameEntity.sourceText}`);
      answer = `Hello ${botNameEntity.sourceText}, how can I help you today?`;
  }

  // Use existing names if no new names are provided
  answer = answer.replace('{{name}}', chatbot.userName || 'Guest');

  // Return the modified response
  res.json({
      answer: answer,
      userName: chatbot.userName,
      botName: chatbot.botName
  });
}


app.post('/updateBotName', (req, res) => {
  const { newBotName } = req.body;  // Extract new name from request
  chatbot.setBotName(newBotName);  // Update the bot name in the server-side instance
  res.json({ success: true, botName: chatbot.botName });  // Send back confirmation and new name
});



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


// not usedd
/* function loadTrainingData() {
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
} */

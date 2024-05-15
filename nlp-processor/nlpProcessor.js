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



function handleUnknownNameDetails(chatbot, detail, res) {
  if (detail === "Masculine" || detail === "Feminine") {
      chatbot.nameGender = detail;
      res.json({answer: "English, Russian, or Estonian?"});
  } else if (["English", "Russian", "Estonian"].includes(detail)) {
      chatbot.nameOrigin = detail;
      // Save the new name for training
      saveNameForTraining(chatbot.unknownName, chatbot.nameGender, chatbot.nameOrigin);
      res.json({answer: `${chatbot.unknownName} saved as a ${chatbot.nameGender}, ${detail} name. How can I assist you further?`});
  } else {
      // Handle other languages
      saveNameForTraining(chatbot.unknownName, chatbot.nameGender, "Other");
      res.json({answer: "Thank you for your input. I have saved this name for future learning. How can I assist you further?"});
  }
}

function saveNameForTraining(name, gender, origin) {
  // Logic to save the name to your database or a training set
  console.log(`Saving name: ${name}, Gender: ${gender}, Origin: ${origin}`);
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



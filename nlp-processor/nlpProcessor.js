const express = require('express');
const bodyParser = require('body-parser');
const { NlpManager } = require('node-nlp');
const trainnlp = require('./train-nlp.js');
const path = require('path');
const fs = require('fs');
const session = require('express-session');

// .env
const dotenv = require('dotenv');

// Import the ServerChatbot class
const ServerChatbot = require('./ServerChatbot');

const chatbot = new ServerChatbot();

/* dotenv.config();

console.log('SECRET_KEY:', process.env.SECRET_KEY);


if (!process.env.SECRET_KEY) {
  throw new Error('SECRET_KEY is not defined in the environment variables');
}

app.use(session({
  secret: process.env.SECRET_KEY, 
  resave: false,
  saveUninitialized: true,
  cookie: { secure: false } 
})); */

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
      if (response.answer) {
          answer = response.answer.replace('{{name}}', nameEntity.sourceText);
      } else {
          answer = answer.replace('{{name}}', nameEntity.sourceText);
      }
  }

  // Determine the bot name to use based on entity and intent score
  if (botNameEntity && botNameIntent && botNameIntent.value > 0.15) {
      chatbot.setBotName(botNameEntity.sourceText);
      console.log(`Bot name set to: ${botNameEntity.sourceText}`);
      answer = answer.replace('{{botName}}', botNameEntity.sourceText);
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

function handleRatingResponse(response, res) {
  console.log('Received response:', JSON.stringify(response, null, 2)); // Log the incoming response

  const intent = response.intent;
  const ratingResponses = {
    'rateMe1': ['1: Terrible', '1: Awful', '1: Horrible', '1: Disappointing', '1: Dreadful'],
    'rateMe2': ['2: Bad', '2: Poor', '2: Unsatisfactory', '2: Subpar', '2: Mediocre'],
    'rateMe3': ['3: Average', '3: Okay', '3: Fair', '3: Neutral', '3: So-so'],
    'rateMe4': ['4: Good', '4: Nice', '4: Satisfactory', '4: Decent', '4: Pleasant'],
    'rateMe5': ['5: Excellent', '5: Outstanding', '5: Superb', '5: Fantastic', '5: Perfect']
  };

  if (!intent || !ratingResponses[intent]) {
    console.error('Invalid intent:', intent);
    res.json({
      answer: 'I am not sure how to respond to that.',
      userName: chatbot.userName,
      botName: chatbot.botName
    });
    return;
  }

  // Select a random response for the given intent
  const responses = ratingResponses[intent];
  const randomResponse = responses[Math.floor(Math.random() * responses.length)];

  console.log('Selected random response:', randomResponse); // Log the selected response

  res.json({
    answer: randomResponse,
    userName: chatbot.userName,
    botName: chatbot.botName  
  });
}

app.post('/updateBotName', (req, res) => {
  const { newBotName } = req.body;  // Extract name  request
  chatbot.setBotName(newBotName);  // Update the bot name in the server-side instance
  res.json({ success: true, botName: chatbot.botName });  // Send  confirmation and new name
});



app.post('/nlp-process-message', async (req, res) => {
  const { message } = req.body;
  try {
    const response = await manager.process('en', message);
    console.log("NLP Full Response:", JSON.stringify(response, null, 2));
    
    // Check if  intent is rateMe 
    if (response.intent === 'rateMe') {
      handleRatingResponse(response, res);
    } else {
      handleNameResponse(chatbot, response, res);
    }
  } catch (error) {
    console.error('Error processing message:', error);
    res.status(500).send('Error processing your message.');
  }
});

// Not used -> for NOW
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

// Not used -> for NOW
function saveNameForTraining(name, gender, origin) {
  // Logic to save the name to  database or a training set
  console.log(`Saving name: ${name}, Gender: ${gender}, Origin: ${origin}`);
}


app.listen(port, () => console.log(`Server running on http://localhost:${port}`));





/* function handleNameResponse(chatbot, response, res) {
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
      answer = `Proud to hear my new name  ${botNameEntity.sourceText}, nice to me you ${nameEntity.sourceText}?`;
  }

  // Use existing names if no new names are provided
  answer = answer.replace('{{name}}', chatbot.userName || 'Guest');

  // Return the modified response
  res.json({
      answer: answer,
      userName: chatbot.userName,
      botName: chatbot.botName
  });
} */
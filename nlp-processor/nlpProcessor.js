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





/* function handleNameResponse(chatbot, response, req, res) {
  let answer = response.answer || "I'm not sure how to respond to that.";
  const nameEntity = response.entities.find(entity => entity.entity === 'person');
  const botNameEntity = response.entities.find(entity => entity.entity === 'botNamePerson');
  const botNameIntent = response.classifications.find(classification => classification.label === 'botName.userNamesBot');

  // Determine the user name to use based on entity detection
  if (nameEntity && !req.session.userNameAlreadySet) {
      chatbot.setUserName(nameEntity.sourceText);
      req.session.userName = nameEntity.sourceText; // Save userName in session
      req.session.userNameAlreadySet = true; // Prevents changing the user name again
      answer = `Hello ${nameEntity.sourceText}, how can I help you today?`;
  }

  // Determine the bot name to use based on entity and intent score
  if (botNameEntity && botNameIntent && botNameIntent.value > 0.15) {
      chatbot.setBotName(botNameEntity.sourceText);
      req.session.botName = botNameEntity.sourceText; // Save botName in session
      console.log(`Bot name set to: ${botNameEntity.sourceText}`);
      answer = `Hello ${botNameEntity.sourceText}, how can I help you today?`;
  }

  // Use existing names if no new names are provided
  answer = answer.replace('{{name}}', req.session.userName || 'Guest');

  // Save chat log in session
  req.session.chatLog = req.session.chatLog || [];
  req.session.chatLog.push({ user: req.body.message, bot: answer });

  // Return the modified response
  res.json({
      answer: answer,
      userName: req.session.userName,
      botName: req.session.botName
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


/* function handleRatingResponse(response, req, res) {
  const intent = response.intent;
  const ratingResponses = {
    'rateMe1': '1: Terrible',
    'rateMe2': '2: Bad',
    'rateMe3': '3: Average',
    'rateMe4': '4: Good',
    'rateMe5': '5: Excellent'
  };

  const answer = ratingResponses[intent] || response.answer;

  // Save rating in session
  req.session.ratings = req.session.ratings || [];
  req.session.ratings.push({ rating: intent, response: answer });

  // Save chat log in session
  req.session.chatLog = req.session.chatLog || [];
  req.session.chatLog.push({ user: req.body.message, bot: answer });

  res.json({
    answer: answer,
    userName: req.session.userName,
    botName: req.session.botName  
  });
} */


function handleRatingResponse(response, res) {
  const intent = response.intent;
  const ratingResponses = {
    'rateMe1': ['Rate me 1', 'I rate 1', 'My rating is 1', '1 star', 'One star'],
    'rateMe2': ['Rate me 2', 'I rate 2', 'My rating is 2', '2 stars', 'Two stars'],
    'rateMe3': ['Rate me 3', 'I rate 3', 'My rating is 3', '3 stars', 'Three stars'],
    'rateMe4': ['Rate me 4', 'I rate 4', 'My rating is 4', '4 stars', 'Four stars'],
    'rateMe5': ['Rate me 5', 'I rate 5', 'My rating is 5', '5 stars', 'Five stars']
  };

  const answer = ratingResponses[intent] || response.answer;

  res.json({
    answer: answer,
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



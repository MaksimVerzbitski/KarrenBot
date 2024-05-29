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

  function isValidName(name) {
      const validNameRegex = /^[a-zA-Z\s\-]+$/;
      return validNameRegex.test(name);
  }

  console.log("Processing name response...");
  console.log("Response Entities:", JSON.stringify(response.entities, null, 2));
  console.log("Current userName:", chatbot.userName);
  console.log("Current botName:", chatbot.botName);

  if (nameEntity && !chatbot.userNameAlreadySet) {
      if (isValidName(nameEntity.sourceText)) {
          chatbot.setUserName(nameEntity.sourceText);
          chatbot.userNameAlreadySet = true;
          answer = response.answer ? response.answer.replace('{{name}}', nameEntity.sourceText) : answer.replace('{{name}}', nameEntity.sourceText);
      } else {
          chatbot.unknownName = nameEntity.sourceText;
          answer = chatbot.askForNameDetails(nameEntity.sourceText);
      }
  } else if (chatbot.waitingForNameDetails) {
      const languageEntity = response.entities.find(entity => entity.entity === 'language');
      const genderEntity = response.entities.find(entity => entity.entity === 'gender');

      if (languageEntity) {
          chatbot.nameOrigin = languageEntity.sourceText;
          answer = "Is this name typically Male or Female?";
      }

      if (genderEntity) {
          chatbot.nameGender = genderEntity.sourceText;
          saveNameForTraining(chatbot.unknownName, chatbot.nameGender, chatbot.nameOrigin);
          answer = `${chatbot.unknownName} saved as a ${chatbot.nameGender}, ${chatbot.nameOrigin} name. How can I assist you further?`;
          chatbot.waitingForNameDetails = false;
      }
  } else if (botNameEntity && botNameIntent && botNameIntent.value > 0.15) {
      chatbot.setBotName(botNameEntity.sourceText);
      console.log(`Bot name set to: ${botNameEntity.sourceText}`);
      answer = answer.replace('{{botName}}', botNameEntity.sourceText);
  } else {
      answer = answer.replace('{{name}}', chatbot.userName || 'Guest');
  }

  console.log("Final answer:", answer);
  console.log("Updated userName:", chatbot.userName);
  console.log("Updated botName:", chatbot.botName);

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

function handleSmileyResponse(response, res) {
  const smileyResponses = {
    '😊': ['I see you\'re happy!', 'That\'s a nice smile!', 'Glad to see you smile!', 'Keep smiling!'],
    '😂': ['That must be really funny!', 'Glad to see you laughing!', 'Haha, that’s hilarious!', 'Laughter is the best medicine!'],
    '😍': ['Looks like you love it!', 'Aww, that’s sweet!', 'Love is in the air!', 'Heart eyes!'],
    '😢': ['Oh no, why the tears?', 'That’s sad to hear.', 'Here for you.', 'Sending you a virtual hug!'],
    '😡': ['Uh oh, what made you angry?', 'Take a deep breath.', 'Let’s calm down.', 'I’m here to listen.'],
    '👍': ['Thumbs up!', 'Great job!', 'That’s the spirit!', 'Keep it up!'],
    '🙏': ['Thank you!', 'Much appreciated!', 'You’re welcome!', 'Namaste.'],
    '🎉': ['Party time!', 'That’s worth celebrating!', 'Congratulations!', 'Let’s celebrate!'],
    '❤️': ['Sending love!', 'That’s lovely!', 'Heartfelt!', 'Love is all around!'],
    '💔': ['Heartbroken?', 'I’m here for you.', 'That’s tough.', 'Sending love your way.']
  };

  const smiley = response.utterance.trim();
  const possibleResponses = smileyResponses[smiley];
  const randomResponse = possibleResponses[Math.floor(Math.random() * possibleResponses.length)];

  res.json({
    answer: randomResponse,
    userName: chatbot.userName,
    botName: chatbot.botName
  });
}


/* app.post('/nlp-process-message', async (req, res) => {
  const { message } = req.body;
  try {
      const response = await manager.process('en', message);
      console.log("NLP Full Response:", JSON.stringify(response, null, 2));
      
      const smileyPattern = /[😊😂😍😢😡👍🙏🎉❤️💔]/;
      if (smileyPattern.test(message)) {
          handleSmileyResponse(response, res);
      } else if (response.intent === 'userName.provideName') {
          handleNameResponse(chatbot, response, res);
      } else if (response.intent.startsWith('rateMe')) {
          handleRatingResponse(response, res);
      } else if (response.intent === 'botName.userNamesBot') {
          handleNameResponse(chatbot, response, res); // Process bot names
      } else {
          res.json({
              answer: response.answer || 'I am not sure how to respond to that.',
              userName: chatbot.userName,
              botName: chatbot.botName
          });
      }
  } catch (error) {
      console.error('Error processing message:', error);
      res.status(500).json({ error: 'An error occurred while processing the message.' });
  }
}); */


app.post('/nlp-process-message', async (req, res) => {
  const { message } = req.body;
  try {
    const response = await manager.process('en', message);
    console.log("NLP Full Response:", JSON.stringify(response, null, 2));
    
    const smileyPattern = /[😊😂😍😢😡👍🙏🎉❤️💔]/;
    if (smileyPattern.test(message)) {
      handleSmileyResponse(response, res);
    } else if (response.intent === 'userName.provideName') {
      handleNameResponse(chatbot, response, res);
    } else if (response.intent.startsWith('rateMe')) {
      handleRatingResponse(response, res);
    } else if (response.intent === 'chat_initiator') {
      // Handle chat initiator intent and check if it involves setting the bot name
      const botNameEntity = response.entities.find(entity => entity.entity === 'botNamePerson');
      if (botNameEntity) {
        chatbot.setBotName(botNameEntity.sourceText);
        session.botName = botNameEntity.sourceText;
        console.log(`Bot name set to: ${botNameEntity.sourceText}`);
        res.json({
          answer: `I am now ${botNameEntity.sourceText}. How can I assist you?`,
          userName: chatbot.userName,
          botName: chatbot.botName
        });
      } else {
        res.json({
          answer: response.answer || 'I am not sure how to respond to that.',
          userName: chatbot.userName,
          botName: chatbot.botName
        });
      }
    } else if (response.intent === 'botName.userNamesBot') {
      handleNameResponse(chatbot, response, res); // Process bot names
    } else {
      res.json({
        answer: response.answer || 'I am not sure how to respond to that.',
        userName: chatbot.userName,
        botName: chatbot.botName
      });
    }
  } catch (error) {
    console.error('Error processing message:', error);
    res.status(500).json({ error: 'An error occurred while processing the message.' });
  }
});


app.listen(port, () => console.log(`Server running on http://localhost:${port}`));
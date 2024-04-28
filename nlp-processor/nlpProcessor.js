const express = require('express');
const { NlpManager } = require('node-nlp');
const fs = require('fs');
const path = require('path');
const { defineIntents, intentNames } = require('./intents');

const app = express();
const port = 3000;


/* const modelPath = './nlp-processor/model.nlp';
const trainingStatusPath = './nlp-processor/trainingStatus.json'; */


const basePath = path.join(__dirname);  // `__dirname` is the root of  project
const modelPath = path.join(basePath, 'model.nlp');
const trainingStatusPath = path.join(basePath,'trainingStatus.json');

app.use(express.json());

// Instantiate NLP manager
const manager = new NlpManager({ languages: ['en'] });

async function checkAndTrainModel() {
  let trainingStatus = {};
  if (fs.existsSync(trainingStatusPath)) {
    trainingStatus = JSON.parse(fs.readFileSync(trainingStatusPath, 'utf8'));
  }

  const needsTraining = intentNames.some(intentName => !trainingStatus[intentName]);

  if (needsTraining) {
    console.log('Training needed, starting training...');
    defineIntents(manager);
    await manager.train();
    manager.save(modelPath);
    console.log('Training completed and model saved.');

    // Update training status for all intents to true
    intentNames.forEach(intentName => {
      trainingStatus[intentName] = true;
    });
    fs.writeFileSync(trainingStatusPath, JSON.stringify(trainingStatus, null, 2));
  } else {
    console.log('No training needed.');
  }
}

async function loadModel() {
  if (fs.existsSync(modelPath)) {
    await manager.load(modelPath);
    console.log('Model loaded successfully.');
    checkAndTrainModel();
  } else {
    console.log('Model not found, initiating training.');
    await checkAndTrainModel();
  }
}

// Process messages using NLP manager
app.post('/nlp-process-message', async (req, res) => {
  const { message } = req.body;

  try {
      const response = await manager.process('en', message);
      console.log("NLP Output:", response);
      // Check if the response includes naming intents and handle accordingly
      if (response.intent.startsWith('userName.') || response.intent.startsWith('botName.')) {
          // Assuming the response structure includes entities
          const entities = response.entities.reduce((acc, entity) => {
              acc[entity.entity] = entity.option; // Map entities to their values
              return acc;
          }, {});

          res.json({ intent: response.intent, entities: entities, answer: response.answer });
      } else {
          res.json({ answer: response.answer || "I'm not sure how to respond to that." });
      }
  } catch (error) {
      console.error('Error processing message:', error);
      res.status(500).send('Error processing your message.');
  }
});


// Load the model on server start
loadModel().then(() => {
    app.listen(port, () => console.log(`Server running on http://localhost:${port}`));
});



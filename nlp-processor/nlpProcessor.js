const express = require('express');
const bodyParser = require('body-parser');
const { NlpManager } = require('node-nlp');
const trainnlp = require('./train-nlp');
const path = require('path');
const fs = require('fs');

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

function saveTrainingData(data) {
  fs.writeFileSync(trainingDataPath, JSON.stringify(data, null, 2));
}


function handleNameResponse(response, res) {
  let answer = "I'm not sure how to respond to that.";

  const nameEntity = response.entities.find(entity => entity.entity === 'person');
  const nameToUse = nameEntity ? nameEntity.sourceText : extractName(response.utterance);

  if (nameToUse) {
    if (response.answer) {
      // Only use replace if response.answer is defined
      answer = response.answer.replace('{{name}}', nameToUse);
    } else {
      // Provide a default greeting if no answer is available in the response
      answer = `Hello ${nameToUse}, how can I help you today?`;
    }
  } else if (!nameToUse && response.answer) {
    // If no name but response.answer exists, use a default name placeholder
    answer = response.answer.replace('{{name}}', 'Guest');
  }

  // Send the processed answer to the client
  res.json({ answer });
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
    handleNameResponse(response, res);
  } catch (error) {
    console.error('Error processing message:', error);
    res.status(500).send('Error processing your message.');
  }
});

app.listen(port, () => console.log(`Server running on http://localhost:${port}`));



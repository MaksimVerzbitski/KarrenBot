const express = require('express');
const bodyParser = require('body-parser');
const { NlpManager } = require('node-nlp');
const trainnlp = require('./train-nlp');
const path = require('path');
const fs = require('fs')

const app = express();
app.use(bodyParser.json());

const port = 3000;
const manager = new NlpManager({ languages: ['en'], ner: { builtins: [] }, threshold: 0.5, forceNER: true });
const modelPath = path.join(__dirname, 'model.nlp');
// training.json -> not implemented jet
const trainingDataPath = path.join(__dirname, 'training.json');

// Load or train model on startup
async function loadModel() {
  await trainnlp(manager);
  console.log('Model is ready to use.');
}

loadModel();

//New method for name saving
function saveNewName(name, language, gender) {
  const data = fs.existsSync(trainingDataPath) ? JSON.parse(fs.readFileSync(trainingDataPath)) : {};
  if (!data[language]) data[language] = {};
  if (!data[language][gender]) data[language][gender] = [];
  data[language][gender].push(name);
  fs.writeFileSync(trainingDataPath, JSON.stringify(data, null, 2));
}

app.post('/nlp-process-message', async (req, res) => {
  const { message } = req.body;
  try {
      const response = await manager.process('en', message);
      console.log("NLP Full Response:", JSON.stringify(response, null, 2));
      // Find the name entity
      const nameEntity = response.entities.find(entity => entity.entity === 'person');
      let answer = response.answer || "I'm not sure how to respond to that.";

      // Replace the placeholder with the actual name
      if (nameEntity && response.answer) {
          answer = response.answer.replace('{{name}}', nameEntity.sourceText);
      }

      res.json({ answer });
  } catch (error) {
      console.error('Error processing message:', error);
      res.status(500).send('Error processing your message.');
  }
});


app.listen(port, () => console.log(`Server running on http://localhost:${port}`));

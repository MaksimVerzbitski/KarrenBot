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


/* function handleNameResponse(response, res) {
  const namesData = loadNamesData(); // Assume this function is properly loading the names data
  const nameEntity = response.entities.find(entity => entity.entity === 'person');
  let answer = "I'm not sure how to respond to that."; // Default response if no other is set

  if (nameEntity) {
    try {
      const { option: languageGender, sourceText: name } = nameEntity;
      const [language, gender] = languageGender.split(/(?=[A-Z])/);
      const genderKey = gender.toLowerCase();
      const languageKey = language.toLowerCase();

      if (!namesData[languageKey] || !namesData[languageKey][genderKey] || !namesData[languageKey][genderKey].includes(name)) {
        answer = `I don't recognize this name. Could you please specify if the name is masculine or feminine and its language?`;
        saveNewName(name, languageKey, genderKey);
      } else {
        // Ensure that response.answer is not undefined before trying to replace it
        answer = response.answer ? response.answer.replace('{{name}}', name) : `Hello ${name}, how can I help you today?`;
      }
    } catch (error) {
      console.error('Error handling name:', error);
      answer = "Error processing name data. Please check the server logs.";
    }
  }

  res.json({ answer });
} */

function saveNewName(name, language, gender) {
  const data = fs.existsSync(trainingDataPath) ? JSON.parse(fs.readFileSync(trainingDataPath, 'utf-8')) : {};
  if (!data[language]) data[language] = {};
  if (!data[language][gender]) data[language][gender] = [];
  if (!data[language][gender].includes(name)) {
    data[language][gender].push(name);
    fs.writeFileSync(trainingDataPath, JSON.stringify(data, null, 2));
    console.log(`New name ${name} added to the training data.`);
  }
}


function handleNameResponse(response, res) {
  const nameEntity = response.entities.find(entity => entity.entity === 'person');
  let answer = response.answer || "I'm not sure how to respond to that.";

  if (nameEntity && response.answer) {
    answer = response.answer.replace('{{name}}', nameEntity.sourceText);
  }

  res.json({ answer });
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

/*

app.post('/nlp-process-message', async (req, res) => {
  const { message } = req.body;
  try {
    const response = await manager.process('en', message);
    const nameEntity = response.entities.find(entity => entity.entity === 'person');
    let answer = "I'm not sure how to respond to that.";

    if (nameEntity) {
      if (flatKnownNames.includes(nameEntity.sourceText)) {
        // Known name logic
        answer = response.answers.length > 0 ? response.answers[0].answer : "Hello, how can I help you today?";
        answer = answer.replace('{{name}}', nameEntity.sourceText);
      } else {
        // Unknown name logic
        tempStorage = { name: nameEntity.sourceText, awaitingDetails: true };
        answer = "I don't recognize this name. Could you please specify if the name is masculine or feminine and its language?";
      }
    }

    res.json({ answer });
  } catch (error) {
    console.error('Error processing message:', error);
    res.status(500).send('Error processing your message.');
  }
});

*/

/* app.post('/nlp-process-message', async (req, res) => {
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
          // Check if name is recognized, otherwise log it
      } else if (response.intent === 'user.provideName' && response.score > 0.5) {
          // If intent is about providing a name but no name entity found
          console.log('Unrecognized name in the phrase:', message);
          answer = "Thank you for sharing your name, but I couldn't recognize it in my list.";
      }

      res.json({ answer });
  } catch (error) {
      console.error('Error processing message:', error);
      res.status(500).send('Error processing your message.');
  }
});
 */


/* app.post('/nlp-process-message', async (req, res) => {
  const { message } = req.body;
  try {
      const response = await manager.process('en', message);
      console.log("NLP Full Response:", JSON.stringify(response, null, 2));
      const nameEntity = response.entities.find(entity => entity.entity === 'person');
      let answer = response.answer || "I'm not sure how to respond to that.";

      if (response.intent === 'user.provideName' && nameEntity) {
          if (!tempStorage.awaitingDetails) {
              // Store the name temporarily and request more details
              tempStorage = { name: nameEntity.sourceText, awaitingDetails: true };
              answer = "I don't recognize this name. Could you please specify if the name is masculine or feminine and its language?";
          } else {
              // Attempt to parse the response for gender and language
              const details = parseDetails(message);
              if (details) {
                  saveNewName(tempStorage.name, details.language, details.gender);
                  answer = `Now I know a new ${details.gender} name in ${details.language}: ${tempStorage.name}.`;
                  tempStorage = {}; // Clear the storage after handling
              } else {
                  answer = "Could you please clarify the gender and language? For example, 'masculine english'.";
              }
          }
      } else if (tempStorage.awaitingDetails) {
          const details = parseDetails(message);
          if (details) {
              saveNewName(tempStorage.name, details.language, details.gender);
              answer = `Now I know a new ${details.gender} name in ${details.language}: ${tempStorage.name}.`;
              tempStorage = {}; // Clear the storage after handling
          } else {
              answer = "Could you please clarify the gender and language? For example, 'masculine english'.";
          }
      }

      res.json({ answer });
  } catch (error) {
      console.error('Error processing message:', error);
      res.status(500).send('Error processing your message.');
  }
}); */
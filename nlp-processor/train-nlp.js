const path = require('path');
const fs = require('fs');
const readline = require('readline');
const trainNames = require('./train-names');
const setupBotResponses = require('./train-names')
const defineIntents = require("./train-intro")


const modelPath = path.join(__dirname, 'model.nlp');

function askQuestion(query) {
  const rl = readline.createInterface({
      input: process.stdin,
      output: process.stdout,
  });

  return new Promise(resolve => rl.question(query, ans => {
      rl.close();
      resolve(ans);
  }));
}

module.exports = async function trainnlp(manager) {
  const modelExists = fs.existsSync(modelPath);

  // Load or retrain decision
  if (modelExists) {
      console.log('Model file found.');
      const answer = await askQuestion('Do you want to retrain the model? (yes/no): ');
      if (answer.toLowerCase() !== 'yes') {
          manager.load(modelPath);
          console.log('Model loaded from disk.');
          return;
      }
  }

  // Execute name training 
  await trainNames(manager);
  
  await setupBotResponses(manager);

  await defineIntents(manager);
  // Training the general model
  console.log('Training the general model, please wait...');
  await manager.train();
  console.log('Model trained.');

  // Saving the trained model
  await manager.save(modelPath);
  console.log('Model saved to', modelPath);
};
  
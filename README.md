# NLP Chatbot "KarrenBot"

This project provides a Node.js-based NLP chatbot application that interprets and processes user inputs using natural language processing techniques. The chatbot is designed to handle multiple intents and can be integrated into various applications to enhance user interaction.

## Features

- **Natural Language Processing**: Utilizes node-nlp to process and understand human language.
- **Custom Intent Handlers**: Includes multiple intent configurations for personalized responses.
- **Session Management**: Manages user sessions with custom logging for errors and conversations.
- **Local Deployment**: Runs locally without the need for external API dependencies.

## Requirements

- Python 3.x
- Node.js (v12.x or newer)
- Flask (Python web framework)
- node-nlp (Node.js natural language processing library)

## Installation


1. Clone the repository:
   ```bash
   git clone https://github.com/MaksimVerzbitski/KarrenBot.git

2. Navigate to the project directory:
   ```bash
   cd KarrenBot

3. Install dependencies:
   ```bash
   pip install -r requirements.txt

4. Start the application:
   ```bash
   python -m flask --app app run --debug --host=127.0.0.1 --port=5001
   Running on http://127.0.0.1:5001

5. Start NLP processor:
   ```bash
   cd PathToProjects/KarrenBot/nlp_processor
   npm install
   nodemon nlp-processor/nlpProcessor.js 

   Server running on http://localhost:3000
   

## Usage
To chat with the bot, open your web browser and go to http://127.0.0.1:5001. Type your message and press "Send" to receive a response from the bot.

## Contributing
Your contributions are always welcome! To contribute:

- Fork the repository.
- Create a new branch for your feature (git checkout -b feature/awesome-feature).
- Commit your changes (git commit -am 'Add some awesome feature').
- Push to the branch (git push origin feature/awesome-feature).
- Create a new Pull Request.

## License
This project is licensed under the MIT License - see the LICENSE file for details.   



## Extending
To add new intents or customize responses:

- Edit the intents.js file to include new training phrases and intent configurations.
- Re-train the model by restarting the server, which triggers the training process if new intents are detected.


Contact
Maksim Verzbitski – [@LinkedIN](https://www.linkedin.com/in/maksim-ver%C5%BEbitski-33a65b205/) – maksim.verzbitski@gmail.com

Project Link: https://github.com/MaksimVerzbitski/KarrenBot.git


### Additional Styling Tips:

- **Headers**: Use headers to organize sections clearly.
- **Code Blocks**: Use code blocks for installation commands and examples.
- **Links**: Include links to personal or project-related pages.
- **Lists**: Use bullet points for features, requirements, and steps.






class Chatbot {
    constructor() {
        this.conversationHistory = [];
    
        this.messages = [];

        this.expectingBotName = false;
        this.expectingUserName = false;
        this.botName = 'Bot'; // Default bot name
        this.userName = 'User'; // Default user name
    }

    sendBotMessage(message) {
        // Directly add the bot message to the conversation history
        console.log(`Bot sending message: ${message}`);  // Debugging line
        this.addToConversationHistory(message, 'bot');
        this.updateChatUI();
    }

    // not sure if this relevant
    setNames(botName, userName) {
        if (botName) {
            this.botName = botName;
        }
        if (userName) {
            this.userName = userName;
        }
        // Optionally, update the UI to reflect the new names
        console.log(`Bot name set to: ${this.botName}, User name set to: ${this.userName}`);
        this.updateChatUI();
    }

    isValidInput(input) {
        if (!input.trim()) {
            this.logInvalidInput('Please enter a message.');
            return { isValid: false, message: 'Please enter a message.' };
        }
    
        const allowedTextRegex = /^[a-zA-Z0-9\+\-\/\*=%&@\s"'\(\)]+$/;
        if (!allowedTextRegex.test(input)) {
            this.logInvalidInput('Input contains invalid characters. Allowed characters: letters, numbers, and special characters (+, -, /, *, =, %, &, @, space, "", \'\', (, )).');
            return { isValid: false, message: 'Input contains invalid characters. Allowed characters: letters, numbers, and special characters (+, -, /, *, =, %, &, @, space, "", \'\', (, )).' };
        }
    
        return { isValid: true, message: '' };
    }

    logInvalidInput(message) {
        this.addToConversationHistory(message, 'bot');
        this.updateChatUI();
    }

    // Here update with different logic for name
    sendMessage(userInput, isBotMessage = false) {
        console.log(`Sending message: ${userInput}`);
        if (!isBotMessage) {
            const validationResponse = this.isValidInput(userInput);
            if (!validationResponse.isValid) {
                this.logErrorToServer('Input Validation', validationResponse.message);
                return;
            }
        }
    
        this.addToConversationHistory(userInput, 'user');
        this.sendToServer(userInput);
    }

    /* sendToServer(message) {
        console.log(`Sending message to server: ${message}`);
        fetch('/sendMessage', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ message })
        })
        .then(response => this.handleServerResponse(response))
        .catch(error => {
            this.logErrorToServer('Server Communication', error.toString());
            this.addToConversationHistory('Error communicating with the server. Please try again later.', 'bot');
        });
    } */

    sendToServer(message) {
        console.log(`Sending message to server: ${message}`);
        fetch('/sendMessage', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ message })
        })
        .then(response => {
            if (!response.ok) {
                throw new Error(`Server responded with status: ${response.status}`);
            }
            return response.json();  // Ensure this returns a promise of the parsed JSON data
        })
        .then(data => this.handleServerResponse(data))  // Pass the actual data to handleServerResponse
        .catch(error => {
            console.error('Error communicating with server:', error);
            this.logErrorToServer('Server Communication', error.toString());
            this.addToConversationHistory('Error communicating with the server. Please try again later.', 'bot');
            this.updateChatUI();
        });
    }
    

    // here is where should be names updated or logic added to method
    handleServerResponse(data) {
        console.log('Server response data:', data);
    
        // Immediately add a 'thinking' indicator in the conversation history
        this.addToConversationHistory('...', 'bot');
    
        // Introduce a delay to simulate the bot 'thinking' before responding
        setTimeout(() => {
            // Remove the 'thinking' indicator from the conversation history
            this.conversationHistory.pop();
    
            const intent = data.intent; // Use the intent from the data
            const entities = data.entities; // Use the entities from the data
    
            console.log(`Received intent: ${intent}, with entities:`, entities);
    
            if (intent === 'userName.userNameProvided' && entities.userName) {
                this.userName = entities.userName; // Update userName based on the entity
            } else if (intent === 'botName.userNamesBot' && entities.botName) {
                this.botName = entities.botName; // Update botName based on the entity
            }
    
            // Add the bot's actual response to the conversation history and update the chat UI
            const message = data.answer || "I'm not sure how to respond to that.";
            this.addToConversationHistory(message, 'bot');
            this.updateChatUI();
        }, 1000); // Adjust this delay as needed
    }
    
    logErrorToServer(where, errorMsg) {
        fetch('/logError', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ where: where, error: errorMsg })
        });
    }
    

    backendCall(userInput) {
        this.performFetch('/sendMessage', { message: userInput })
            .then(data => {
                this.conversationHistory.pop(); // Remove 'typing...' message
                this.addToConversationHistory(data.response, 'bot');
            })
            .catch(error => {
                this.logErrorToServer('backendCall', error.toString());
                this.conversationHistory.pop(); // Remove 'typing...' message in case of error
            });
    }
    
    async performFetch(url, data) {
        const response = await fetch(url, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data)
        });
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        return await response.json();
    }

    receiveMessage(response) {
        // Logic to receive message from Flask and update messages array
        if(response){
            this.addToConversationHistory(response, 'bot');
        }
        
    }

    //  Maintain Conversation History with correct name
    addToConversationHistory(message, sender) {
        console.log(`Adding to history: ${message} by ${sender}`);
        if (!this.isDuplicateMessage(message, sender)) {
            const senderName = sender === 'bot' ? this.botName : this.userName;
            const messageObject = {
                sender: senderName,
                message: message,
                timestamp: new Date().toISOString()
            };
            this.conversationHistory.push(messageObject);
            this.logConversationHistory(message, sender);
            this.updateChatUI();
        }
    }
    
    isDuplicateMessage(message, sender) {
        const lastMessage = this.conversationHistory.slice(-1)[0]; // Get the last message from the history
        if (lastMessage) {
            // Check if the last message content and sender match the current message and sender
            return lastMessage.message === message && lastMessage.sender === sender;
        }
        return false; // If there's no last message, it cannot be a duplicate
    }

    // make sure it registers correct name into logging
    logConversationHistory(sender, message) {
        if (message === '...') return;
        // Ensure both 'sender' and 'message' are included in the payload
        const payload = {
            sender: sender === 'bot' ? this.botName : this.userName,
            message: message,
            botName: this.botName,  // Include botName in the payload
            userName: this.userName // Include userName in the payload
        };
    
        fetch('/logConversation', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload)
        })
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.json();
        })
        .then(data => console.log(data))
        .catch(error => console.error('Error logging conversation:', error));
    }
    
    // here changing user name and bot name
    updateChatUI() {
        const chatLog = document.getElementById('chat-log');
        if (!chatLog) return;
    
        chatLog.innerHTML = this.conversationHistory.map(messageObject =>
            `<div class="${messageObject.sender === 'Bot' ? 'bot' : 'user'}-message">
                <strong>${messageObject.sender}</strong>: ${messageObject.message}
            </div>`
        ).join('');
    
        chatLog.scrollTop = chatLog.scrollHeight; // Scroll to the latest message
    }

    
}


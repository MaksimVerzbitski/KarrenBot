class Chatbot {
    constructor() {
        this.conversationHistory = [];
    
        this.messages = [];

        this.expectingBotName = false;
        this.expectingUserName = false;
        this.botName = 'Bot'; // Default bot name
        this.userName = 'User'; // Default user name
    }

    

    // not sure if this relevant
    setNames(botName, userName) {
        if (botName) {
            this.botName = botName;
        }
        if (userName) {
            this.userName = userName;
        }
        // TODO update the UI  new names
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
        this.addToConversationHistory(this.botName, message);
        this.updateChatUI();
    }

    // update with different logic for name
    sendMessage(userInput, sender) {
        console.log(`Sending message: ${userInput}`);
    
        const validationResponse = this.isValidInput(userInput);
        if (!validationResponse.isValid) {
            this.logErrorToServer('Input Validation', validationResponse.message);
            return;
        }
        
        this.addToConversationHistory(userInput, sender);
        this.sendToServer(userInput);
    }



    sendToServer(message) {
        console.log(`Sending message to server: ${message}`);
        fetch('/sendMessage', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ message })
        })
        .then(response => {
            if (!response.ok) {
                throw new Error(`Server responded with status: ` , response);
                // throw new Error(`Server responded with status: ${response.status}`);
            }
            return response.json();  // promise of the parsed JSON data
        })
        .then(data => this.handleServerResponse(data))  // Pass the actual data to handleServerResponse
        .catch(error => {
            console.error('Error communicating with server:', error);
            this.logErrorToServer('Server Communication', error.toString());
            this.addToConversationHistory('Error communicating with the server. Please try again later.', this.botName);
            this.updateChatUI();
        });
    }
    

    
    handleServerResponse(data) {
        console.log('Server response data:', data);
        
        //'thinking' indicator 
        this.addToConversationHistory('...', this.botName);
        this.updateChatUI();

        // Random delay between 1 to 3 seconds
        const thinkingDelay = Math.floor(Math.random() * (3000 - 1000 + 1) + 1000);

        // After  delay, show  response
        setTimeout(() => {

            this.conversationHistory = this.conversationHistory.filter(
                messageObj => messageObj.message !== '...'
            );
            
            //NLP answer or  default response
            const botMessage = data.answer || "I'm not sure how to respond to that.";

            // bot's  response => conversation history
            this.addToConversationHistory(botMessage, this.botName);
            this.updateChatUI();
        }, thinkingDelay);
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
                this.conversationHistory.pop(); 
                this.addToConversationHistory(data.response, 'Bot');
            })
            .catch(error => {
                this.logErrorToServer('backendCall', error.toString());
                this.conversationHistory.pop(); 
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
        // NB! => Mystery = Logic to receive message from Flask and update messages array
        if(response){
            this.addToConversationHistory(this.botName , response );
        }
        
    }

    //Conversation History with correct name
    addToConversationHistory(message, sender) {
        const lastMessage = this.conversationHistory.slice(-1)[0];
        if (lastMessage && lastMessage.message === message && lastMessage.sender === sender) {
            console.log("Duplicate message detected, not adding to history.");
            return; // Prevent  duplicate 
        }
        const messageObject = {
            sender: sender,
            message: message,
            timestamp: new Date().toISOString()
        };
        this.conversationHistory.push(messageObject);
        this.updateChatUI();
    }
    
    isDuplicateMessage(message, sender) {
        const lastMessage = this.conversationHistory.slice(-1)[0]; // last message from the history
        if (lastMessage) {
            // if last message value and sender match CURRENT message and sender
            return lastMessage.message === message && lastMessage.sender === sender;
        }
        return false; // 
    }

    // make sure  correct name into logging
    logConversationHistory(message, sender) {
        if (message === '...') {
            console.log("Skipping logging for thinking indicator.");
            return; 
        }
    
        const payload = {
            sender: sender === 'Bot' ? this.botName : this.userName,
            message: message,
            botName: this.botName, 
            userName: this.userName 
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
        .then(data => console.log(`Logged: ${data}`))
        .catch(error => console.error('Error logging conversation:', error));
    }
    
    
    updateChatUI() {
        const chatLog = document.getElementById('chat-log');
        if (!chatLog) return;
    
        chatLog.innerHTML = this.conversationHistory.map(messageObject => {
            const senderClass = messageObject.sender === this.botName ? 'bot-message' : 'user-message';
            return `<div class="${senderClass}">
                        <strong>${messageObject.sender}</strong>: ${messageObject.message}
                    </div>`;
        }).join('');
    
        chatLog.scrollTop = chatLog.scrollHeight; // latest message
    }

    

}


class Chatbot {
    constructor() {
        this.conversationHistory = [];
    
        this.messages = [];

        this.botName = localStorage.getItem('botName') || 'Bot'; 
        this.userName = localStorage.getItem('userName') || 'User'; 
        this.updateChatUI(); // Update UI on initialization to reflect stored names
    }

    setNames(botName, userName) {
        let updated = false;
        if (botName && this.botName !== botName) {
            this.botName = botName;
            console.log(`Bot name set to: ${this.botName}`);
            updated = true;
        }
        if (userName && this.userName !== userName) {
            this.userName = userName;
            console.log(`User name set to: ${this.userName}`);
            updated = true;
        }
        if (updated) {
            this.updateChatUI();  // Ensure the UI is updated only if there was a change
        }
    }

    updateNamesOnServer(botName, userName) {
        fetch('/setNames', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ botName, userName })
        })
        .then(response => response.json())
        .then(data => {
            console.log('Names updated on server:', data);
        })
        .catch(error => {
            console.error('Failed to update names on server:', error);
        });
    }

    isValidInput(input) {
        if (!input.trim()) {
            this.logInvalidInput('Please enter a message.');
            return { isValid: false, message: 'Please enter a message.' };
        }
    
        // Updated regex to include ?, !
        const allowedTextRegex = /^[a-zA-Z0-9\+\-\/\*=%&@\s"'\(\)?!]+$/;
        if (!allowedTextRegex.test(input)) {
            this.logInvalidInput('Input contains invalid characters. Allowed characters: letters, numbers, and special characters (+, -, /, *, =, %, &, @, space, "", \'\', (, ), ?, !).');
            return { isValid: false, message: 'Input contains invalid characters. Allowed characters: letters, numbers, and special characters (+, -, /, *, =, %, &, @, space, "", \'\', (, ), ?, !).' };
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
    
        // Update the names only if necessary
        if (data.userName && this.userName !== data.userName) {
            this.userName = data.userName;
            console.log(`User name updated to: ${this.userName}`);
        }
        if (data.botName && this.botName !== data.botName) {
            this.botName = data.botName;
            console.log(`Bot name updated to: ${this.botName}`);
        }
    
        // Update UI after setting names
        this.updateChatUI();
    
        // Process the rest of the response
        const thinkingDelay = Math.floor(Math.random() * 2000 + 1000);
        setTimeout(() => {
            const botMessage = data.answer || "I'm not sure how to respond to that.";
            this.addToConversationHistory(botMessage, this.botName);
            this.updateChatUI();
        }, thinkingDelay);
    }
    
    
    logErrorToServer(where, errorMsg) {
        console.error('Error from ' + where + ':', errorMsg); // Log to console for immediate feedback
        fetch('/logError', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ where, error: errorMsg })
        }).catch(error => {
            console.error('Failed to log error to server:', error);
            // Optionally handle failed logging => redirection
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
            const senderName = messageObject.sender === 'User' ? this.userName : this.botName;
            const senderClass = messageObject.sender === 'User' ? 'user-message' : 'bot-message';
            return `<div class="${senderClass}">
                        <strong class="sender-name">${senderName}</strong>: ${messageObject.message}
                    </div>`;
        }).join('');
        chatLog.scrollTop = chatLog.scrollHeight;
    }

    updateBotName(newName) {
        fetch('/updateBotName', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ newBotName: newName })
        })
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                // Assume the bot's name can appear multiple times and needs to be updated everywhere
                const nameElements = document.querySelectorAll('.sender-name.bot');
                nameElements.forEach(element => {
                    element.textContent = data.botName; // Update all elements with the new name
                });
    
                // Optionally, update the global botName if stored and used elsewhere in your application
                this.botName = data.botName;
            } else {
                console.error('Failed to update bot name');
            }
        })
        .catch(error => console.error('Error updating bot name:', error));
    }
    
}
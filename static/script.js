class Chatbot {
    constructor() {
        this.conversationHistory = [];
    
        this.messages = [];

        this.botName = localStorage.getItem('botName') || 'Bot'; 
        this.userName = localStorage.getItem('userName') || 'User'; 

        console.log('Initial Bot Name:', this.botName);
        console.log('Initial User Name:', this.userName);
        
        this.updateChatUI(); // Update UI on stored names
    }

    /* setNames(botName, userName) {
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
            this.updateChatUI();  //  UI is updated only if there was a change
        }
    } */

    loadFromJSON(key) {
        const data = localStorage.getItem(key);
        return data ? JSON.parse(data) : null;
    }

    saveToJSON(key, value) {
        localStorage.setItem(key, JSON.stringify(value));
    }

    setNames(botName, userName) {
        let updated = false;
        if (botName && this.botName !== botName) {
            this.botName = botName;
            this.saveToJSON('botName', botName); // Store in local storage
            console.log(`Bot name set to: ${this.botName}`);
            updated = true;
        }
        if (userName && this.userName !== userName) {
            this.userName = userName;
            this.saveToJSON('userName', userName); // Store in local storage
            console.log(`User name set to: ${this.userName}`);
            updated = true;
        }
        if (updated) {
            this.updateChatUI();  
            this.updateNamesOnServer(botName, userName);
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
            this.logErrorToServer('Name Update', error.toString());
        });
    }

    isValidInput(input) {
        const allowedTextRegex = /^[a-zA-Z0-9\+\-\/\*=%&@\s"'\(\)?!😊😂😍😢😡👍🙏🎉❤️💔]+$/;
        if (!allowedTextRegex.test(input)) {
            const message = 'Input contains invalid characters. Allowed characters: letters, numbers, and special characters (+, -, /, *, =, %, &, @, space, "", \'\', (, ), ?, !), and smileys (😊, 😂, 😍, 😢, 😡, 👍, 🙏, 🎉, ❤️, 💔).';
            this.logInvalidInput(message, input);
            return { isValid: false, message };
        }

        return { isValid: true, message: '' };
    }

    logInvalidInput(message, input) {
        const errorMessage = `NB! ${this.userName} => ${message} | Input: "${input}"`;
        this.addToConversationHistory(errorMessage, this.botName);
        this.updateChatUI();
    }


   

    sendMessage(userInput, sender) {
        console.log(`Sending message: ${userInput}`);

        // Add user's message to the conversation history first
        this.addToConversationHistory(userInput, sender);

        // Validate the input and log an error if invalid
        if (!this.isValidInput(userInput)) {
            this.logInvalidInput(userInput);
            return;
        }

        // If valid, send to server
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
    
    
    /* logErrorToServer(where, errorMsg) {
        const timestamp = new Date().toISOString();
        const payload = {
            timestamp,
            where,
            error: errorMsg,
            botName: this.botName,
            userName: this.userName
        };
        console.error(`[${timestamp}] Error in ${where}: ${errorMsg}`);

        fetch('/logError', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload)
        }).catch(error => {
            console.error('Failed to log error to server:', error);
        });
    } */

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

    // Conversation History with correct name
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
                const nameElements = document.querySelectorAll('.sender-name.bot');
                nameElements.forEach(element => {
                    element.textContent = data.botName; 
                });
                this.botName = data.botName;
            } else {
                console.error('Failed to update bot name');
            }
        })
        .catch(error => console.error('Error updating bot name:', error));
    }
    
}
class ServerChatbot {
    constructor() {
        this.userName = 'Guest';
        this.botName = 'Bot';
        this.knownNames = [];
    }

    setUserName(name) {
        if (name && this.userName !== name) {
            this.userName = name;
            console.log(`User name updated to: ${this.userName}`);
            
        }
    }

    setBotName(name) {
        if (name && this.botName !== name) {
            this.botName = name;
            console.log(`Bot name updated to: ${this.botName}`);
            
        }
    }

    addKnownName(name) {
        if (!this.knownNames.includes(name)) {
            this.knownNames.push(name);
        }
    }

    askForNameDetails(name) {
        // This method could emit an event or call a function to ask the user for more details
        console.log(`Asking for more details about the name: ${name}`);
    }
}

module.exports = ServerChatbot;


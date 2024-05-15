class ServerChatbot {
    constructor() {
        this.userName = 'Guest';
        this.botName = 'Bot';
    }

    setUserName(name) {
        if (name && this.userName !== name) {
            this.userName = name;
            console.log(`User name updated to: ${this.userName}`);
            // Trigger or log backend event if necessary
        }
    }

    setBotName(name) {
        if (name && this.botName !== name) {
            this.botName = name;
            console.log(`Bot name updated to: ${this.botName}`);
            // Trigger or log backend event if necessary
        }
    }
}

module.exports = ServerChatbot;

/* class ServerChatbot {
    constructor() {
        this.userName = null;  // Changed from 'Guest' to null for checking if set
        this.botName = 'Bot';  // Default bot name remains
    }

    setUserName(name) {
        if (!this.userName) {  // Only allow setting if not already set
            this.userName = name;
            console.log(`Username set to: ${this.userName}`);
        } else {
            console.log("Attempt to set username again blocked.");
        }
    }

    setBotName(name) {
        this.botName = name;
        console.log(`Bot name set to: ${this.botName}`);
    }

    handleNameResponse(response) {
        let answer = "I'm not sure how to respond to that.";
        if (response.entities.person) {
            if (!this.userName) {
                this.setUserName(response.entities.person);
                answer = `Hello ${this.userName}, how can I help you today?`;
            } else {
                answer = "Name already set. To change it, please use the reset command.";
            }
        }

        if (response.entities.botName) {
            this.setBotName(response.entities.botName);
            answer = `My name is now ${this.botName}. How can I assist you?`;
        }
        return answer;
    }
}

module.exports = ServerChatbot; */
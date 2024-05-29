class ServerChatbot {
    constructor() {
        this.userName = 'Guest';
        this.botName = 'Bot';
        this.knownNames = [];
        this.userNameAlreadySet = false;
        this.waitingForNameDetails = false;
        this.unknownName = '';
        this.nameGender = '';
        this.nameOrigin = '';
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
        this.waitingForNameDetails = true;
        this.unknownName = name;
        console.log(`Asking for more details about the name: ${name}`);
        return `I don't recognize the name ${name}. Is it a Russian, Estonian, or English name? Please specify.`;
    }
}

module.exports = ServerChatbot;


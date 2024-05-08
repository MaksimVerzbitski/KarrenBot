class ServerChatbot {
    constructor() {
        this.userName = 'Guest';  // Default user name
        this.botName = 'Bot';     // Default bot name
    }

    setUserName(name) {
        this.userName = name;
        console.log(`Username set to: ${this.userName}`);
    }

    setBotName(name) {
        this.botName = name;
        console.log(`Bot name set to: ${this.botName}`);
    }
}

module.exports = ServerChatbot;
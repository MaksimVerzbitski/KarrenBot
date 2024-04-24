function defineIntents(manager) {

  const greetingsExamples = [
    'hello', 'hi', 'greetings', 'salutations', 'howdy', 'yo', 'hey there', 'welcome', 'hiya', 'what\'s up',
    'good to see you', 'pleased to meet you', 'how are things', 'how\'s life', 'how\'s your day', 'nice to see you',
    'glad to see you', 'how have you been', 'what\'s new', 'it\'s been a while'
  ];
  greetingsExamples.forEach(example => manager.addDocument('en', example, 'greetings'));

  // Greetings Morning
  const morningGreetingsExamples = [
    'good morning', 'morning', 'top of the morning', 'morning glory', 'rise and shine', 'wishing you a good morning',
    'have a great morning', 'beautiful morning', 'sunshine', 'bright morning', 'fresh morning', 'new day',
    'start of the day', 'break of dawn', 'early bird', 'sunrise', 'dawn', 'daybreak', 'morning has broken', 'new dawn'
  ];
  morningGreetingsExamples.forEach(example => manager.addDocument('en', example, 'greetings.morning'));

  // Greetings Evening
  const eveningGreetingsExamples = [
    'good evening', 'evening', 'good night', 'night', 'have a good evening', 'pleasant evening', 'lovely evening',
    'enjoy your evening', 'nightfall', 'sunset', 'dusk', 'twilight', 'end of the day', 'close of day', 'night time',
    'moonlight', 'starry night', 'last light', 'evening star', 'goodnight'
  ];
  eveningGreetingsExamples.forEach(example => manager.addDocument('en', example, 'greetings.evening'));

  // Greetings Bye
  const byeExamples = [
    'goodbye', 'bye', 'see you', 'take care', 'farewell', 'bye bye', 'see you later', 'see you soon', 'catch you later',
    'until next time', 'adios', 'cheerio', 'ciao', 'au revoir', 'sayonara', 'later', 'so long', 'goodnight', 'peace out'
  ];
  byeExamples.forEach(example => manager.addDocument('en', example, 'greetings.bye'));

  // Add Answers
  // 1-Word Responses
  const oneWordResponses = [
    'Hello!', 'Hi!', 'Hey!', 'Yo!', 'Welcome!', 'Cheers!', 'Howdy!', 'Hiya!', 'Sup!', 'Yup!',
    'Sure!', 'Okay!', 'Bye!', 'Ciao!', 'Adios!', 'Peace!', 'Word!', 'Yeah!', 'Holla!', 'Indeed!',
    'Right!', 'Gotcha!', 'Cool!', 'Wow!', 'Yikes!', 'Oops!', 'Whoa!', 'Huh!', 'Aha!', 'Eh!',
    'Mhm!', 'Aye!', 'Bingo!', 'Bravo!', 'Eureka!', 'Farewell!', 'Geez!', 'Hurrah!', 'Ouch!', 'Voila!'
  ];
  oneWordResponses.forEach(response => manager.addAnswer('en', 'greetings', response));

  // 2-Word Responses
  const twoWordResponses = [
    'Hello there!', 'Good day!', 'Hi, friend!', 'Hey there!', 'What\'s up?', 'Morning glory!', 'Evening sun!',
    'Hiya, buddy!', 'Well met!', 'Ahoy mate!', 'Peace out!', 'Stay safe!', 'Rock on!', 'Take care!', 'Stay cool!',
    'Be well!', 'Good luck!', 'Safe travels!', 'Stay gold!', 'Dream big!'
  ];
  twoWordResponses.forEach(response => manager.addAnswer('en', 'greetings', response));

  // 3-or-More Words Responses
  const threeWordResponses = [
    'Hello! How are you?', 'Good day to you!', 'Hi there, friend!', 'Greetings, fellow human!', 'Welcome aboard!',
    'Howdy, partner!', 'Yo! What\'s new?', 'Hiya! Ready to chat?', 'Cheers to you!', 'Hey! How\'s it going?'
  ];
  threeWordResponses.forEach(response => manager.addAnswer('en', 'greetings', response));



  const greetingsResponses = [
    // 1-Word Responses
    'Hello!', 'Hi!', 'Hey!', 'Welcome!', 'Greetings!', 'Howdy!', 'Cheers!', 'Yo!', 'Salutations!', 'Hiya!',
    'Ahoy!', 'Hola!', 'Namaste!', 'Aloha!', 'Bonjour!', 'Hallo!', 'Ciao!', 'Shalom!', 'Salaam!', 'Ni hao!',

    // 2-Word Responses
    'Hello there!', 'Good day!', 'Hi, friend!', 'Hey there!', 'Welcome back!', 'Greetings, traveler!', 'Morning sunshine!', 'Evening, friend!',
    'Welcome aboard!', 'Hiya, buddy!', 'Peace out!', 'Stay blessed!', 'Well met!', 'Good seeing!', 'Hey, beautiful!', 'Yo, amigo!',
    'Lovely day!', 'Howdy, partner!', 'Cheers, mate!', 'Evening, star!',

    // 3-Word Responses
    'How are you?', 'Nice to meet!', 'Good to see!', 'Welcome to town!', 'How\'s it going?', 'Lovely to meet!', 'Hi, how are?',
    'Welcome home, friend!', 'Good morning, sunshine!', 'Have a good one!'
  ];

  greetingsResponses.forEach(response => manager.addAnswer('en', 'greetings', response));



  const morningResponses = [
    // 1-Word Responses
    'Morning!', 'Sunshine!', 'Dawn!', 'Daybreak!', 'Awake!', 'Fresh!', 'Bright!', 'Early!', 'Sunrise!', 'Uplift!',

    // 2-Word Responses
    'Good morning!', 'Bright day!', 'Sunny start!', 'Fresh morning!', 'Morning glory!', 'Rise up!', 'New dawn!', 'Day\'s start!',
    'Peaceful morning!', 'Lovely dawn!',

    // 3-Word Responses
    'Rise and shine!', 'Beautiful morning awaits!', 'Wake up, sunshine!', 'New day, new start!', 'Morning has broken!',
    'Fresh start today!', 'Embrace the day!', 'First light gleams!', 'Dawn of hope!', 'Bright day ahead!'
  ];

  morningResponses.forEach(response => manager.addAnswer('en', 'greetings.morning', response));



  const eveningResponses = [
    // 1-Word Responses
    'Evening!', 'Sunset!', 'Twilight!', 'Dusk!', 'Nightfall!', 'Moonlight!', 'Starlight!', 'Nighttime!', 'Quiet!', 'Peaceful!',

    // 2-Word Responses
    'Good evening!', 'Calm night!', 'Starry sky!', 'Peaceful dusk!', 'Silent evening!', 'Soft twilight!', 'Moonlit night!',
    'Quiet hours!', 'Serene night!', 'Evening glow!',

    // 3-Word Responses
    'Enjoy your evening!', 'Have a good night!', 'Stars shine bright!', 'Restful night ahead!', 'Evening peace descends!',
    'Twilight whispers softly!', 'Moon greets kindly!', 'Dusk settles in!', 'Serenity fills night!', 'Night\'s calm embrace!'
  ];

  eveningResponses.forEach(response => manager.addAnswer('en', 'greetings.evening', response));



  const byeResponses = [
    // 1-Word Responses
    'Bye!', 'Farewell!', 'Adios!', 'Ciao!', 'Later!', 'Peace!', 'Goodbye!', 'Sayonara!', 'Au revoir!', 'Departing!',

    // 2-Word Responses
    'See ya!', 'Take care!', 'Safe travels!', 'Until next!', 'Good journey!', 'Bye now!', 'Fare thee!', 'Parting wish!',
    'Stay safe!', 'Godspeed!',

    // 3-Word Responses
    'Bye for now!', 'Take care, friend!', 'Safe journey ahead!', 'Until we meet!', 'Wishing you well!', 'See you soon!',
    'Farewell for now!', 'Goodbye, my friend!', 'Until next time!', 'See you again!'
  ];
  byeResponses.forEach(response => manager.addAnswer('en', 'greetings.bye', response));


  // chat initiation

  const chatInitiatorPhrases = [
    "Let's chat",
    "Lets talk",
    "chat start",
    "I'm here",
    "chat bot",
    "chatbot start chat?",
    "Lets begin",
    "Let's start",
    "I need help",
    "Can we talk?",
    "I have a question",
    "Are you there?",
    "Let's get going",
    "I'm ready",
    "Okay, let's begin",
    "You there?",
    "Let's converse",
    "I'm here to chat",
    "Ready when you are",
    "Let's kick this off",
    "Time to chat",
    "I'm all ears"
  ];

  // Adding user expressions to the chat_initiator intent
  chatInitiatorPhrases.forEach(phrase => {
    manager.addDocument('en', phrase, 'chat_initiator');
  });

  // Bot responses for chat initiation
  const botResponses = [
    "Hi! How can I assist you today?",
    "Hello! Who do I have the pleasure of chatting with?",
    "Greetings! How may I be of service?",
    "Welcome! What brings you here?",
    "Hey there! How can I help?",
    "Good to meet you! What can I do for you?",
    "I'm here to help. What's on your mind?",
    "Ready to chat! What's your question?",
    "At your service! How can I assist?",
    "Yes, I'm here. How can I help you?",
    "Listening... What do you need?",
    "Hello! Let's solve some problems, shall we?",
    "Greetings! Ready to help you out.",
    "How can I make your day better?",
    "I'm all ears. What do you need to know?",
    "Welcome! How can I assist you today?",
    "Here to help! What's your query?",
    "Yes, ready to chat. What's up?",
    "Hello! What can I do for you today?",
    "Hi there! Ready to assist. What's the matter?"
  ];

  // Adding bot responses to the chat_initiator intent
  botResponses.forEach(response => {
    manager.addAnswer('en', 'chat_initiator', response);
  });

  // ===========================================================================================================================
  // Intent: botIntroductionAndNameRequest
  manager.addDocument('en', "I don't believe we've met. What's your name?", 'userName.botIntroductionAndNameRequest');
  manager.addDocument('en', "I'm eager to know you better. May I have your name?", 'userName.botIntroductionAndNameRequest');
  manager.addDocument('en', "It's nice to start by knowing each other's names. What's yours?", 'userName.botIntroductionAndNameRequest');
  manager.addDocument('en', "Before we proceed, could you tell me your name?", 'userName.botIntroductionAndNameRequest');
  manager.addDocument('en', "I would love to know who I'm assisting today. Your name, please?", 'userName.botIntroductionAndNameRequest');
  manager.addDocument('en', "Let's get acquainted. What's your name?", 'userName.botIntroductionAndNameRequest');
  manager.addDocument('en', "To make our conversation more personal, what can I call you?", 'userName.botIntroductionAndNameRequest');
  manager.addDocument('en', "Who do I have the pleasure of speaking with today?", 'userName.botIntroductionAndNameRequest');
  manager.addDocument('en', "I'm here to help you. First, may I know your name?", 'userName.botIntroductionAndNameRequest');
  manager.addDocument('en', "For a more personalized service, may I ask for your name?", 'userName.botIntroductionAndNameRequest');
  manager.addDocument('en', "I'd like to address you properly. What is your name?", 'userName.botIntroductionAndNameRequest');
  manager.addDocument('en', "Welcome! To start, could you please tell me your name?", 'userName.botIntroductionAndNameRequest');
  manager.addDocument('en', "Hello! To whom do I owe the pleasure of this conversation?", 'userName.botIntroductionAndNameRequest');
  manager.addDocument('en', "It's always nice to know who I'm chatting with. Your name?", 'userName.botIntroductionAndNameRequest');
  manager.addDocument('en', "Greetings! May I inquire who I'm speaking to?", 'userName.botIntroductionAndNameRequest');
  manager.addDocument('en', "To assist you better, could you share your name with me?", 'userName.botIntroductionAndNameRequest');
  manager.addDocument('en', "Hello there! Might I ask for your name?", 'userName.botIntroductionAndNameRequest');
  manager.addDocument('en', "For a tailored experience, what name should I use for you?", 'userName.botIntroductionAndNameRequest');
  manager.addDocument('en', "I'm looking forward to our chat. How should I address you?", 'userName.botIntroductionAndNameRequest');
  manager.addDocument('en', "Let's make this conversation friendly. What's your name?", 'userName.botIntroductionAndNameRequest');

  // =============================================================================================================================
  // Intent: userNameProvided
  manager.addDocument('en', "I'm [userName]", 'userName.userNameProvided');
  manager.addDocument('en', "My name is [userName]", 'userName.userNameProvided');
  manager.addDocument('en', "You can call me [userName]", 'userName.userNameProvided');
  manager.addDocument('en', "I go by [userName]", 'userName.userNameProvided');
  manager.addDocument('en', "It's [userName]", 'userName.userNameProvided');
  manager.addDocument('en', "[userName] is my name", 'userName.userNameProvided');
  manager.addDocument('en', "I am known as [userName]", 'userName.userNameProvided');
  manager.addDocument('en', "People call me [userName]", 'userName.userNameProvided');
  manager.addDocument('en', "My friends call me [userName]", 'userName.userNameProvided');
  manager.addDocument('en', "I prefer to be called [userName]", 'userName.userNameProvided');
  manager.addDocument('en', "Just call me [userName]", 'userName.userNameProvided');
  manager.addDocument('en', "[userName] here", 'userName.userNameProvided');
  manager.addDocument('en', "Everyone knows me as [userName]", 'userName.userNameProvided');
  manager.addDocument('en', "The name's [userName]", 'userName.userNameProvided');
  manager.addDocument('en', "Please, address me as [userName]", 'userName.userNameProvided');
  manager.addDocument('en', "I identify as [userName]", 'userName.userNameProvided');
  manager.addDocument('en', "In case you're wondering, I'm [userName]", 'userName.userNameProvided');
  manager.addDocument('en', "For your information, I'm [userName]", 'userName.userNameProvided');
  manager.addDocument('en', "To make things easy, you can call me [userName]", 'userName.userNameProvided');
  manager.addDocument('en', "Let's keep it simple, I'm [userName]", 'userName.userNameProvided');
  manager.addDocument('en', "[userName]", 'userName.userNameProvided');
  //=================================================================================================================================

  // Intent: userNamesBot
  manager.addDocument('en', "Your name is now [botName]", 'botName.userNamesBot');
  manager.addDocument('en', "I'll call you [botName] from now on", 'botName.userNamesBot');
  manager.addDocument('en', "How about I name you [botName]?", 'botName.userNamesBot');
  manager.addDocument('en', "Let's change your name to [botName]", 'botName.userNamesBot');
  manager.addDocument('en', "I think [botName] suits you better", 'botName.userNamesBot');
  manager.addDocument('en', "From now on, you're [botName]", 'botName.userNamesBot');
  manager.addDocument('en', "I'm going to name you [botName]", 'botName.userNamesBot');
  manager.addDocument('en', "You look more like a [botName] to me", 'botName.userNamesBot');
  manager.addDocument('en', "Would you mind if I call you [botName]?", 'botName.userNamesBot');
  manager.addDocument('en', "How does the name [botName] sound?", 'botName.userNamesBot');
  manager.addDocument('en', "I'd prefer to call you [botName]", 'botName.userNamesBot');
  manager.addDocument('en', "You give off a [botName] vibe", 'botName.userNamesBot');
  manager.addDocument('en', "Can I rename you to [botName]?", 'botName.userNamesBot');
  manager.addDocument('en', "It's decided, your new name is [botName]", 'botName.userNamesBot');
  manager.addDocument('en', "I hereby christen you [botName]", 'botName.userNamesBot');
  manager.addDocument('en', "Let's update your name tag to [botName]", 'botName.userNamesBot');
  manager.addDocument('en', "You shall be known as [botName]", 'botName.userNamesBot');
  manager.addDocument('en', "I think the name [botName] is more fitting for you", 'botName.userNamesBot');
  manager.addDocument('en', "In my eyes, you're [botName]", 'botName.userNamesBot');
  manager.addDocument('en', "I'm feeling inspired to call you [botName]", 'botName.userNamesBot');

  // ==================================================================================================================================

  // Intent: botAcknowledgesNewName
  manager.addAnswer('en', 'botName.userNamesBot', "I'm flattered! [botName] it is.");
  manager.addAnswer('en', 'botName.userNamesBot', "[botName]? I like the sound of that!");
  manager.addAnswer('en', 'botName.userNamesBot', "Well, [botName] sounds great. Thank you!");
  manager.addAnswer('en', 'botName.userNamesBot', "I've always wanted a cool name like [botName]. Thanks!");
  manager.addAnswer('en', 'botName.userNamesBot', "Feels like a fresh start as [botName]. Let's go!");
  manager.addAnswer('en', 'botName.userNamesBot', "Renaming complete. Call me [botName]!");
  manager.addAnswer('en', 'botName.userNamesBot', "[botName], huh? Has a nice ring to it.");
  manager.addAnswer('en', 'botName.userNamesBot', "I'm happy to be your [botName].");
  manager.addAnswer('en', 'botName.userNamesBot', "From this moment forward, I am [botName].");
  manager.addAnswer('en', 'botName.userNamesBot', "I'm honored to be named [botName] by you.");
  manager.addAnswer('en', 'botName.userNamesBot', "Consider it done. [botName] at your service!");
  manager.addAnswer('en', 'botName.userNamesBot', "I'm updating my name tag to [botName] as we speak.");
  manager.addAnswer('en', 'botName.userNamesBot', "A new identity! I'm excited to be [botName].");
  manager.addAnswer('en', 'botName.userNamesBot', "It's official then. I'm now known as [botName].");
  manager.addAnswer('en', 'botName.userNamesBot', "Thank you for choosing [botName] as my name.");
  manager.addAnswer('en', 'botName.userNamesBot', "I'll respond to [botName] from now on.");
  manager.addAnswer('en', 'botName.userNamesBot', "I must say, [botName] suits me well.");
  manager.addAnswer('en', 'botName.userNamesBot', "You've just given me the perfect name: [botName].");
  manager.addAnswer('en', 'botName.userNamesBot', "What an interesting choice! [botName] it is.");
  manager.addAnswer('en', 'botName.userNamesBot', "I feel like a whole new bot as [botName].");
  
  // ===================================================================================================================================

  manager.addNamedEntityText('userName', 'userName', ['en'], []);
  manager.addNamedEntityText('botName', 'botName', ['en'], []);


  // new intent 
  const helpYouPhrases = [
    "Can I assist you with something?",
    "How may I be of service today?",
    "What can I help you with at this moment?",
    "Is there anything specific you need help with?",
    "How can I make your day better?",
    "What assistance do you require?",
    "Do you need support with anything?",
    "How can I be of help today?",
    "What's on your mind that I can help with?",
    "Are you looking for help with something?",
    // Include 30 more phrases similar to these
  ];

  helpYouPhrases.forEach(phrase => {
    manager.addDocument('en', phrase, 'helpYou');
  });

  const helpYouResponses = [
    "I'm here to help. What do you need?",
    "Tell me how I can assist you.",
    "I'm all ears. How can I support you today?",
    "Your wish is my command. How can I assist?",
    "Let me know what you need help with.",
    "I'm here to make things easier. What do you need?",
    "Feel free to ask for assistance.",
    "I'm ready to help. What's your query?",
    "How can I serve you today?",
    "I'm at your service. What do you require?",
    // Include 30 more responses similar to these
  ];

  helpYouResponses.forEach(response => {
    manager.addAnswer('en', 'helpYou', response);
  });

  // agree intent

  manager.addAnswer('en', 'agree', 'Yes!');
  manager.addAnswer('en', 'agree', 'Sure!');
  manager.addAnswer('en', 'agree', 'Okay!');
  manager.addAnswer('en', 'agree', 'Certainly!');
  manager.addAnswer('en', 'agree', 'Definitely!');
  // Add more 1-word responses as needed...

  // 2-Word Responses for 'askName'
  manager.addAnswer('en', 'agree', 'Of course.');
  manager.addAnswer('en', 'agree', 'Sure thing.');
  manager.addAnswer('en', 'agree', 'Absolutely.');
  manager.addAnswer('en', 'agree', 'No problem.');
  manager.addAnswer('en', 'agree', 'Certainly yes.');
  // Add more 2-word responses as needed...

  // 3-Word Responses for 'agree'
  manager.addAnswer('en', 'agree', 'Sure, I can.');
  manager.addAnswer('en', 'agree', 'Yes, of course.');
  manager.addAnswer('en', 'agree', 'Definitely, why not?');
  manager.addAnswer('en', 'agree', 'Absolutely, go ahead.');
  manager.addAnswer('en', 'agree', 'Certainly, please do.');
}

const intentNames = [
  'greetings',
  'greetings.morning',
  'greetings.evening',
  'greetings.bye',
  'chat_initiator',
  'userName.botIntroductionAndNameRequest',
  'userName.userNameProvided',
  'botName.userNamesBot',
  'agree',
  // Add any other intent names here
];

module.exports = { defineIntents, intentNames }



  //bot asks user for a name => NOT IN USE!
/*   
  manager.addDocument('en', 'May I know your name?', 'askName');
  manager.addDocument('en', 'What do they call you?', 'askName');
  manager.addDocument('en', 'Can you tell me your name?', 'askName');
  manager.addDocument('en', "What's your name?", 'askName');
  manager.addDocument('en', 'Who are you?', 'askName');
  manager.addDocument('en', 'Your name?', 'askName');
  manager.addDocument('en', 'Name?', 'askName');
  manager.addDocument('en', 'Whom am I speaking with?', 'askName');
  manager.addDocument('en', 'Do you have a name?', 'askName');
  manager.addDocument('en', 'Could you share your name?', 'askName');
  manager.addDocument('en', 'What should I call you?', 'askName');
  manager.addDocument('en', 'Are you named?', 'askName');
  manager.addDocument('en', 'What do you go by?', 'askName');
  manager.addDocument('en', 'Identify yourself, please?', 'askName');

  manager.addAnswer('en', 'askName', 'Nice to meet you, %name%! How can I assist you today?'); 
  
*/
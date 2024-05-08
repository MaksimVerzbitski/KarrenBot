function defineIntents(manager) {
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
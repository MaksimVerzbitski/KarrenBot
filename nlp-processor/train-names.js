async function trainNames(manager){
    const namesByGenderAndLanguage = {
        'englishMasculine': [
            "Abe", "Abraham", "Adrien", "Alan", "Albemarle", "Alex", "Alexander", "Alistair", "Almon", "Alton",
            "Alvy", "Amory", "Angus", "Arnaut", "Arnie", "Arnold", "Arthur", "Artie", "Ashley", "Aulay",
            "Auley", "Auliffe", "Awley", "Banastre", "Barron", "Barry", "Barton", "Basil", "Berry", "Bert",
            "Bibb", "Bill", "Billy", "Blaze", "Borlase", "Brady", "Brainerd", "Branch", "Brandon", "Brendan",
            "Brennan", "Bret", "Brett", "Brian", "Briggs", "Brown", "Bryan", "Buell", "Burdette", "Burgess",
            "Burt", "Butler", "Cadence", "Calum", "CathalCeawlin", "Chapman", "Charles", "Charlton", "Chris", "Chrissy", "Christopher", "Chuck", "Clarrie",
            "Cleveland", "Clive", "Conn", "Connor", "Corin", "Cormac", "Courtney", "Craig", "Crane", "Dana",
            "Dane", "Daniel", "Darroll", "Dashaun", "Davin", "Davis", "Davonte", "Dayvon", "DeJuan", "DeMarcus",
            "Demario", "Deontay", "Dequan", "Derwin", "Deshaun", "DeShawn", "Dillon", "Doak", "Domenick",
            "Don", "Donald", "Donovan", "Dontay", "Dorsey", "Drake", "Duane", "Duncan", "Dylan", "Eamonn",
            "Ed", "Edmund", "Edward", "Ellis", "Elwood", "Eppa", "Eric", "Eunan", "Evelyn", "Farley",
            "Francis", "Friend", "Gardner", "Gary", "Gawen", "Gaylord", "Gladden", "Gleason", "Godfrey",
            "Gordon", "Graham", "Greg", "Greig", "Grover", "Gus", "Gyles", "Haddon", "Hamish", "Harbord",
            "Haskell", "Hatton", "Hayden", "Henry", "Herbie", "Herschel", "Hilary", "Holden", "Holt", "Horrie",
            "Hovey", "Humphrey", "Hyatt", "Ian", "Iggy", "Increase", "Jack", "James", "Jamie", "Japie",
            "Jason", "Jayden", "Jeffy", "Jemmy", "Jerry", "Jet", "Jiles", "Jim", "Jimmy", "JOC", "Joe",
            "Joey", "John", "John Paul", "Johnnie", "Johnny", "Jonny", "Jordie", "Jordy", "Joseph", "Jyles",
            "Kallen", "Kellan", "Keller", "Kelsey", "Kenneth", "Kenyon", "Kieth", "Kim", "Kip", "Kyler",
            "Lachlan", "LaDarius", "Lamar", "Laurence", "Laurie", "Lawrie", "Layton", "Lenny", "Leonard",
            "Leslie", "Lister", "Livingston", "Livingstone", "Loftus", "Lucius", "Luman", "Mal", "Mark",
            "Markeith", "Marston", "Matthew", "Maurice", "McKay", "Mel", "Melvin", "Merl", "Merton", "Mike",
            "Mikey", "Mitch", "Mitchell", "Moe", "Monroe", "Montie", "Monty", "Mordaunt", "Morrie", "Morris",
            "Morse", "Mowbray", "Mungo", "Murrell", "Nathaniel", "Nicholas", "Nolan", "Nolden", "Odell",
            "Onslow", "Oscar", "Ossian", "Oswald", "Owen", "Parry", "Paul", "Perry", "Peter Paul", "Philip",
            "Pinckney", "Pinkney", "Quinton", "Quintus", "Ralphie", "Ranald", "Randel", "Randell", "Randi",
            "Randle", "Randolf", "Randolph", "Randy", "Ranulf", "Raven", "Reginald", "Rembrandt", "Renssalaer",
            "Reverdy", "Robert", "Robin", "Roddie", "Roddy", "Rolfe", "Rollen", "Ronald", "Royal", "Rush",
            "Russ", "Salmon", "Sam", "Sawyer", "Scott", "Sean", "Searles", "Shaun", "Shawn", "Shel",
            "Skeffington", "Skyler", "Sorley", "Spence", "Spencer", "Stan", "Stanley", "Stephens", "Stevon",
            "Stratford", "Teddy", "Thomas", "Todd", "Tom", "Torquil", "Trae", "Trenton", "Tripp", "Ulick",
            "Van", "Vernon", "Victor", "Virgil", "Vivian", "Wally", "Walt", "Walton", "Wellington", "Whitfield", "Whitney", "Wilder", "Wilf",
            "William", "Willoughby", "Wilmot", "Woodruff", "Woody", "Wynton", "Zachary", "Zeb"
        ],
    
        'englishFeminine': [
            "Alyce", "Amethyst", "Amity", "Arleen", "Ashley", "Aspen", "Audra", "Ava", "Aya",
            "Babette", "Barb", "Becca", "Becky", "Bess", "Bessie", "Bette", "Breanna", "Brenda", "Brett",
            "Brianne", "Brina", "Cadence", "Camryn", "Carlena", "Carlene", "Carly", "Caroline", "Catriona",
            "Chrissie", "Chrissy", "Christiane", "Christina", "Claire", "Clarice", "Clemence", "Corin",
            "Corryn", "Coryn", "Courtney", "Dana", "Darby", "Darla", "Dawn", "DeAndrea", "Debbie",
            "Diane", "Dove", "Earlene", "Ellyse", "Elsie", "Erika", "Eve", "Evelyn", "Fabienne", "Ginny",
            "Githa", "Hayden", "Hilary", "Jacquelin", "Jamie", "Janet", "Jayden", "Jeanie", "Jodi", "Joey",
            "Johnnie", "Johnny", "Kacey", "Kacie", "Karan", "Karyn", "Karyne", "Kath", "Katy", "Kelsey",
            "Kendra", "Kim", "Kimberly", "Kirsty", "Kristen", "LaDonna", "Lainie", "Latasha", "Latisha",
            "Lenore", "Leslie", "Lexi", "Libby", "Lisabeth", "Lizette", "Lizzie", "Lucretia", "Lurleen",
            "Lurline", "Madeleine", "Madelyn", "Malvina", "Maree", "Marge", "Margo", "Marigold", "Marj",
            "Maybelle", "Mel", "Misty", "Morna", "Muriel", "Myrtle", "Naomi", "Olivia", "Oona", "Oveta",
            "Pam", "Patricia", "Penny", "Philippa", "Pleasance", "Prue", "Rachel", "Rain", "Randi", "Randy",
            "Raven", "Sadie", "Sally", "Salma", "Selma", "Serenity", "Shanelle", "Shawnee", "Siobhan", "Skyler",
            "Tabitha", "Tanith", "Taryn", "Tasha", "Terisa", "Trudy", "Ursula", "Verona", "Virginia", "Whitney", "Willa"
        ],
    
        'estonianMasculine': [
            'Aadu', 'Aapo', 'Aare', 'Aarne', 'Aarni', 'Aavo', 'Ado', 'Ago', 'Ahti', 'Aimar',
            'Ain', 'Aivar', 'Aivo', 'Aksel', 'Alar', 'Albert', 'Alfred', 'Allan', 'Allar', 'Alo',
            'Alvar', 'Ando', 'Andreas', 'Andres', 'Andrus', 'Anti', 'Anto', 'Anton', 'Ants', 'Ardo',
            'Argo', 'Armin', 'Arno', 'Arnold', 'Arto', 'Artur', 'Arved', 'Arvi', 'Arvid', 'Arvo', 'Asko', 'Ats', 'August', 'Avo', 'Bruno', 'Edgar',
            'Eduard', 'Eerik', 'Eero', 'Egon', 'Eiko', 'Einar', 'Einari', 'Eino', 'Eldur', 'Elmar',
            'Elmo', 'Emil', 'Endel', 'Enn', 'Enno', 'Erik', 'Erki', 'Erkki', 'Erko', 'Erni',
            'Ervin', 'Eugen', 'Evald', 'Feliks', 'Georg', 'Gert', 'Gunnar', 'Gustav', 'Haljand',
            'Hando', 'Hannes', 'Hanno', 'Hans', 'Harald', 'Harri', 'Heiki', 'Heikki', 'Heiko', 'Heino',
            'Heiti', 'Heldur', 'Helmer', 'Hendrik', 'Henn', 'Henno', 'Henri', 'Henrik', 'Hillar',
            'Hindrek', 'Hugo', 'Iivo', 'Illimar', 'Ilmar', 'Imre', 'Indrek', 'Ingmar', 'Innar', 'Ivar',
            'Ivo', 'Jaagup', 'Jaak', 'Jaan', 'Jaanus', 'Jan', 'Janar', 'Janek', 'Janno', 'Jarmo',
            'Joakim', 'Joel', 'Johannes', 'Joonas', 'Joosep', 'Juhan', 'Juho', 'Julius', 'Jürgen',
            'Jüri', 'Juss', 'Kaarel', 'Kaido', 'Kaimar', 'Kalev', 'Kalevi', 'Kaljo', 'Kalju', 'Kalle',
            'Kalmer', 'Karl', 'Kaspar', 'Kasper', 'Kaupo', 'Kaur', 'Kert', 'Koit', 'Konrad', 'Kristjan',
            'Kristo', 'Kuldar', 'Küllo', 'Kuno', 'Kustas', 'Lars', 'Lauri', 'Laurits', 'Leho', 'Leino',
            'Lembit', 'Lennart', 'Lepo', 'Madis', 'Magnus', 'Maido', 'Mait', 'Marek', 'Margus', 'Marko',
            'Märt', 'Mart', 'Martin', 'Martti', 'Mati', 'Mats', 'Mattias', 'Meelis', 'Mihkel', 'Mikk',
            'Neeme', 'Niilo', 'Olari', 'Olavi', 'Olev', 'Oliver', 'Oscar', 'Osvald', 'Ott', 'Otto',
            'Paavo', 'Paul', 'Peep', 'Peet', 'Peeter', 'Priidu', 'Priit', 'Ragnar', 'Raido', 'Raigo',
            'Raimo', 'Raimond', 'Raimund', 'Rain', 'Rainer', 'Rait', 'Raivo', 'Rasmus', 'Raul', 'Rauno',
            'Rein', 'Riho', 'Riivo', 'Risto', 'Robert', 'Roland', 'Roman', 'Sander', 'Siim', 'Sten',
            'Sulev', 'Sven', 'Taavi', 'Taivo', 'Tambet', 'Tanel', 'Tarmo', 'Tauno', 'Teet', 'Tiit',
            'Timo', 'Toivo', 'Tõnis', 'Tõnu', 'Toomas', 'Udo', 'Uku', 'Ülar', 'Üllar', 'Ülo', 'Uno',
            'Urmas', 'Urmo', 'Uuno', 'Vahur', 'Vaino', 'Valdo', 'Valdur', 'Vallo', 'Valmar', 'Valter',
            'Vambola', 'Veiko', 'Veljo', 'Vello', 'Viljar', 'Viljo', 'Villem', 'Villu', 'Voldemar'
        ],
    
        'estonianFeminine': [
            'Aet', 'Agnes', 'Aili', 'Aime', 'Aino', 'Aire', 'Airi', 'Alma', 'Andra', 'Anna',
            'Anne', 'Anneli', 'Annika', 'Anu', 'Asta', 'Astrid', 'Ave', 'Birgit', 'Britta',
            'Dagmar', 'Eeva', 'Eha', 'Elina', 'Ellen', 'Elli', 'Elo', 'Elsa', 'Ene', 'Eneli',
            'Epp', 'Erika', 'Erna', 'Ester', 'Eva', 'Evi', 'Gerda', 'Gerli', 'Getter', 'Greta',
            'Grete', 'Heidi', 'Hele', 'Helen', 'Helene', 'Helge', 'Heli', 'Heljo', 'Helju',
            'Helle', 'Helmi', 'Helvi', 'Herta', 'Hilda', 'Hilja', 'Ida', 'Iiris', 'Ilmi', 'Ilona',
            'Ilse', 'Imbi', 'Ines', 'Inga', 'Inge', 'Ingrid', 'Irja', 'Irma', 'Ita', 'Jaana',
            'Janne', 'Johanna', 'Kadri', 'Kai', 'Kaia', 'Kaidi', 'Kaija', 'Kaili', 'Kaire', 'Kairi',
            'Kaisa', 'Kaja', 'Karin', 'Kärt', 'Katariina', 'Kätlin', 'Katrin', 'Kersti', 'Kertu',
            'Ketlin', 'Kirsti', 'Klaudia', 'Krista', 'Kristel', 'Kristiina', 'Külli', 'Lagle', 'Laine',
            'Laura', 'Leida', 'Leila', 'Lenna', 'Liia', 'Liina', 'Liis', 'Liisa', 'Liisi', 'Lilli',
            'Linda', 'Lotte', 'Luule', 'Maarja', 'Mai', 'Maila', 'Mall', 'Malle', 'Mare', 'Maret',
            'Margit', 'Margo', 'Mari', 'Marika', 'Maris', 'Marju', 'Marta', 'Meeli', 'Merike', 'Merle',
            'Meta', 'Miina', 'Mirjam', 'Monika', 'Moonika', 'Õnne', 'Paula', 'Piia', 'Pille', 'Piret',
            'Ragne', 'Raine', 'Reet', 'Riin', 'Riina', 'Rita', 'Rutt', 'Saara', 'Salme', 'Selma',
            'Signe', 'Siiri', 'Silvia', 'Sirje', 'Susanna', 'Tähti', 'Terje', 'Tiia', 'Tiina', 'Tiiu',
            'Triin', 'Tuuli', 'Ulla', 'Ülle', 'Ulvi', 'Ursula', 'Urve', 'Valda', 'Valve', 'Viive',
            'Vilma', 'Virve'
        ],
    
        'russianFeminine': [
            "Agafa", "Agafiya", "Agafokliya", "Agafya", "Agapa", "Agapiya", "Alevtina", "Alina", "Alla", "Alya", "Alyona",
            "Anastasia", "Angelika", "Anka", "Anna", "Anoushka", "Antonina", "Antoniya", "Arina", "Aurora", "Avdotya", "Avelina",
            "Avenira", "Aventina", "Avgusta", "Avgustina", "Aviafa", "Aviva", "Avlida", "Avreliya", "Avreya", "Avtonoma",
            "Daria", "Diana", "Ekaterina", "Elena", "Elina", "Elvira", "Galina", "Gennadiya", "Hannah", "Inna", "Irina",
            "Karolina", "Katerina", "Katya", "Khioniya", "Kira", "Lada", "Lana", "Larissa", "Lena", "Lina", "Ludmila", "Luiza",
            "Lyubov", "Margarita", "Maria", "Marina", "Mariya", "Marta", "Masha", "Melania", "Mila", "Milena", "Miroslava",
            "Nadezhda", "Nadia", "Nastja", "Natacha", "Natalia", "Nataliya", "Natalya", "Natasha", "Nika", "Nikolina", "Nina",
            "Ninel", "Nonna", "Oksana", "Olga", "Praskovya", "Raisa", "Raya", "Rimma", "Ruslana", "Snežana", "Sonia", "Sophia",
            "Stanislava", "Stefania", "Svetlana", "Tamara", "Tanya", "Tatiana", "Valentina", "Valeria", "Varvara", "Vasilisa",
            "Vera", "Veronica", "Vesna", "Viktoriya", "Vlada", "Yekaterina", "Yelena", "Yulia", "Yuliana", "Zenaida", "Zoya"
        ],
    
        'russianMasculine': [
            "Abagor", "Abamon", "Abataly", "Abelyar", "Abid", "Abnody", "Abram", "Aburom", "Afanasy", "Agafangel",
            "Agafon", "Agafonik", "Agafopod", "Agafopus", "Agap", "Agapion", "Agapit", "Agapy", "Agat", "Agav",
            "Agavva", "Albert", "Alexander", "Alexey", "Amvrosy", "Anatoly", "Andrei", "Andrey", "Anton", "Arkadiy",
            "Arkady", "Artemy", "Artyom", "Avda", "Avdakt", "Avdelay", "Avdey", "Avdifaks", "Avdiky", "Avdiyes",
            "Avdon", "Avel", "Avenir", "Aventin", "Averky", "Avgar", "Avgury", "Avgust", "Avgustin", "Avian",
            "Avim", "Avip", "Avit", "Avksenty", "Avksily", "Avksivy", "Avkt", "Avram", "Avrelian", "Avrely",
            "Avrey", "Avros", "Avsey", "Avtonom", "Avudim", "Avundy", "Avva", "Avvakir", "Avvakum", "Bogdan",
            "Boris", "Budimir", "Daniel", "Daniil", "Danila", "David", "Demyan", "Denis", "Dmitry", "Eduard",
            "Elisei", "Fedot", "Feofan", "Fyodor", "Gavriil", "Gennady", "Genrikh", "Georgy", "Gerasim", "German",
            "Gleb", "Grigory", "Grischa", "Ignat", "Ilarion", "Ilya", "Iosif", "Ivan", "Jaroslav", "Kirill",
            "Kliment", "Kolya", "Konstantin", "Lavrentiy", "Leon", "Leonid", "Lev", "Lukyan", "Matvei", "Maxim","Maksim",
            "Miron", "Mstislav", "Nectarios", "Nikita", "Nikola", "Nikolay", "Oleg", "Osip", "Ossip", "Panteleimon",
            "Pavel", "Pavsikakiy", "Piotr", "Prokhor", "Prokopy", "Pyotr", "Ratimir", "Renat", "Rodion", "Roman",
            "Rostislav", "Ruslan", "Sasha", "Simeon", "Simon", "Slava", "Stanislav", "Stepan", "Svetoslav", "Sviatoslav",
            "Tikhon", "Timofey", "Timur", "Trifon", "Trofim", "Vadim", "Valentin", "Valery", "Vasily", "Veniamin",
            "Victor", "Vitalii", "Vladilen", "Vladimir", "Vladislav", "Vsevolod", "Vyacheslav", "Yakov", "Yaroslav",
            "Yefim", "Yegor", "Yevgeny", "Yury", "Zakhar", "Zinovy"
        ]
      };
    
      // Loop through each gender and language to add entities
      for (const [key, names] of Object.entries(namesByGenderAndLanguage)) {
        manager.addNamedEntityText('person', key, ['en'], names);
      }
      
    
    
    const documents = [
        "%name%", "Who is %name%", "Identity of %name%", "Nickname for %name%", "Username of %name%", 
        "Title for %name%", "Alias of %name%", "Moniker for %name%", "Handle for %name%", "Tag for %name%",
        "Please identify %name%", "Is your name %name%", "Could %name% be there", "Please confirm identity of %name%", "First, what is %name% called",
        "Say the name %name%", "Confirm state of %name%", "Is your alias %name%", "What's the identity of %name%", "What is known as %name%",
        "What name does %name% carry", "May I know if %name% is correct", "%name%, what's your name", "Are you %name%", "Confirm if you are %name%",
        "Might you be %name%", "%name%, can you respond", "What name does %name% carry", "Can %name% specify", "Who do I address as %name%",
        "Could you, %name%, please tell me your name", "%name%, I would like to know who I am speaking with",
        "Would %name% mind sharing their name", "For our records, is %name% correct", 
        "%name%, please introduce yourself", "%name%, let's get acquainted, what’s your name", 
        "Before we proceed, %name%, may I have your name", "%name%, I didn’t catch your name, what was it",
        "%name%, could you please let me know your name", "%name%, please, could you inform me of your name"
    ];
    
    // Add each document to the manager with the intent 'user.provideName'
    documents.forEach(phrase => {
        manager.addDocument('en', phrase, 'user.provideName');
    });

    // Additional phrases for name provision
    const namePhrases = [
        "My name is %name%",
        "I'm %name%",
        "Call me, %name%",
        "I did provide this nickname %name%"
    ];

    // Add each name phrase to the manager with the intent 'user.provideName'
    namePhrases.forEach(phrase => {
        manager.addDocument('en', phrase, 'user.provideName');
    });
    
    const answers = [
        "Hello {{name}}!",
        "Welcome {{name}}.",
        "Hi {{name}}!",
        "{{name}}, how can I help you today?",
        "{{name}}, greetings!",
        "Acknowledged, {{name}}.",
        "{{name}}, noted.",
        "It's received, {{name}}.",
        "Registered, {{name}}.",
        "{{name}}, recorded!",
        "Hello there, {{name}}!",
        "Welcome aboard, {{name}}!",
        "Hi again, {{name}}!",
        "Greetings, friend {{name}}!",
        "{{name}}, pleasure meeting you!",
        "Good meeting you, {{name}}!",
        "{{name}}, lovely indeed!",
        "Nice one {{name}}!",
        "Well met, {{name}}!",
        "Hey there {{name}}!",
        "Hello, nice meeting you, {{name}}!",
        "Hi, good day, {{name}}!",
        "{{name}}, welcome, let’s begin!",
        "Greetings, how are you, {{name}}?",
        "Hello, glad meeting you, {{name}}!",
        "Welcome, good start, {{name}}!",
        "Nice to meet you, {{name}}!",
        "Hi, pleasure here with you, {{name}}!",
        "Greetings, what's next {{name}}?",
        "Welcome, start chatting, {{name}}!",
        "Hello {{name}}, nice to meet you! How can I assist you?",
        "Hi {{name}}, I'm glad we're getting to know each other. What can I do for you?",
        "Welcome aboard {{name}}! What’s the first thing you’d like to discuss?",
        "Pleased to meet you {{name}}! How may I assist you right now?",
        "It's great to finally meet you {{name}}! Is there something specific you need help with?",
        "I'm delighted to make your acquaintance {{name}}. What would you like to talk about?",
        "Welcome {{name}}! I'm here to assist you. What’s on your mind today?",
        "I appreciate you sharing your name, {{name}}. How can I be of service to you now?",
        "Thank you for telling me your name, {{name}}. How can I make your day better?",
        "Now that we’re introduced, how may I assist you today, {{name}}?"
    ];
    
    // Add each response to the manager with the intent 'user.provideName'
    answers.forEach(answer => {
        manager.addAnswer('en', 'user.provideName', answer);
    });
      // Configure response for the intent
    manager.addAnswer('en', 'user.provideName', "Nice to meet you, {{name}}! How can I assist you today?");
}



module.exports = trainNames;
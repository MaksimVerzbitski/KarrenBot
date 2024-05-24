function rateChatbot(rating) {
    console.log(`User rated the chatbot: ${rating}`);
    // Send this rating to the server or handle it as needed...
};


/* function rateChatbot(rating) {
    console.log(`User rated the chatbot: ${rating}`);
    const phrases = {
        1: ['Rate me 1', 'I rate 1', 'My rating is 1', '1 star', 'One star'],
        2: ['Rate me 2', 'I rate 2', 'My rating is 2', '2 stars', 'Two stars'],
        3: ['Rate me 3', 'I rate 3', 'My rating is 3', '3 stars', 'Three stars'],
        4: ['Rate me 4', 'I rate 4', 'My rating is 4', '4 stars', 'Four stars'],
        5: ['Rate me 5', 'I rate 5', 'My rating is 5', '5 stars', 'Five stars']
    };
    const randomPhrase = phrases[rating][Math.floor(Math.random() * phrases[rating].length)];
    console.log(`Sending message: ${randomPhrase}`);

    // Update the URL to match the Flask server endpoint
    fetch('http://localhost:5000/sendMessage', {  // Assuming Flask is running on port 5000
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ message: randomPhrase })
    })
    .then(response => response.json())
    .then(data => {
        console.log('Server response data:', data);
        // Update the chat UI with the response
        updateChatUI('Tatjana', data.answer);
    })
    .catch(error => {
        console.error('Error:', error);
    });
}

// Make the function global
window.rateChatbot = rateChatbot; */
function chatbotApp() {
    let isMinimized = false;
    let isMaximized = false;
    let lastX = null;
    let lastY = null;
    let isClosed = false;

    // Trackers for clear, message sent, rating press - click
    let isClearingChat = false; 
    let isSendingMessage = false; 
    let isRating = false; 

    // Unused for now
    let userIsActive = false;
    let lastUserActivityTime = Date.now();

    const chatContainer = document.getElementById('chat-container');
    const clearChatButton = document.getElementById('clear-chat'); 
    const minimizedCircle = document.getElementById('minimized-circle');

    // trackers for buttons clear, message sent, rating press - click
    const chatInput = document.getElementById('chat-text-input');
    const sendButton = document.getElementById('send-button');
    const rateButtons = document.querySelectorAll('.rate-button');

    function centerChatContainer() {
        if (isMinimized || isClosed) return; // Do not center if minimized.
    
        // Remove properties for fixed positioning.
        chatContainer.style.removeProperty('right');
        chatContainer.style.removeProperty('bottom');
        chatContainer.style.removeProperty('transform');
    
        document.getElementById('div-wrapper').style.display = 'flex';
        document.getElementById('div-wrapper').style.justifyContent = 'center';
        document.getElementById('div-wrapper').style.alignItems = 'center';
    }

    window.addEventListener('resize', centerChatContainer);
    // Ensure only the chat container is visible on page load
    window.addEventListener('load', () => {
        chatContainer.style.display = 'flex';
        minimizedCircle.style.display = 'none';
    });

    function makeDraggable() {
        const handle = document.getElementById('chat-header');
        let startX, startY, initialX, initialY;
    
        handle.addEventListener('mousedown', function(e) {
            if (isMinimized || isMaximized) return; // Prevent dragging if minimized or maximized
    
            startX = e.clientX;
            startY = e.clientY;
            const rect = chatContainer.getBoundingClientRect();
            initialX = rect.left;
            initialY = rect.top;
    
            function onMouseMove(e) {
                const deltaX = e.clientX - startX;
                const deltaY = e.clientY - startY;
            
                // Constrain left and top positions within the viewport
                let newLeft = initialX + deltaX;
                let newTop = initialY + deltaY;
            
                // Ensure new left and top to keep the chat container in viewport
                newLeft = Math.max(0, Math.min(newLeft, window.innerWidth - chatContainer.offsetWidth));
                newTop = Math.max(0, Math.min(newTop, window.innerHeight - chatContainer.offsetHeight));
            
                // Convert new left and top to % for responsiveness
                lastX = (newLeft / window.innerWidth) * 100;
                lastY = (newTop / window.innerHeight) * 100;
            
                // Apply new position 
                chatContainer.style.left = `${lastX}%`;
                chatContainer.style.top = `${lastY}%`;
            }
    
            function onMouseUp() {
                document.removeEventListener('mousemove', onMouseMove);
                document.removeEventListener('mouseup', onMouseUp);
            }
    
            document.addEventListener('mousemove', onMouseMove);
            document.addEventListener('mouseup', onMouseUp);
        });
    }

    function minimizeChat() {
        if (!isMinimized) {
            chatContainer.classList.add('minimized');
            chatContainer.classList.remove('maximized');
            chatContainer.style.inset = 'auto 0px 0px auto';
            isMinimized = true;
            isMaximized = false;
        } else {
            chatContainer.classList.remove('minimized');
            chatContainer.style.removeProperty('inset');
            if (isMaximized) {
                maximizeChat(); // Restore to maximized state
            } else if (lastX !== null && lastY !== null) {
                // Restore % responsiveness 
                chatContainer.style.left = `${lastX}%`;
                chatContainer.style.top = `${lastY}%`;
            } else {
                centerChatContainer();
            }
            isMinimized = false;
        }
    }

    function maximizeChat() {
        if (!isMaximized) {
            chatContainer.classList.add('maximized');
            chatContainer.classList.remove('minimized');
            // Store the current position before maximizing
            lastX = chatContainer.style.left;
            lastY = chatContainer.style.top;
            isMaximized = true;
            isMinimized = false;
        } else {
            chatContainer.classList.remove('maximized');
            // Restore last position before maximized
            chatContainer.style.left = lastX;
            chatContainer.style.top = lastY;
            isMaximized = false;
        }
    }
    function closeChat() {
        console.log("closeChat function called");
        if (chatContainer && minimizedCircle) {
            chatContainer.style.display = 'none'; // Hide the chat container
            minimizedCircle.style.display = 'flex'; // Show the minimized circle
            isClosed = true; // Set the isClosed flag to true
            console.log("Classes on chatContainer: ", chatContainer.classList);
            console.log("Minimized circle display style: ", minimizedCircle.style.display);
        } else {
            console.error("Element references not found");
        }
    }

    function restoreChat() {
        console.log("restoreChat function called");
        if (chatContainer && minimizedCircle) {
            chatContainer.style.display = 'flex'; // Show the chat container
            minimizedCircle.style.display = 'none'; // Hide the minimized circle
            isClosed = false; // Set the isClosed flag to false
            console.log("Classes on chatContainer: ", chatContainer.classList);
            console.log("Minimized circle display style: ", minimizedCircle.style.display);
        } else {
            console.error("Element references not found");
        }
    }

    function clearChat() {
        console.log("clearChat function called");
        const chatLog = document.getElementById('chat-log');

        if (!isClearingChat) {
            // Change "Cancel" mode
            console.log("Setting 'Clear Chat' button to 'Cancel' and changing its color to red");
            clearChatButton.classList.add('button-orange');
            clearChatButton.textContent = 'Cancel';
            clearChatButton.style.background = 'red';
            isClearingChat = true;

            console.log("Adding confirmation options to chatLog");
            chatLog.innerHTML = `
            <div id="clear-chat-confirmation">Are you sure you want to clear the chat?</div>
            <div id="clear-chat-buttons">
                <button id="confirmClear" class="button-orange">Yes, Clear Chat</button>
                <button id="startNewSession" class="button-orange" onclick="location.reload();">Start New Session</button>
            </div>
            `;

            document.getElementById('confirmClear').addEventListener('click', this.confirmClearChat.bind(this));
        } else {
            // Reset to "Clear Chat" mode
            console.log("Cancel action selected, restoring the initial state of the chat log and 'Clear Chat' button");
            chatLog.innerHTML = '';
            clearChatButton.textContent = 'Clear Chat';
            clearChatButton.classList.remove('button-orange');
            clearChatButton.style.background = '';
            isClearingChat = false;
        }
    }

    function confirmClearChat() {
        console.log("confirmClearChat function called");
        document.getElementById('chat-log').innerHTML = '';
        console.log("Cleared chat content");
        // global chatbot object
        this.chatbot.conversationHistory = [];
        console.log("Conversation history cleared");

        // Reset clear to original state
        console.log("Resetting 'Clear Chat' button to its original state");
        clearChatButton.textContent = 'Clear Chat';
        clearChatButton.style.background = '';
        isClearingChat = false; // Reset the state
    }

    // thinking animation for bot

    function showThinking() {
        const thinkingElement = document.createElement('div');
        thinkingElement.className = 'bot-message thinking';
        thinkingElement.innerHTML = '<span class="sender-name">Bot is thinking...</span>';
        chatLog.appendChild(thinkingElement);
        chatLog.scrollTop = chatLog.scrollHeight; // Scroll to bottom
        return thinkingElement;
    }

    function removeThinking(thinkingElement) {
        if (thinkingElement) {
            chatLog.removeChild(thinkingElement);
        }
    }
    

    return {
        chatbot: new Chatbot(),
        initChatbot() {
            centerChatContainer();
            window.addEventListener('resize', function() {
                if (isMinimized) {
                    // Keep minimized chat at the bottom right
                    chatContainer.style.inset = 'auto 0px 0px auto';
                } else if (isMaximized) {
                    // No need to reposition if maximized
                } else if (lastX !== null && lastY !== null) {
                    // window stays within the viewport %
                    const leftInPx = (window.innerWidth * lastX) / 100;
                    const topInPx = (window.innerHeight * lastY) / 100;
            
                    // Apply current viewport size
                    const constrainedLeft = Math.min(leftInPx, window.innerWidth - chatContainer.offsetWidth);
                    const constrainedTop = Math.min(leftInPx, window.innerHeight - chatContainer.offsetHeight);
            
                    chatContainer.style.left = `${(constrainedLeft / window.innerWidth) * 100}%`;
                    chatContainer.style.top = `${(constrainedTop / window.innerHeight) * 100}%`;
                } else {
                    // Center container if it has not been dragged
                    centerChatContainer();
                }
            });
            makeDraggable();
            minimizedCircle.addEventListener('click', restoreChat); //circle calls restoreChat
            document.querySelectorAll('.rate-button').forEach(button => {
                button.addEventListener('click', (event) => {
                    if (isRating) return;  // Prevent sending multiple ratings at once
                    isRating = true;  // Disable rating buttons
                    document.querySelectorAll('.rate-button').forEach(button => button.disabled = true);
            
                    const rating = event.target.textContent;
            
                    // Send the rating to the server
                    this.chatbot.sendMessage(`Rate me ${rating}`, 'User');
            
                    setTimeout(() => {
                        // Re-enable rating buttons after 2 seconds
                        document.querySelectorAll('.rate-button').forEach(button => button.disabled = false);
                        isRating = false;
                    }, 2000);
                });
            }); 
        },
        userInput: '',
        sendMessage() {
            if (this.userInput.trim() !== '') {
                if (isSendingMessage) return;  // Prevent sending multiple messages at once
                isSendingMessage = true;  // Disable sending
                chatInput.disabled = true;
                sendButton.disabled = true;
                this.chatbot.sendMessage(this.userInput.trim(), 'User');
                this.userInput = '';

                // Re-enable input and send button after 2 seconds
                setTimeout(() => {
                    chatInput.disabled = false;
                    sendButton.disabled = false;
                    isSendingMessage = false;
                }, 2000);
            }
        },

        
        minimizeChat: minimizeChat,
        maximizeChat: maximizeChat,
        closeChat: closeChat,
        clearChat: clearChat,
        confirmClearChat: confirmClearChat,
        restoreChat: restoreChat
    };
}

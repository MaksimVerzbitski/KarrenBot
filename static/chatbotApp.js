function chatbotApp() {
    let isMinimized = false;
    let isMaximized = false;
    let lastX = null;
    let lastY = null;
    let isClearingChat = false; // track  in clearing mode

    let userIsActive = false;
    let lastUserActivityTime = Date.now();

    const chatContainer = document.getElementById('chat-container');
    const clearChatButton = document.getElementById('clear-chat'); 

    function centerChatContainer() {
        if (isMinimized) return; // Do not center if minimized.
    
        // Remove properties  fixed positioning.
        chatContainer.style.removeProperty('right');
        chatContainer.style.removeProperty('bottom');
        chatContainer.style.removeProperty('transform');
    
        document.getElementById('div-wrapper').style.display = 'flex';
        document.getElementById('div-wrapper').style.justifyContent = 'center';
        document.getElementById('div-wrapper').style.alignItems = 'center';
    }

    window.addEventListener('resize', centerChatContainer);

    function makeDraggable() {
        const handle = document.getElementById('chat-header');
        let startX, startY, initialX, initialY;
    
        handle.addEventListener('mousedown', function(e) {
            if (isMinimized || isMaximized) return;
    
            startX = e.clientX;
            startY = e.clientY;
            const rect = chatContainer.getBoundingClientRect();
            initialX = rect.left;
            initialY = rect.top;
    
            function onMouseMove(e) {
                const deltaX = e.clientX - startX;
                const deltaY = e.clientY - startY;
            
                // left and top positions  constraints of the viewport
                let newLeft = initialX + deltaX;
                let newTop = initialY + deltaY;
            
                // new left and top to keep the chat container in viewport
                newLeft = Math.max(0, Math.min(newLeft, window.innerWidth - chatContainer.offsetWidth));
                newTop = Math.max(0, Math.min(newTop, window.innerHeight - chatContainer.offsetHeight));
            
                // Convert new left and top to % for responsiveness
                lastX = (newLeft / window.innerWidth) * 100;
                lastY = (newTop / window.innerHeight) * 100;
            
                // Apply  new position 
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
            chatContainer.style.inset = 'auto 0px 0px auto';
            isMinimized = true;
        } else {
            chatContainer.classList.remove('minimized');
            chatContainer.style.removeProperty('inset');
            if (lastX !== null && lastY !== null) {
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
            // store the current position before maximizing
            lastX = chatContainer.style.left;
            lastY = chatContainer.style.top;
            isMaximized = true;
        } else {
            chatContainer.classList.remove('maximized');
            // Restore last position before maximized
            chatContainer.style.left = lastX;
            chatContainer.style.top = lastY;
            isMaximized = false;
        }
    }

    function closeChat() {
        chatContainer.style.display = 'none';
    }

    function clearChat() {
        console.log("clearChat function called");
        const chatLog = document.getElementById('chat-log');

        if (!isClearingChat) {
            // Change "Cancel" mode
            console.log("Setting 'Clear Chat' button to 'Cancel' and changing its color to red");
            clearChatButton.textContent = 'Cancel';
            clearChatButton.style.background = 'red';
            isClearingChat = true;

            console.log("Adding confirmation options to chatLog");
            chatLog.innerHTML = `
            <div id="clear-chat-confirmation">Are you sure you want to clear the chat?</div>
            <div id="clear-chat-buttons">
                <button id="confirmClear">Yes, Clear Chat</button>
                <button id="startNewSession" onclick="location.reload();">Start New Session</button>
            </div>
            `;

            document.getElementById('confirmClear').addEventListener('click', this.confirmClearChat.bind(this));
        } else {
            // Reset to "Clear Chat" mode
            console.log("Cancel action selected, restoring the initial state of the chat log and 'Clear Chat' button");
            chatLog.innerHTML = '';
            clearChatButton.textContent = 'Clear Chat';
            clearChatButton.style.background = '';
            isClearingChat = false;
        }
    }
    


    function confirmClearChat() {
        console.log("confirmClearChat function called");
        document.getElementById('chat-log').innerHTML = '';
        console.log("Cleared chat content");
        // global chatbot  object
        this.chatbot.conversationHistory = [];
        console.log("Conversation history cleared");

        // Reset  clear => original state
        console.log("Resetting 'Clear Chat' button to its original state");
        clearChatButton.textContent = 'Clear Chat';
        clearChatButton.style.background = '';
        isClearingChat = false; // Reset the state
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
            
                    // Apply  current viewport size
                    const constrainedLeft = Math.min(leftInPx, window.innerWidth - chatContainer.offsetWidth);
                    const constrainedTop = Math.min(topInPx, window.innerHeight - chatContainer.offsetHeight);
            
                    chatContainer.style.left = `${(constrainedLeft / window.innerWidth) * 100}%`;
                    chatContainer.style.top = `${(constrainedTop / window.innerHeight) * 100}%`;
                } else {
                    // Center container if  not been dragged
                    centerChatContainer();
                }
            });
            makeDraggable();
        },
        userInput: '',
        sendMessage() {
            if (this.userInput.trim() !== '') {
                this.chatbot.sendMessage(this.userInput.trim(), 'User');
                this.userInput = '';
            }
        },
        minimizeChat: minimizeChat,
        maximizeChat: maximizeChat,
        closeChat: closeChat,
        clearChat: clearChat,
        confirmClearChat: confirmClearChat,
    
        
    };
};
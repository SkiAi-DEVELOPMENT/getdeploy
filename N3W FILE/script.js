// script.js

// HTML elements
const chatBox = document.getElementById('chat-box');
const chatInput = document.getElementById('chat-input');
const sendButton = document.getElementById('send-button');

// WebSocket connection
const ws = new WebSocket('ws://localhost:8765');

ws.onopen = () => {
    console.log('Connected to the WebSocket server');
};

ws.onmessage = (event) => {
    const response = JSON.parse(event.data);
    addMessageToChatBox(`Bot: ${response.result || response.joke || response.translated_text || response.summary || response.answer || response.text || response.status || response.code || response.error}`);
};

// Event listeners for sending messages
sendButton.addEventListener('click', () => {
    sendMessage();
});

chatInput.addEventListener('keydown', (event) => {
    if (event.key === 'Enter') {
        sendMessage();
    }
});

// Function to send messages and handle API calls
function sendMessage() {
    const message = chatInput.value;
    addMessageToChatBox(`You: ${message}`);

    // Example of different actions based on input
    if (message.startsWith('/api')) {
        // Send a fetch request
        fetch('https://your-backend.onrender.com/api/endpoint', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ expression: message }),
        })
        .then(response => response.json())
        .then(data => {
            addMessageToChatBox(`Bot (API): ${data.result || data.status || data.message}`);
        })
        .catch((error) => {
            addMessageToChatBox(`Error (API): ${error}`);
        });
    } else {
        // Send a WebSocket message
        ws.send(JSON.stringify({ action: 'calculate', expression: message }));
    }

    chatInput.value = ''; // Clear the input field
}

// Function to add messages to the chat box
function addMessageToChatBox(message) {
    const messageElement = document.createElement('p');
    messageElement.textContent = message;
    chatBox.appendChild(messageElement);
    chatBox.scrollTop = chatBox.scrollHeight; // Scroll to the bottom of the chat
}

const form = document.getElementById('chat-form');
const input = document.getElementById('user-input');
const chatBox = document.getElementById('chat-box');

form.addEventListener('submit', async function (e) {
  e.preventDefault();

  const userMessage = input.value.trim();
  if (!userMessage) return;

  appendMessage('user', userMessage);
  input.value = '';
  
  // Add a "Thinking..." message and store the element
  const thinkingMsgElement = appendMessage('bot', 'Gemini is thinking...');

  try {
    const response = await fetch('/api/chat', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      // Match the backend expectation: { "message": "..." }
      body: JSON.stringify({ 
        messages: [{ role: 'user', text: userMessage }],
      }),
    });

    if (!response.ok) {
      // Handle HTTP errors like 404, 500
      thinkingMsgElement.textContent = 'Failed to get response from server.';
      return;
    }

    const data = await response.json();

    // Update the "Thinking..." message with the actual reply
    // Match the backend response: data.reply
    if (data.result) {
      thinkingMsgElement.textContent = data.result;
    } else {
      thinkingMsgElement.textContent = 'Sorry, no response received.';
    }
  } catch (error) {
    // Handle network errors or issues with the fetch call itself
    thinkingMsgElement.textContent = 'Failed to get response from server.';
    console.error('Error fetching chat response:', error);
  }
});

function appendMessage(sender, text) {
  const msg = document.createElement('div');
  msg.classList.add('message', sender);
  msg.textContent = text;
  chatBox.appendChild(msg);
  chatBox.scrollTop = chatBox.scrollHeight;
  return msg; // Return the element so it can be modified
}

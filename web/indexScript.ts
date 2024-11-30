import { formatMessage } from "./utils";

const messageInput = document.getElementById('message')! as HTMLInputElement;
const sendForm = document.getElementById('message-input-form')! as HTMLFormElement;
const chatContainer = document.getElementById('chat-container')! as HTMLDivElement;
const logoutButton = document.getElementById('logoutButton')! as HTMLButtonElement;

const getMessages = async () => {
	const response = await fetch('/api/messages');
	if (response.status === 401) {
		window.location.href = '/login';
	}
	const messages = await response.json();
	return messages;
};

const drawMessages = (messages: any) => {
	chatContainer.innerHTML = '';
	for (const message of messages) {
		const messageElement = document.createElement('div');
		messageElement.innerHTML = formatMessage(message);
		chatContainer.appendChild(messageElement);
	}
	chatContainer.scrollTop = chatContainer.scrollHeight;
};

const init = async () => {
	const messages = await getMessages();
	drawMessages(messages);
}

// Add functionality to the logout button
logoutButton.addEventListener("click", () => {
	fetch('/api/logout', {
		method: 'POST'
	}).then(() => {
		window.location.href = "/login";
	});
});


sendForm.addEventListener('submit', async (e) => {
	e.preventDefault();
	const message = messageInput.value.trim();
	if (message) {
		await fetch('/api/messages', {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json'
			},
			body: JSON.stringify({ message })
		});
		messageInput.value = '';
		const messages = await getMessages();
		drawMessages(messages);
	}
});

init();
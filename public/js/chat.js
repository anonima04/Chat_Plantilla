
const socket = io();

// Obtener los elementos del HTML
const form = document.getElementById('chat-form');
const usernameInput = document.getElementById('username');
const messageInput = document.getElementById('message');
const messagesList = document.getElementById('messages');

// Enviar mensajes
form.addEventListener('submit', (event) => {
    event.preventDefault();

    const username = usernameInput.value.trim();
    const message = messageInput.value.trim();

    // Validar el nombre
    if (!username) {
        alert('Por favor, escribe tu nombre.');
        usernameInput.focus();
        return;
    }

    // Validar el mensaje
    if (!message) {
        alert('Por favor, escribe un mensaje.');
        messageInput.focus();
        return;
    }

    // Enviar el mensaje al servidor
    socket.emit('chat message', {
        username: username,
        message: message
    });

    // Limpiar el campo del mensaje
    messageInput.value = '';
    messageInput.focus();
});

// Recibir mensajes de todos los usuarios
socket.on('chat message', (data) => {

    // Eliminar el mensaje de bienvenida
    const welcome = messagesList.querySelector('.welcome-message');

    if (welcome) {
        welcome.remove();
    }

    // Crear el contenedor del mensaje
    const item = document.createElement('li');
    item.className = 'message';

    // Crear el encabezado del mensaje
    const header = document.createElement('div');
    header.className = 'message-header';

    // Nombre del usuario
    const author = document.createElement('span');
    author.className = 'message-author';
    author.textContent = data.username;

    // Fecha y hora
    const time = document.createElement('time');
    time.className = 'message-time';
    time.textContent = `${data.date} · ${data.time}`;

    // Contenido del mensaje
    const text = document.createElement('p');
    text.className = 'message-text';
    text.textContent = data.message;

    // Organizar los elementos
    header.appendChild(author);
    header.appendChild(time);

    item.appendChild(header);
    item.appendChild(text);

    // Agregar el mensaje a la ventana del chat
    messagesList.appendChild(item);

    // Mostrar automáticamente el último mensaje
    messagesList.scrollTop = messagesList.scrollHeight;
});

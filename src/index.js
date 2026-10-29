import express from 'express';
import http from 'http';
import path from 'path';
import { engine } from 'express-handlebars';
import { Server } from 'socket.io';
import { __dirname } from './util.js';
import chatRoutes from './routes/chat_routes.js';

const app = express();
const server = http.createServer(app);
const io = new Server(server);

const PORT = 3000;

const viewsPath = path.join(__dirname, 'views');

app.engine(
    'handlebars',
    engine({
        extname: '.handlebars',
        defaultLayout: 'main',
        layoutsDir: path.join(viewsPath, 'layouts'),
        partialsDir: path.join(viewsPath, 'partials')
    })
);

app.set('view engine', 'handlebars');
app.set('views', viewsPath);

app.use(express.static(path.join(__dirname, '..','public')));

app.use('/', chatRoutes);

io.on('connection', (socket) => {
    console.log('Nuevo usuario conectado:', socket.id); 
    socket.on('chat message', (data) =>{
        if(
            !data ||
            typeof data.username !== 'string' ||
            typeof data.message !== 'string'
        ){
            console.log('Datos de mensaje inválidos:', data);
            return;
        }
        const username = data.username.trim().slice(0,30);
        const message = data.message.trim().slice(0,1000);

        if(!username ||!message) return;

        const now = new Date();
        const newMessage = {
            username,
            message,
            date: now.toLocaleDateString('es-CO',{
                timeZone: 'America/Bogota',
            }),
            time: now.toLocaleTimeString('es-CO',{
                hour: '2-digit',
                minute: '2-digit',
                hour12: true,
                timeZone: 'America/Bogota'
        }),
        };
        io.emit('chat message', newMessage);
    });
    socket.on('disconnect', () => {
        console.log('Usuario desconectado:', socket.id);
    });
});

server.listen(PORT, () => {
    console.log(`Servidor escuchando en http://localhost:${PORT}`);
});
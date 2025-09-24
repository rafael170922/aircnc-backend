require('dotenv').config();
const express = require('express');
const cors = require('cors');
const path = require('path');
const mongoose = require('mongoose');//ODM

const socketio = require('socket.io');
const http = require('http');

const routes = require('./routes');

const app = express();
// Habilitar o parser de JSON em todas as rotas
app.use(express.json());
app.use(cors());

const server = http.createServer(app)
const io = socketio(server, {
    cors:{
        origin: 'http://localhost:5173', // ou '*'
        methods: ['GET', 'POST'],
        credentials: true
    }
});
const connectedUsers = {};

io.on('connection', socket => {
    console.log('Usuário conectado', socket.id)
    // //enviar
    // socket.emit('message', 'Quero reservar um spot')
    // //escutar
    // socket.on('message', data =>{
    //     console.log(data);
    // })

    // recuperar o id do usuário do frontend
    const { user_id } = socket.handshake.query;
    if (user_id) {
        if(!connectedUsers[user_id]){
            connectedUsers[user_id] = []
        }
        connectedUsers[user_id].push(socket.id);
        console.log(`Usuário ${user_id} conectado no socket ${socket.id}`)
    }

})

app.get('/', (req, res) => {
    return res.send('API AirCNC rodando...')
})
// disponibilizar o connectedUsers para toda a aplicação, neste caso vamos usar um middleware
app.use((req, res, next) =>{
    // como todas as rotas tem um req, significa que em cada rota eu consigo pegar o io que estará em req
    req.io = io;
    // também vou deixar disponivel para todas as minhas rotas, os usuários conectados na minha aplicação
    req.connectedUsers = connectedUsers;
    return next(); // e aqui eu digo que é para continuar o fluxo da aplicação
})

app.use(routes);
app.use('/files', express.static(path.resolve(__dirname, 'uploads')))

app.get('/ping', (req, res) => {
    console.log('recebeu ping');
    res.send('pong');
})

async function startDatabase(){
    const { DB_USER, DB_PASS, DB_NAME, DB_CLUSTER1, DB_CLUSTER2 } = process.env
    const uri = `mongodb+srv://${DB_USER}:${DB_PASS}${DB_CLUSTER1}/${DB_NAME}?${DB_CLUSTER2}`;
    // console.log(uri)
    try {
        await mongoose.connect(uri);
        console.log('Conectado ao MongoDBAtlas');
    } catch (error) {
        console.error('Erro ao conectar ao MongoDB: ', error.message);
        process.exit(1); // Encerra o processo se a conexão falhar
    }
}

startDatabase().then( ()=> {
    const port = process.env.PORT || 3335
    server.listen(port, () =>{
        console.log(`Servidor rodando na porta ${port}`);
    })
})
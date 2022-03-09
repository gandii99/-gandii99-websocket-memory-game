let rooms = {
  room1: {
    players: [],
    gameState: {
      board: ['japko', 'gruszka', 'śliwka', 'kiwi'],
    },
  },
  room2: {
    players: [],
    gameState: {
      board: ['japko', 'gruszka', 'śliwka', 'kiwi'],
    },
  },
};

const cors = require('cors');

const express = require('express');
const app = express();
app.use(cors());
const server = require('http').createServer(app);
const io = require('socket.io')(server, {
  cors: {
    origin: 'http://localhost:19006',
    methods: ['GET', 'POST'],
  },
});
const port = 3000;

app.get('/rooms', (request, response) => {
  return response.json(rooms);
});

io.on('connection', (socket) => {
  console.log('a user connected :D');
  socket.on('chat message', (msg) => {
    console.log(msg);
    io.emit('chat message', msg);
  });

  socket.on('join room', (roomId, name) => {
    const playerObject = {
      name,
      score: 0,
      playerId: socket.id,
    };
    if (rooms[roomId].players.length >= 2) {
      console.log('nie ma miejsca');
      return;
    }
    socket.join(roomId);
    rooms[roomId].players.push(playerObject);
    io.to(roomId).emit('lobby players', rooms[roomId].players);
    console.log(name);
    console.log(socket.rooms);
  });
  socket.on('close connection', (roomId, name) => {
    // rooms[roomId].players;
    console.log('player chce wyjść: ' + roomId + ' z ' + name);
    rooms[roomId].players = rooms[roomId].players.filter(
      (player) => player.name !== name
      //TODO name <- playerId
    );
    io.to(roomId).emit('lobby players', rooms[roomId].players);
  });

  socket.on('disconnect', () => {
    console.log('player disconnect: ' + socket.id);
  });
});

server.listen(port, () => console.log('server running on port:' + port));

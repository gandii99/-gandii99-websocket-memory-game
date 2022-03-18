let rooms = {
  room1: {
    players: [],
    gameState: {
      nextPlayer: '',
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

  socket.on('force close connection', (roomId, name) => {
    // rooms[roomId].players;
    console.log('player chce wyjść: ' + roomId + ' z ' + name);
    rooms[roomId].players = rooms[roomId].players.filter(
      (player) => player.playerId !== socket.id
      //TODO name <- playerId
    );
    io.to(roomId).emit('lobby players', rooms[roomId].players);
  });

  socket.on('disconnect', (props, props2) => {
    // rooms.map(() => {});
    console.log('player disconnect: ' + socket.id + ' ');
  });

  socket.on('initial start game', (roomId) => {
    if (rooms[roomId].players.length !== 2) {
      console.log('Zła liczba graczy');
      return;
    }
    io.to(roomId).emit('go to gameView');
    console.log('wysłanie graczy do gameView');
  });

  socket.on('get current gamestate', (roomId) => {
    if (rooms[roomId].players.length !== 2) {
      console.log('Zła liczba graczy');
      return;
    }
    io.to(roomId).emit('go to gameView');
    console.log('wysłanie graczy do gameView');
  });
});

server.listen(port, () => console.log('server running on port:' + port));

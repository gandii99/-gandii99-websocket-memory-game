let rooms = [
  {
    roomId: 0,
    players: [],
    gameState: {
      firstGuess: null,
      moveNumber: 0,
      nextPlayer: '',
      board: [
        {
          symbol: 'jabłko',
          state: 'hide',
        },
        {
          symbol: 'gruszka',
          state: 'hide',
        },
        {
          symbol: 'jabłko',
          state: 'hide',
        },
        {
          symbol: 'gruszka',
          state: 'hide',
        },
      ],
    },
  },
  {
    roomId: 1,
    players: [],
    gameState: {
      firstGuess: null,
      moveNumber: 0,
      nextPlayer: '',
      board: [
        {
          symbol: 'jabłko',
          state: 'hide',
        },
        {
          symbol: 'gruszka',
          state: 'hide',
        },
        {
          symbol: 'jabłko',
          state: 'hide',
        },
        {
          symbol: 'gruszka',
          state: 'hide',
        },
      ],
    },
  },
];

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

  // socket.on('force close connection', (roomId, name) => {
  //   console.log('player chce wyjść: ' + roomId + ' z ' + name);
  //   rooms[roomId].players = rooms[roomId].players.filter(
  //     (player) => player.playerId !== socket.id
  //   );
  //   io.to(roomId).emit('lobby players', rooms[roomId].players);
  // });

  // let disconnectedPlayerRoom = null;
  // rooms.forEach((room, index) => {
  //   room.players.forEach((player) => {
  //     if (player.playerId === socket.id) {
  //       disconnectedPlayerRoom = room.roomId;
  //     }
  //   });
  // });

  socket.on('disconnect', () => {
    let disconnectedPlayerRoom = null;
    rooms.forEach((room) => {
      room.players = room.players.filter((player) => {
        if (player.playerId === socket.id) {
          disconnectedPlayerRoom = room.roomId;
          return false;
        }
        return true;
      });
    });
    console.log(disconnectedPlayerRoom + 'here');
    if (disconnectedPlayerRoom !== null) {
      io.to(disconnectedPlayerRoom).emit('oponent disconected');
    }
    console.log('player disconnect: ' + socket.id + ' ');
  });

  socket.on('initial start game', (roomId) => {
    if (rooms[roomId].players.length !== 2) {
      console.log('Zła liczba graczy');
      return;
    }

    rooms[roomId].gameState.nextPlayer = rooms[roomId].players[0].playerId;
    rooms[roomId].gameState.board = getShuffledArr(generateBoard(4));
    io.to(roomId).emit('go to gameView', rooms[roomId]);
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

  socket.on('update game state', (currentRoomId, selectedField) => {
    rooms[currentRoomId].gameState.nextPlayer =
      rooms[currentRoomId].players[0].id;
    io.emit('game state', rooms[currentRoomId]);
    console.log(
      'wysłanie graczy do gameView',
      rooms[currentRoomId] + ' / ' + currentRoomId
    );
  });

  socket.on('select field', (currentRoomId, selectedField) => {
    // idplayer
    if (socket.id !== rooms[currentRoomId].gameState.nextPlayer) return;
    if (
      rooms[currentRoomId].gameState.board[selectedField].state === 'guessed' ||
      rooms[currentRoomId].gameState.board[selectedField].state === 'selected'
    ) {
      return;
    } else {
      rooms[currentRoomId].gameState.board[selectedField].state = 'selected';
      io.to(currentRoomId).emit('game state', rooms[currentRoomId]);
    }

    if (rooms[currentRoomId].gameState.moveNumber === 0) {
      rooms[currentRoomId].gameState.board[selectedField].state = 'selected';
      rooms[currentRoomId].gameState.moveNumber = 1;
      rooms[currentRoomId].gameState.firstGuess = selectedField;
    } else {
      rooms[currentRoomId].gameState.board[selectedField].state = 'selected';
      const prevGuessIndex = rooms[currentRoomId].gameState.firstGuess;
      const prevGuess = rooms[currentRoomId].gameState.board[prevGuessIndex];
      const currentGuess = rooms[currentRoomId].gameState.board[selectedField];

      if (prevGuess.symbol === currentGuess.symbol) {
        prevGuess.state = 'guessed';
        currentGuess.state = 'guessed';
        const currentPlayerIndex = rooms[currentRoomId].players.findIndex(
          (player) => {
            return player.playerId === socket.id;
          }
        );
        console.log('currentPlayerIndex', currentPlayerIndex);
        rooms[currentRoomId].players[currentPlayerIndex].score++;
      } else {
        prevGuess.state = 'hide';
        currentGuess.state = 'hide';
      }

      rooms[currentRoomId].gameState.moveNumber = 0;
      if (
        rooms[currentRoomId].gameState.nextPlayer ===
        rooms[currentRoomId].players[0].playerId
      ) {
        rooms[currentRoomId].gameState.nextPlayer =
          rooms[currentRoomId].players[1].playerId;
      } else {
        rooms[currentRoomId].gameState.nextPlayer =
          rooms[currentRoomId].players[0].playerId;
      }
    }

    if (
      rooms[currentRoomId].gameState.board.some((obj) => {
        return obj.state !== 'guessed';
      })
    ) {
      setTimeout(() => {
        io.to(currentRoomId).emit('game state', rooms[currentRoomId]);
      }, 1000);
    } else {
      let winner = null;
      if (
        rooms[currentRoomId].players[0].score >
        rooms[currentRoomId].players[1].score
      ) {
        winner = 0;
      } else if (
        rooms[currentRoomId].players[0].score <
        rooms[currentRoomId].players[1].score
      ) {
        winner = 1;
      }
      setTimeout(() => {
        io.to(currentRoomId).emit('game state', rooms[currentRoomId]);
        io.to(currentRoomId).emit('finish game', winner);
      }, 1000);
    }

    console.log('wysłanie aktualnego stanu gry ', currentRoomId);
  });
});

const SYMBOLS = [
  'gruszka',
  'jabłko',
  'pomarańcz',
  'wiśnia',
  'kiwi',
  'arbuz',
  'truskawka',
  'winogrono',
  'banan',
  'agrest',
  'cytryna',
];

const generateBoard = (size) => {
  let selectedSymbols = SYMBOLS.slice(0, size);
  let doubleSelectedSymbols = [...selectedSymbols, ...selectedSymbols];

  return doubleSelectedSymbols.map((symbol) => ({ symbol, state: 'hide' }));
};

const getShuffledArr = (arr) => {
  const newArr = arr.slice();
  for (let i = newArr.length - 1; i > 0; i--) {
    const rand = Math.floor(Math.random() * (i + 1));
    [newArr[i], newArr[rand]] = [newArr[rand], newArr[i]];
  }
  return newArr;
};

server.listen(port, () => console.log('server running on port:' + port));

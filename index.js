const express = require('express');
const app = express();
const http = require('http').createServer(app);
const { Server } = require('socket.io');
const io = new Server(http);

app.use('/', express.static('public'));
app.use('/overlay', express.static('overlay'));

io.on('connection', socket => {
  console.log('connected:', socket.id);

  socket.on('greeting', greeting => {
    if (typeof greeting === 'string' && greeting.trim().length > 0) {
      socket.broadcast.emit('greetingFromUser', greeting);
    }
  });
});

const PORT = process.env.PORT || 3000;
http.listen(PORT, () => {
  console.log(`listening on *:${PORT}`);
});

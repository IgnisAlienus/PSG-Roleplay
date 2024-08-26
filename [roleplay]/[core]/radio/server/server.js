const io = require('socket.io-client');
const config = {
  host: '72.177.37.116', // Replace with your web server's IP
  port: '3000', // Replace with your web server's port
};

const socket = io.connect(`http://${config.host}:${config.port}`);

let channels = {};

socket.on('connect', () => {
  console.log('Connected to web server');
});

socket.on('radio:receiveMessage', (channel, message) => {
  // Forward the message to in-game clients
  emitNet('radio:receiveMessage', -1, channel, message);
});

onNet('radio:joinChannel', (channel) => {
  channels[source] = channel;
  socket.emit('radio:joinChannel', channel);
});

onNet('radio:leaveChannel', () => {
  let channel = channels[source];
  delete channels[source];
  socket.emit('radio:leaveChannel', channel);
});

onNet('radio:startTransmission', (channel) => {
  socket.emit('radio:startTransmission', channel);
});

onNet('radio:endTransmission', (channel) => {
  socket.emit('radio:endTransmission', channel);
});

onNet('radio:sendMessage', (channel, message) => {
  socket.emit('radio:sendMessage', channel, message);
});

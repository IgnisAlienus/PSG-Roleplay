const io = require('socket.io')(3000); // Server for communication with web page dispatchers
const voiceData = {}; // Store voice data

// Handle incoming voice data from players
RegisterNetEvent('radio:transmitVoice');
onNet('radio:transmitVoice', (playerId, data) => {
  voiceData[playerId] = data;

  // Send the voice data to the web server for dispatchers
  io.emit('radio:receiveVoice', {
    playerId: playerId,
    voiceData: data,
  });
});

// Handle player disconnects
AddEventHandler('playerDropped', () => {
  const playerId = source;
  delete voiceData[playerId];
});

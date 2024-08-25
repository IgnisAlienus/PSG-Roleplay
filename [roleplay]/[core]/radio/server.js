const playersInChannels = {};

// Existing code to handle player joining a channel
onNet('radio:joinChannel', (newChannel) => {
  let playerId = source;

  // Add player to the new channel
  if (!playersInChannels[newChannel]) {
    playersInChannels[newChannel] = [];
  }
  playersInChannels[newChannel].push(playerId);
});

// Handle start of transmission
onNet('radio:startTransmission', (channel) => {
  let playerId = source;
  // Logic to handle the start of transmission
  console.log(`Player ${playerId} started transmitting on ${channel}`);
});

// Handle end of transmission
onNet('radio:endTransmission', () => {
  let playerId = source;
  // Logic to handle the end of transmission
  console.log(`Player ${playerId} stopped transmitting`);
});

// Handle voice data transmission
onNet('radio:transmit', (channel, voiceData) => {
  let playerId = source;

  // Send to all players in the same channel
  if (playersInChannels[channel]) {
    playersInChannels[channel].forEach((id) => {
      if (id !== playerId) {
        emitNet('radio:receive', id, {
          channel: channel,
          playerId: playerId,
          voiceData: voiceData,
        });
      }
    });
  }

  // Send voice data to the web server for dispatchers
  sendToWebServer(playerId, channel, voiceData);
});

function sendToWebServer(playerId, channel, voiceData) {
  const axios = require('axios');

  console.log('Sending voice data to web server:', {
    playerId,
    channel,
    voiceData,
  });

  axios
    .post('http://72.177.37.116/api/voice', {
      playerId,
      channel,
      voiceData,
    })
    .then(() => console.log('Voice data sent successfully'))
    .catch((err) =>
      console.error('Error sending voice data to web server:', err)
    );
}

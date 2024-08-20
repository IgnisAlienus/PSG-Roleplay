let playersInChannels = {};

onNet('radio:changeChannel', (previousChannel, newChannel) => {
  let playerId = source;

  // Remove player from the previous channel
  if (previousChannel && playersInChannels[previousChannel]) {
    playersInChannels[previousChannel] = playersInChannels[
      previousChannel
    ].filter((id) => id !== playerId);
  }

  // Add player to the new channel
  if (!playersInChannels[newChannel]) {
    playersInChannels[newChannel] = [];
  }
  playersInChannels[newChannel].push(playerId);
});

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

  axios
    .post('http://72.177.37.116/api/voice', {
      playerId,
      channel,
      voiceData,
    })
    .catch((err) =>
      console.error('Error sending voice data to web server:', err)
    );
}

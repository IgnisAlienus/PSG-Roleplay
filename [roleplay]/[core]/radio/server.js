const channels = {};

onNet('radio:joinChannel', (channel) => {
  const playerId = source;
  if (!channels[channel]) {
    channels[channel] = [];
  }
  channels[channel].push(playerId);
  console.log(`Player ${playerId} joined channel ${channel}`);
});

onNet('radio:leaveChannel', (channel) => {
  const playerId = source;
  if (channels[channel]) {
    channels[channel] = channels[channel].filter((id) => id !== playerId);
    console.log(`Player ${playerId} left channel ${channel}`);
  }
});

onNet('radio:sendMessage', (channel, message) => {
  if (channels[channel]) {
    channels[channel].forEach((playerId) => {
      emitNet('radio:receiveMessage', playerId, message);
    });
  }
});

const channels = {};

onNet('radio:joinChannel', (channel) => {
  const playerId = source;
  if (!channels[channel]) {
    channels[channel] = [];
  }
  if (!channels[channel].includes(playerId)) {
    channels[channel].push(playerId);
    console.log(`Player ${playerId} joined channel ${channel}`);
  }
});

onNet('radio:leaveChannel', (channel) => {
  const playerId = source;
  if (channels[channel]) {
    channels[channel] = channels[channel].filter((id) => id !== playerId);
    console.log(`Player ${playerId} left channel ${channel}`);
    if (channels[channel].length === 0) {
      delete channels[channel];
      console.log(`Channel ${channel} is now empty and has been deleted`);
    }
  }
});

onNet('radio:sendMessage', (channel, message) => {
  if (channels[channel]) {
    channels[channel].forEach((playerId) => {
      emitNet('radio:receiveMessage', playerId, message);
    });
  }
});

on('playerDropped', () => {
  const playerId = source;
  for (const channel in channels) {
    if (channels[channel].includes(playerId)) {
      channels[channel] = channels[channel].filter((id) => id !== playerId);
      console.log(
        `Player ${playerId} disconnected and was removed from channel ${channel}`
      );
      if (channels[channel].length === 0) {
        delete channels[channel];
        console.log(`Channel ${channel} is now empty and has been deleted`);
      }
    }
  }
});

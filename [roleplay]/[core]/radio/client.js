let currentChannel = null;

RegisterCommand(
  'radio',
  (source, args) => {
    const channel = parseInt(args[0]);
    if (isNaN(channel)) {
      console.log('Invalid channel');
      return;
    }

    currentChannel = channel;
    emitNet('radio:joinChannel', channel);
    console.log(`Joined radio channel ${channel}`);
  },
  false
);

RegisterCommand(
  'leaveradio',
  () => {
    if (currentChannel !== null) {
      emitNet('radio:leaveChannel', currentChannel);
      console.log(`Left radio channel ${currentChannel}`);
      currentChannel = null;
    } else {
      console.log('Not in any radio channel');
    }
  },
  false
);

onNet('radio:receiveMessage', (message) => {
  console.log(`Radio message: ${message}`);
});

setTick(() => {
  if (currentChannel !== null && IsControlJustPressed(0, 249)) {
    // Push-to-talk key (N by default)
    const playerName = GetPlayerName(PlayerId());
    const message = `${playerName}: ${Math.random().toString(36).substring(7)}`; // Replace with actual voice data
    emitNet('radio:sendMessage', currentChannel, message);
  }
});

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

onNet('radio:playback', (message) => {
  console.log(`Playback message: ${message}`);
  // Play the sound locally
  PlaySoundFrontend(-1, 'Start_Squelch', 'CB_RADIO_SFX', true);
});

setTick(() => {
  if (currentChannel !== null && IsControlJustPressed(0, 249)) {
    // Push-to-talk key (N by default)
    const playerName = GetPlayerName(PlayerId());
    const voiceChannel = `radio_channel_${currentChannel}`;

    // Start transmitting voice data
    NetworkSetVoiceChannel(voiceChannel);
    NetworkSetTalkerProximity(0.0); // Set to 0.0 to transmit to all players in the channel

    console.log(`${playerName} is talking on channel ${currentChannel}`);
    emit('chat:addMessage', {
      args: [`You are now talking on channel ${currentChannel}`],
    });

    // Emit start transmission message to the server
    emitNet('radio:startTransmission', currentChannel, playerName);
  } else if (currentChannel !== null && IsControlJustReleased(0, 249)) {
    // Stop transmitting voice data
    NetworkClearVoiceChannel();
    console.log(`Stopped talking on channel ${currentChannel}`);
    emit('chat:addMessage', {
      args: [`You stopped talking on channel ${currentChannel}`],
    });

    // Emit stop transmission message to the server
    emitNet('radio:stopTransmission', currentChannel);
  }
});

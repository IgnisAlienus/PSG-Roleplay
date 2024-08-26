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
    const voiceChannel = `radio_channel_${currentChannel}`;

    // Start transmitting voice data
    NetworkSetVoiceChannel(voiceChannel);
    NetworkSetTalkerProximity(0.0); // Set to 0.0 to transmit to all players in the channel

    console.log(`${playerName} is talking on channel ${currentChannel}`);
    emit('chat:addMessage', {
      args: [`You are now talking on channel ${currentChannel}`],
    });

    // Play start transmission sound
    PlaySoundFrontend(-1, 'Start_Squelch', 'CB_RADIO_SFX', true);
  } else if (currentChannel !== null && IsControlJustReleased(0, 249)) {
    // Stop transmitting voice data
    NetworkClearVoiceChannel();
    console.log(`Stopped talking on channel ${currentChannel}`);
    emit('chat:addMessage', {
      args: [`You stopped talking on channel ${currentChannel}`],
    });

    // Play stop transmission sound
    PlaySoundFrontend(-1, 'End_Squelch', 'CB_RADIO_SFX', true);
  }
});

let clientsInChannel = {}; // Track clients per channel
let playerBanks = {}; // Track current bank of each player
let activeTalkers = {}; // Track active talkers per channel

function broadcastVoiceChange(source, channelIdx, state) {
  if (clientsInChannel[channelIdx]) {
    clientsInChannel[channelIdx].forEach((clientInChannel) => {
      emitNet(
        'onPlayerChangeVoiceChannels',
        clientInChannel,
        clientsInChannel[channelIdx],
        channelIdx,
        state
      );
      if (state === 'joined' && clientInChannel !== source) {
        emitNet('rxStatus', clientInChannel, true); // Show RX indicator for other clients
      } else if (state === 'left' && clientInChannel !== source) {
        emitNet('rxStatus', clientInChannel, false); // Hide RX indicator for other clients
      }
    });
  }
}

// Listen for the event from any client
onNet('panicPressed', () => {
  // Broadcast the event to all players
  emitNet('playPanicForAll', -1);
});

onNet('playerDropped', (reason) => {
  leaveAnyOldChannels(global.source);
});

function leaveAnyOldChannels(source) {
  for (let channelIdx in clientsInChannel) {
    let channel = clientsInChannel[channelIdx];
    for (let clientKey in channel) {
      if (channel[clientKey] === source) {
        removeClientFromChannel(source, clientKey, channelIdx);
      }
    }
  }
}

function removeClientFromChannel(source, clientKey, channelIdx) {
  broadcastVoiceChange(source, channelIdx, 'left');
  clientsInChannel[channelIdx].splice(clientKey, 1);
  if (activeTalkers[channelIdx] === source) {
    delete activeTalkers[channelIdx]; // Remove as active talker
  }
}

RegisterCommand(
  'joinchannel',
  (source, args, rawCommand) => {
    let channelIdx = parseInt(args[0]);
    if (!clientsInChannel[channelIdx]) {
      clientsInChannel[channelIdx] = [];
    }

    leaveAnyOldChannels(source);
    clientsInChannel[channelIdx].push(source);
    broadcastVoiceChange(source, channelIdx, 'joined');
  },
  false
);

onNet('switchChannel', (channel) => {
  let source = global.source;
  leaveAnyOldChannels(source);
  if (!clientsInChannel[channel]) {
    clientsInChannel[channel] = [];
  }
  clientsInChannel[channel].push(source);
  broadcastVoiceChange(source, channel, 'joined');
});

onNet('switchBank', (bank) => {
  let source = global.source;
  playerBanks[source] = bank;
  emitNet('onBankSwitched', source, bank);
});

// Handle PTT press request
onNet('requestTalk', (channel) => {
  let source = global.source;
  if (activeTalkers[channel]) {
    emitNet('playBusySound', source); // Channel is busy, notify the client
  } else {
    activeTalkers[channel] = source;
    emitNet('startTalking', source, channel);

    // Also enable proximity voice
    emitNet('setProximityVoice', source, true);
  }
});

onNet('stopTalking', (channel) => {
  let source = global.source;
  if (activeTalkers[channel] === source) {
    delete activeTalkers[channel];
    emitNet('setProximityVoice', source, false);
  }
});

onNet('setProximityVoice', (source, enable) => {
  emitNet('toggleProximityVoice', -1, source, enable);
});

onNet('toggleProximityVoice', (source, enable) => {
  if (enable) {
    NetworkSetTalkerProximity(proximityRange);
  } else {
    NetworkSetTalkerProximity(-1.0); // Reset to default
  }
});

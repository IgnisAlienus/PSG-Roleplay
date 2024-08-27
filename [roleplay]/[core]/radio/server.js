let clientsInChannel = {}; // Will be used to define a list of clients per channel
let playerBanks = {}; // Will be used to track the current bank of each player

function broadcastVoiceChange(source, channelIdx, state) {
  // source is the client that changed channels, broadcasting to other clients
  // Let any other clients in this channel know that we changed
  // Also send the list of clients, passed as the second argument at onPlayerChangeVoiceChannels
  // to assign their volume and targets
  if (clientsInChannel[channelIdx]) {
    clientsInChannel[channelIdx].forEach((clientInChannel) => {
      emitNet(
        'onPlayerChangeVoiceChannels',
        clientInChannel,
        clientsInChannel[channelIdx],
        channelIdx,
        state
      );
    });
  }
}

on('playerDropped', (reason) => {
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
}

RegisterCommand(
  'joinchannel',
  (source, args, rawCommand) => {
    let channelIdx = parseInt(args[0]);
    // Create the channel if it doesn't exist
    if (!clientsInChannel[channelIdx]) {
      clientsInChannel[channelIdx] = [];
    }

    leaveAnyOldChannels(source);

    // Join the channel
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
  // Handle any additional logic for bank switching if needed
  // For example, you might want to notify the client about the bank change
  emitNet('onBankSwitched', source, bank);
});

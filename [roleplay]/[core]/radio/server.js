const voiceChannels = {};
const transmittingPlayers = {};

onNet('radio:tuneChannel', (channel) => {
  const player = source;
  voiceChannels[player] = channel;
});

onNet('radio:startTransmit', (channel) => {
  const player = source;
  transmittingPlayers[player] = channel;
  // Handle voice data capture here or initiate a process to gather voice data
});

onNet('radio:stopTransmit', () => {
  const player = source;
  delete transmittingPlayers[player];
});

onNet('radio:transmitVoice', (voiceData) => {
  const player = source;
  const channel = transmittingPlayers[player];

  if (channel) {
    for (let [id, tunedChannel] of Object.entries(voiceChannels)) {
      if (tunedChannel === channel) {
        emitNet('radio:receiveVoice', id, voiceData);
      }
    }
  }
});

onNet('radio:webTransmit', (channel, voiceData) => {
  for (let [id, tunedChannel] of Object.entries(voiceChannels)) {
    if (tunedChannel === channel) {
      emitNet('radio:receiveVoice', id, voiceData);
    }
  }
});

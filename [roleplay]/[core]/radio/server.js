const voiceChannels = {};

onNet('radio:tuneChannel', (channel) => {
  const player = source;
  voiceChannels[player] = channel;
});

onNet('radio:transmitVoice', (voiceData) => {
  const player = source;
  const channel = voiceChannels[player];

  for (let [id, tunedChannel] of Object.entries(voiceChannels)) {
    if (tunedChannel === channel) {
      emitNet('radio:receiveVoice', id, voiceData);
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

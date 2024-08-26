let currentChannel = null;
let isScanning = false;
let availableChannels = {
  bank1: [1, 2, 3],
  bank2: [4, 5, 6],
};

let scanInterval;

function tuneToChannel(channel) {
  currentChannel = channel;
  isScanning = false;
  clearInterval(scanInterval);
  SendNuiMessage(JSON.stringify({ type: 'updateChannel', channel }));
  emitNet('radio:tuneChannel', channel);
}

function startScan() {
  isScanning = true;
  let bank = 'bank1';
  let channelIndex = 0;

  scanInterval = setInterval(() => {
    tuneToChannel(availableChannels[bank][channelIndex]);
    channelIndex = (channelIndex + 1) % availableChannels[bank].length;
  }, 1000); // 1 seconds per channel
}

RegisterCommand(
  'radio',
  (source, args) => {
    const channel = parseInt(args[0]);
    if (isNaN(channel)) return;

    tuneToChannel(channel);
  },
  false
);

RegisterCommand(
  'scan',
  () => {
    startScan();
  },
  false
);

RegisterNUICallback('stopScan', () => {
  isScanning = false;
  clearInterval(scanInterval);
});

onNet('radio:receiveVoice', (voiceData) => {
  // Handle voice data received from the server
  SendNuiMessage(JSON.stringify({ type: 'playVoice', voiceData }));
});

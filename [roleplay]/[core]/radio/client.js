let currentChannel = null;
let isTransmitting = false;
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
  }, 3000); // 3 seconds per channel
}

function startTransmitting() {
  if (currentChannel && !isTransmitting) {
    isTransmitting = true;
    emitNet('radio:startTransmit', currentChannel);
    SendNuiMessage(JSON.stringify({ type: 'transmitting', status: true }));
  }
}

function stopTransmitting() {
  if (isTransmitting) {
    isTransmitting = false;
    emitNet('radio:stopTransmit');
    SendNuiMessage(JSON.stringify({ type: 'transmitting', status: false }));
  }
}

// Register keypress event for 'N' key
setTick(() => {
  if (IsControlJustPressed(0, 249)) {
    // 'N' key press
    startTransmitting();
  } else if (IsControlJustReleased(0, 249)) {
    // 'N' key release
    stopTransmitting();
  }
});

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

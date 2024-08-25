let radioChannels = ['Channel 1', 'Channel 2', 'Channel 3', 'Channel 4'];
let currentChannelIndex = 0;
let scanMode = false;
let isTalking = false;

function updateRadioUI() {
  SendNUIMessage({
    type: 'updateRadio',
    channel: radioChannels[currentChannelIndex],
    scan: scanMode,
  });
}

function scanChannels() {
  scanMode = true;
  let scanIndex = 0;

  let scanInterval = setInterval(() => {
    if (!scanMode) {
      clearInterval(scanInterval);
      return;
    }

    console.log(`Scanning ${radioChannels[scanIndex]}...`);
    scanIndex = (scanIndex + 1) % radioChannels.length;

    // Add logic to detect activity here
  }, 1000);
}

// Register the F1 keybind to toggle the radio UI
RegisterCommand(
  'toggleRadio',
  () => {
    SendNUIMessage({
      type: 'toggleRadio',
    });
  },
  false
);

RegisterKeyMapping('toggleRadio', 'Toggle Radio', 'keyboard', 'F1');
RegisterKeyMapping('startTransmission', 'Start Transmission', 'keyboard', 'N');
RegisterKeyMapping('stopTransmission', 'Stop Transmission', 'keyboard', 'N');

// Register the N keybind for push-to-talk
RegisterCommand(
  'startTransmission',
  () => {
    console.log('Starting transmission...');
    startTransmission();
  },
  false
);

RegisterCommand(
  'stopTransmission',
  () => {
    console.log('Stopping transmission...');
    stopTransmission();
  },
  false
);

// Handle NUI callbacks
RegisterNuiCallbackType('openRadio', (data, cb) => {
  // Handle opening the radio
  cb('ok');
});

RegisterNuiCallbackType('closeRadio', (data, cb) => {
  // Handle closing the radio
  cb('ok');
});

RegisterCommand('radio', () => {
  updateRadioUI();
});

RegisterNuiCallbackType('changeChannel', (data) => {
  let previousChannel = radioChannels[currentChannelIndex];
  currentChannelIndex =
    data.direction === 'next'
      ? (currentChannelIndex + 1) % radioChannels.length
      : (currentChannelIndex - 1 + radioChannels.length) % radioChannels.length;

  let newChannel = radioChannels[currentChannelIndex];
  updateRadioUI();

  // Notify server about channel change
  emitNet('radio:changeChannel', previousChannel, newChannel);
});

RegisterNuiCallbackType('toggleScan', () => {
  scanMode = !scanMode;
  if (scanMode) {
    scanChannels();
  } else {
    console.log('Scanning stopped.');
  }
  updateRadioUI();
});

RegisterNuiCallbackType('closeRadio', () => {
  scanMode = false;
});

RegisterNuiCallbackType('openRadio', () => {
  updateRadioUI();
});

function startTransmission() {
  if (!isTalking) {
    isTalking = true;
    emitNet('radio:startTransmission', radioChannels[currentChannelIndex]);
    SendNUIMessage({
      type: 'transmissionStart',
    });
  }
}

function stopTransmission() {
  if (isTalking) {
    isTalking = false;
    emitNet('radio:endTransmission');
    SendNUIMessage({
      type: 'transmissionEnd',
    });
  }
}

// Use an event listener to receive voice data from the server
onNet('radio:receive', (data) => {
  // Logic to play received voice data goes here
  console.log(`Receiving transmission from channel ${data.channel}`);
  SendNUIMessage({
    type: 'transmissionStart',
  });
  setTimeout(() => {
    SendNUIMessage({
      type: 'transmissionEnd',
    });
  }, data.duration || 1000); // Assuming data.duration is the duration of the transmission
});

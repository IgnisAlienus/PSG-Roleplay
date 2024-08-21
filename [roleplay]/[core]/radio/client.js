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
    SetNuiFocus(true, true);
    SendNUIMessage({
      type: 'toggleRadio',
    });
  },
  false
);

RegisterKeyMapping('toggleRadio', 'Toggle Radio', 'keyboard', 'F1');

// Register the N keybind for push-to-talk
RegisterCommand(
  'startTransmission',
  () => {
    SendNUIMessage({
      type: 'startTransmission',
    });
  },
  false
);

RegisterCommand(
  'stopTransmission',
  () => {
    SendNUIMessage({
      type: 'stopTransmission',
    });
  },
  false
);

RegisterKeyMapping('startTransmission', 'Start Transmission', 'keyboard', 'N');
RegisterKeyMapping('stopTransmission', 'Stop Transmission', 'keyboard', 'N');

// Handle NUI callbacks
RegisterNUICallback('openRadio', (data, cb) => {
  // Handle opening the radio
  cb('ok');
});

RegisterNUICallback('closeRadio', (data, cb) => {
  // Handle closing the radio
  cb('ok');
});

RegisterCommand('radio', () => {
  SetNuiFocus(true, true);
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
  SetNuiFocus(false, false);
  scanMode = false;
});

RegisterNuiCallbackType('openRadio', () => {
  SetNuiFocus(true, true);
  updateRadioUI();
});

function startTransmission() {
  if (!isTalking) {
    isTalking = true;
    emitNet('radio:startTransmission', radioChannels[currentChannelIndex]);
  }
}

function stopTransmission() {
  if (isTalking) {
    isTalking = false;
    emitNet('radio:endTransmission');
  }
}

// Use an event listener to receive voice data from the server
onNet('radio:receive', (data) => {
  // Logic to play received voice data goes here
  console.log(`Receiving transmission from channel ${data.channel}`);
});

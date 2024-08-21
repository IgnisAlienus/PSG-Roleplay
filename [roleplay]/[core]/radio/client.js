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

RegisterCommand('radio', () => {
  SetNuiFocus(true, true);
  updateRadioUI();
});

// Register the callback types
RegisterNuiCallbackType('changeChannel');
RegisterNuiCallbackType('toggleScan');
RegisterNuiCallbackType('closeRadio');

RegisterNUICallback('changeChannel', (data) => {
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

RegisterNUICallback('toggleScan', () => {
  scanMode = !scanMode;
  if (scanMode) {
    scanChannels();
  } else {
    console.log('Scanning stopped.');
  }
  updateRadioUI();
});

RegisterNUICallback('closeRadio', () => {
  SetNuiFocus(false, false);
  scanMode = false;
});

RegisterNUICallback('openRadio', () => {
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

// Listen for key press to start transmission
document.addEventListener('keydown', (event) => {
  if (event.key === 'N') {
    // Replace 'N' with the desired key for push-to-talk
    startTransmission();
  }
});

// Listen for key release to stop transmission
document.addEventListener('keyup', (event) => {
  if (event.key === 'N') {
    // Replace 'N' with the desired key for push-to-talk
    stopTransmission();
  }
});

// Use an event listener to receive voice data from the server
onNet('radio:receive', (data) => {
  // Logic to play received voice data goes here
  console.log(`Receiving transmission from channel ${data.channel}`);
});

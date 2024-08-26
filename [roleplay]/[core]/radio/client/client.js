let currentChannel = null;
let isTransmitting = false;
let scanMode = false;

function joinChannel(channel) {
  currentChannel = channel;
  emitNet('radio:joinChannel', channel);
}

function leaveChannel() {
  emitNet('radio:leaveChannel', currentChannel);
  currentChannel = null;
}

function toggleScanMode() {
  scanMode = !scanMode;
  emitNet('radio:toggleScanMode', scanMode);
}

setTick(() => {
  if (IsControlPressed(1, 249)) {
    // N key
    if (!isTransmitting && currentChannel) {
      isTransmitting = true;
      emitNet('radio:startTransmission', currentChannel);
    }
  } else {
    if (isTransmitting) {
      isTransmitting = false;
      emitNet('radio:endTransmission', currentChannel);
    }
  }
});

onNet('radio:receiveMessage', (channel, message) => {
  if (channel === currentChannel || scanMode) {
    SendNUIMessage({
      type: 'radioMessage',
      channel,
      message,
    });
  }
});

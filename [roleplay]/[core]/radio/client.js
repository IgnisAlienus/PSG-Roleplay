// Register event listener for "onPlayerChangeVoiceChannels"
onNet('onPlayerChangeVoiceChannels', (clients, channel, state) => {
  // Join the channel
  if (state === 'joined') {
    MumbleSetVoiceChannel(channel);
  }

  // Go through the list of clients we received from the given channel
  clients.forEach((client) => {
    // We only want to know about other clients
    if (client !== GetPlayerServerId(PlayerId())) {
      console.log(`Syncing client: ${client} to channel (${state})`);
    }

    // Go through the states
    if (state === 'joined') {
      MumbleSetVolumeOverrideByServerId(client, 1.0);
    } else if (state === 'left') {
      if (client !== GetPlayerServerId(PlayerId())) {
        // No point in handling this for ourselves
        MumbleSetVolumeOverrideByServerId(client, -1.0); // Reset their volume levels back to normal
      }
    }
  });
});

// Register command "listenchannel"
RegisterCommand(
  'listenchannel',
  (source, args, rawCommand) => {
    MumbleAddVoiceChannelListen(Number(args[0]));
  },
  false
);

let currentChannel = 1;
let currentBank = 1;
const maxChannel = 10; // Define maximum channel number
const maxBank = 5; // Define maximum bank number

function switchChannel(direction) {
  currentChannel += direction;
  if (currentChannel < 1) currentChannel = 1;
  if (currentChannel > maxChannel) currentChannel = maxChannel; // Enforce maximum channel number
  emitNet('switchChannel', currentChannel);
}

function switchBank(direction) {
  currentBank += direction;
  if (currentBank < 1) currentBank = 1;
  if (currentBank > maxBank) currentBank = maxBank; // Enforce maximum bank number
  emitNet('switchBank', currentBank);
}

RegisterCommand('switchChannelLeft', () => switchChannel(-1), false);
RegisterCommand('switchChannelRight', () => switchChannel(1), false);
RegisterCommand('switchBankUp', () => switchBank(1), false);
RegisterCommand('switchBankDown', () => switchBank(-1), false);

RegisterKeyMapping(
  'switchChannelLeft',
  'Switch Channel Left',
  'keyboard',
  'NUMPAD4'
);
RegisterKeyMapping(
  'switchChannelRight',
  'Switch Channel Right',
  'keyboard',
  'NUMPAD6'
);
RegisterKeyMapping('switchBankUp', 'Switch Bank Up', 'keyboard', 'NUMPAD8');
RegisterKeyMapping('switchBankDown', 'Switch Bank Down', 'keyboard', 'NUMPAD2');

// PTT (Push-To-Talk) Implementation
setTick(() => {
  if (IsControlPressed(0, 249)) {
    // 249 is the control ID for 'N'
    // Enable voice transmission
    NetworkSetTalkerProximity(0.0); // Set to 0.0 to talk to all players in the channel
  } else {
    // Disable voice transmission
    NetworkSetTalkerProximity(-1.0); // Set to -1.0 to disable talking
  }
});

// Update Radio UI
function updateRadioUI() {
  SendNUIMessage({
    type: 'updateRadio',
    channel: currentChannel,
    bank: currentBank,
  });
}

// Event listeners for channel and bank switching
onNet('switchChannel', (channel) => {
  currentChannel = channel;
  updateRadioUI();
});

onNet('switchBank', (bank) => {
  currentBank = bank;
  updateRadioUI();
});

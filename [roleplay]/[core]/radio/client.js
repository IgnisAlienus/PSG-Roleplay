let isPttPressed = false;

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

function switchBank(direction) {
  currentBank += direction;
  if (currentBank < 1) currentBank = 1;
  if (currentBank > maxBank) currentBank = maxBank; // Enforce maximum bank number
  emitNet('switchBank', currentBank);
  PlaySoundFrontend(-1, 'NAV_UP_DOWN', 'HUD_FRONTEND_DEFAULT_SOUNDSET', true); // Play bank switch sound effect
  updateRadioUI(); // Update the radio UI
}

function switchChannel(direction) {
  currentChannel += direction;
  if (currentChannel < 1) currentChannel = 1;
  if (currentChannel > maxChannel) currentChannel = maxChannel; // Enforce maximum channel number
  emitNet('switchChannel', currentChannel);
  PlaySoundFrontend(-1, 'NAV_UP_DOWN', 'HUD_FRONTEND_DEFAULT_SOUNDSET', true); // Play channel switch sound effect
  updateRadioUI(); // Update the radio UI
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
    if (!isPttPressed) {
      isPttPressed = true;
      PlaySoundFrontend(-1, 'Start_Squelch', 'CB_RADIO_SFX', true); // Play keyup sound effect
      NetworkSetTalkerProximity(0.0); // Set to 0.0 to talk to all players in the channel
      SendNUIMessage({ type: 'txStatus', status: true }); // Show TX indicator
    }
  } else {
    if (isPttPressed) {
      isPttPressed = false;
      PlaySoundFrontend(-1, 'End_Squelch', 'CB_RADIO_SFX', true); // Play tx finished sound effect
      NetworkSetTalkerProximity(-1.0); // Set to -1.0 to disable talking
      SendNUIMessage({ type: 'txStatus', status: false }); // Hide TX indicator
    }
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

// Event listener for RX status
onNet('rxStatus', (status) => {
  SendNUIMessage({ type: 'rxStatus', status: status });
});

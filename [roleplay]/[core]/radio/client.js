let isPttPressed = false;
let panicPressCount = 0;
let panicTimer = null;
let pttPressStartTime = null;

function playCustomSound(soundName) {
  console.log(`Attempting to play sound: ${soundName}`);
  const soundId = GetSoundId();
  if (soundId === -1) {
    console.error('Failed to get sound ID');
    return;
  }
  console.log(`Playing sound with ID: ${soundId}`);

  // Play the sound, referencing the sound name directly
  PlaySoundFrontend(-1, soundName, '', true); // The third parameter is empty for direct .wav usage

  ReleaseSoundId(soundId);
  console.log(`Sound ${soundName} played and released`);
}

// Define the panic action
function triggerPanic() {
  console.log('Panic button activated!');
  // Add any additional panic actions here, e.g., notify other players, send an alert, etc.
  emitNet('playSoundForAll', 'panic');
}

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
  playCustomSound('button');
  updateRadioUI(); // Update the radio UI
}

function switchChannel(direction) {
  currentChannel += direction;
  if (currentChannel < 1) currentChannel = 1;
  if (currentChannel > maxChannel) currentChannel = maxChannel; // Enforce maximum channel number
  emitNet('switchChannel', currentChannel);
  playCustomSound('button');
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
      if (!pttPressStartTime) {
        pttPressStartTime = Date.now();
      } else if (Date.now() - pttPressStartTime >= 500) {
        isPttPressed = true;
        playCustomSound('keyup'); // Play custom keyup sound effect
        NetworkSetTalkerProximity(0.0); // Set to 0.0 to talk to all players in the channel
        SendNUIMessage({ type: 'txStatus', status: true }); // Show TX indicator
      }
    }
  } else {
    if (isPttPressed) {
      isPttPressed = false;
      playCustomSound('outro'); // Play custom tx finished sound effect
      NetworkSetTalkerProximity(-1.0); // Set to -1.0 to disable talking
      SendNUIMessage({ type: 'txStatus', status: false }); // Hide TX indicator
    }
    pttPressStartTime = null;
  }

  // Panic button logic
  if (IsControlJustPressed(0, 249)) {
    // N key
    panicPressCount++;
    if (panicPressCount === 1) {
      panicTimer = setTimeout(() => {
        panicPressCount = 0;
      }, 1000); // Reset counter after 1 second
    } else if (panicPressCount === 3) {
      clearTimeout(panicTimer);
      panicPressCount = 0;
      triggerPanic(); // Trigger panic action
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

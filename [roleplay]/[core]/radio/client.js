let isPttPressed = false;
let panicPressCount = 0;
let panicTimer = null;
let pttPressStartTime = null;

// Load the sound files when the resource starts
on('onClientResourceStart', (resourceName) => {
  if (GetCurrentResourceName() === resourceName) {
    // Preload the sound files
    RequestScriptAudioBank('sounds/button.wav', false);
    RequestScriptAudioBank('sounds/keyup.wav', false);
    RequestScriptAudioBank('sounds/outro.wav', false);
    RequestScriptAudioBank('sounds/panic.wav', false);
    RequestScriptAudioBank('sounds/busy.wav', false);
  }
});

function playCustomSound(soundName) {
  SendNUIMessage({
    type: 'playSound',
    soundName: soundName,
  });
}

// Listen for the server event to play the "busy" sound
onNet('playBusySound', () => {
  playCustomSound('busy');
});

// Listen for the server event to play the panic sound
onNet('playPanicForAll', () => {
  playCustomSound('panic');
  NetworkSetTalkerProximity(0.0); // Set to 0.0 to talk to all players in the channel
  // Close the mic after 30 seconds
  setTimeout(() => {
    NetworkSetTalkerProximity(-1.0); // Close the mic after the duration
    playCustomSound('outro'); // Play the outro sound
    SendNUIMessage({ type: 'txStatus', status: false }); // Hide TX indicator
    isPttPressed = false;
  }, 30000);
});

// Listen for server confirmation to start talking
onNet('startTalking', (channel) => {
  playCustomSound('keyup');
  NetworkSetTalkerProximity(0.0); // Set to 0.0 to talk to all players in the channel
  SendNUIMessage({ type: 'txStatus', status: true }); // Show TX indicator
});

// Listen for the panic activation to open mic
onNet('openMicForPanic', () => {
  playCustomSound('panic'); // Play the panic sound
  openMicForDuration(30); // Open the mic for 30 seconds
});

// Function to open mic for a specified duration
function openMicForDuration(seconds) {
  NetworkSetTalkerProximity(0.0); // Open mic to talk to all players
  SendNUIMessage({ type: 'txStatus', status: true }); // Show TX indicator

  setTimeout(() => {
    NetworkSetTalkerProximity(-1.0); // Close the mic after the duration
    playCustomSound('outro'); // Play the outro sound
    SendNUIMessage({ type: 'txStatus', status: false }); // Hide TX indicator
  }, seconds * 1000);
}

// Register event listener for "onPlayerChangeVoiceChannels"
onNet('onPlayerChangeVoiceChannels', (clients, channel, state) => {
  // Join the channel
  if (state === 'joined') {
    MumbleSetVoiceChannel(channel);
  }

  // Sync other clients' states in the channel
  clients.forEach((client) => {
    if (client !== GetPlayerServerId(PlayerId())) {
      console.log(`Syncing client: ${client} to channel (${state})`);
    }

    if (state === 'joined') {
      MumbleSetVolumeOverrideByServerId(client, 1.0);
    } else if (state === 'left') {
      if (client !== GetPlayerServerId(PlayerId())) {
        MumbleSetVolumeOverrideByServerId(client, -1.0); // Reset volume
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
const maxChannel = 10;
const maxBank = 5;

function switchBank(direction) {
  currentBank += direction;
  if (currentBank < 1) currentBank = 1;
  if (currentBank > maxBank) currentBank = maxBank; // Enforce max bank number
  emitNet('switchBank', currentBank);
  playCustomSound('button');
  updateRadioUI();
}

function switchChannel(direction) {
  currentChannel += direction;
  if (currentChannel < 1) currentChannel = 1;
  if (currentChannel > maxChannel) currentChannel = maxChannel; // Enforce max channel number
  emitNet('switchChannel', currentChannel);
  playCustomSound('button');
  updateRadioUI();
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
    // N key for PTT
    if (!isPttPressed) {
      if (!pttPressStartTime) {
        pttPressStartTime = Date.now();
      } else if (Date.now() - pttPressStartTime >= 500) {
        isPttPressed = true;
        emitNet('requestTalk', currentChannel); // Request to talk on the current channel
      }
    }
  } else {
    if (isPttPressed) {
      isPttPressed = false;
      playCustomSound('outro');
      emitNet('stopTalking', currentChannel); // Notify the server that the player stopped talking
      NetworkSetTalkerProximity(-1.0); // Set to -1.0 to disable talking
      SendNUIMessage({ type: 'txStatus', status: false }); // Hide TX indicator
    }
    pttPressStartTime = null;
  }

  // Panic button logic
  if (IsControlJustPressed(0, 249)) {
    // N key for Panic
    panicPressCount++;
    if (panicPressCount === 1) {
      panicTimer = setTimeout(() => {
        panicPressCount = 0;
      }, 1000); // Reset counter after 1 second
    } else if (panicPressCount === 3) {
      clearTimeout(panicTimer);
      panicPressCount = 0;
      console.log('Panic button activated!');
      isPttPressed = true;
      emitNet('panicPressed', 'panic');
      SendNUIMessage({ type: 'txStatus', status: true }); // Show TX indicator
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

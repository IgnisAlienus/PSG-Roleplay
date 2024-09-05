let isPttPressed = false;
let isPanicPressed = false;
let panicPressCount = 0;
let panicTimer = null;
let pttPressStartTime = null;
let proximityRange = 15.0; // Adjust as needed
let isTalkingOnRadio = false;

// Load the sound files when the resource starts
on("onClientResourceStart", (resourceName) => {
  if (GetCurrentResourceName() === resourceName) {
    // Preload the sound files
    RequestScriptAudioBank("sounds/button.wav", false);
    RequestScriptAudioBank("sounds/keyup.wav", false);
    RequestScriptAudioBank("sounds/outro.wav", false);
    RequestScriptAudioBank("sounds/panic.wav", false);
    RequestScriptAudioBank("sounds/busy.wav", false);
  }
});

function playCustomSound(soundName) {
  SendNUIMessage({
    type: "playSound",
    soundName: soundName,
  });
}

// Listen for the server event to play the "busy" sound
onNet("playBusySound", () => {
  playCustomSound("busy");
});

// Listen for the server event to play the panic sound
onNet("playPanicForAll", () => {
  playCustomSound("panic");
  NetworkSetTalkerProximity(proximityRange); // Enable proximity voices
  MumbleAddVoiceTargetChannel(1, GetPlayerServerId(PlayerId())); // Also talk on the radio
  // Close the mic after 15 seconds
  setTimeout(() => {
    console.log("Panic button timeout");
    NetworkSetTalkerProximity(-1.0); // Close the mic after the duration
    playCustomSound("outro"); // Play the outro sound
    SendNUIMessage({ type: "txStatus", status: false }); // Hide TX indicator
    isPanicPressed = false;
    isTalkingOnRadio = false;
  }, 15000);
});

// Listen for server confirmation to start talking
onNet("startTalking", (channel) => {
  playCustomSound("keyup");
  NetworkSetTalkerProximity(0.0); // Set to 0.0 to talk to all players in the channel
  SendNUIMessage({ type: "txStatus", status: true }); // Show TX indicator
});

// Register event listener for "onPlayerChangeVoiceChannels"
onNet("onPlayerChangeVoiceChannels", (clients, channel, state) => {
  // Join the channel
  if (state === "joined") {
    MumbleSetVoiceChannel(channel);
  }

  // Sync other clients' states in the channel
  clients.forEach((client) => {
    if (client !== GetPlayerServerId(PlayerId())) {
      console.log(`Syncing client: ${client} to channel (${state})`);
    }

    if (state === "joined") {
      MumbleSetVolumeOverrideByServerId(client, 1.0);
    } else if (state === "left") {
      if (client !== GetPlayerServerId(PlayerId())) {
        MumbleSetVolumeOverrideByServerId(client, -1.0); // Reset volume
      }
    }
  });
});

// Register command "listenchannel"
RegisterCommand(
  "listenchannel",
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
  if (isPttPressed || isPanicPressed) {
    playCustomSound("busy");
    return; // Prevent switching banks while talking
  }
  currentBank += direction;
  if (currentBank < 1) currentBank = 1;
  if (currentBank > maxBank) currentBank = maxBank; // Enforce max bank number
  emitNet("switchBank", currentBank);
  playCustomSound("button");
  updateRadioUI();
}

function switchChannel(direction) {
  if (isPttPressed || isPanicPressed) {
    playCustomSound("busy");
    return; // Prevent switching channels while talking
  }
  currentChannel += direction;
  if (currentChannel < 1) currentChannel = 1;
  if (currentChannel > maxChannel) currentChannel = maxChannel; // Enforce max channel number
  emitNet("switchChannel", currentChannel);
  playCustomSound("button");
  updateRadioUI();
}

RegisterCommand("switchChannelLeft", () => switchChannel(-1), false);
RegisterCommand("switchChannelRight", () => switchChannel(1), false);
RegisterCommand("switchBankUp", () => switchBank(1), false);
RegisterCommand("switchBankDown", () => switchBank(-1), false);

RegisterKeyMapping(
  "switchChannelLeft",
  "Switch Channel Left",
  "keyboard",
  "NUMPAD4"
);
RegisterKeyMapping(
  "switchChannelRight",
  "Switch Channel Right",
  "keyboard",
  "NUMPAD6"
);
RegisterKeyMapping("switchBankUp", "Switch Bank Up", "keyboard", "NUMPAD8");
RegisterKeyMapping("switchBankDown", "Switch Bank Down", "keyboard", "NUMPAD2");

// PTT (Push-To-Talk) Implementation
setTick(() => {
  if (IsControlPressed(0, 249)) {
    // N key for PTT
    if (!isPttPressed && !isPanicPressed) {
      if (!pttPressStartTime) {
        pttPressStartTime = Date.now();
      } else if (Date.now() - pttPressStartTime >= 500) {
        isPttPressed = true;
        isTalkingOnRadio = true;
        emitNet("requestTalk", currentChannel); // Request to talk on the current channel

        // Set proximity voice to talk to nearby players
        NetworkSetTalkerProximity(proximityRange);
        MumbleAddVoiceTargetChannel(1, GetPlayerServerId(PlayerId()));
      }
    }
  } else {
    if (isPttPressed) {
      isPttPressed = false;
      isTalkingOnRadio = false;
      playCustomSound("outro");
      emitNet("stopTalking", currentChannel); // Notify the server that the player stopped talking

      // Reset proximity voice to default
      NetworkSetTalkerProximity(proximityRange);
      MumbleClearVoiceTarget(1);
      SendNUIMessage({ type: "txStatus", status: false }); // Hide TX indicator
    }
    pttPressStartTime = null;
  }

  // Panic button logic
  if (IsControlJustPressed(0, 73)) {
    // X key for Panic
    panicPressCount++;
    if (panicPressCount === 1) {
      panicTimer = setTimeout(() => {
        panicPressCount = 0;
      }, 1000); // Reset counter after 1 second
    } else if (panicPressCount === 3) {
      clearTimeout(panicTimer);
      panicPressCount = 0;
      console.log("Panic button activated!");
      isPanicPressed = true;
      isTalkingOnRadio = true;
      SendNUIMessage({ type: "txStatus", status: true }); // Show TX indicator
      emitNet("panicPressed", "panic");
    }
  }
});

setTick(() => {
  if (!isTalkingOnRadio && NetworkIsPlayerTalking(PlayerId())) {
    NetworkSetTalkerProximity(proximityRange);
  }
});

// Update Radio UI
function updateRadioUI() {
  SendNUIMessage({
    type: "updateRadio",
    channel: currentChannel,
    bank: currentBank,
  });
}

// Event listeners for channel and bank switching
onNet("switchChannel", (channel) => {
  currentChannel = channel;
  updateRadioUI();
});

onNet("switchBank", (bank) => {
  currentBank = bank;
  updateRadioUI();
});

// Event listener for RX status
onNet("rxStatus", (status) => {
  SendNUIMessage({ type: "rxStatus", status: status });
});

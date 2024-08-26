let currentChannel = 1;
let isPTTActive = false;

// Set up the radio channels and UI
function setupRadio() {
  // Create an event listener for the PTT button
  document.addEventListener('keydown', (event) => {
    if (event.code === 'KeyN') {
      isPTTActive = true;
      emitRadioUpdate(); // Notify other players that you're talking
    }
  });

  document.addEventListener('keyup', (event) => {
    if (event.code === 'KeyN') {
      isPTTActive = false;
      emitRadioUpdate(); // Notify other players that you're not talking
    }
  });

  // Add code to update UI
  updateUI();
}

function emitRadioUpdate() {
  // Emit an event to the server to update the radio status
  emitNet('radio:update', {
    channel: currentChannel,
    talking: isPTTActive,
  });
}

function updateUI() {
  // Function to update the radio UI
  // This would involve sending data to the UI HTML
}

// Event handler for receiving radio updates
onNet('radio:update', (data) => {
  updateUIWithData(data); // Update the UI with the new data
});

// Call setup on resource start
setupRadio();

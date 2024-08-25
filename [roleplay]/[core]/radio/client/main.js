let isTransmitting = false;

const RADIO_KEY = 137; // E key, you can change this to any key

// Function to start transmitting voice data
function startTransmitting() {
  isTransmitting = true;
  console.log('Radio transmission started');
  // Code to start capturing and sending voice data to the server
  // ...
}

// Function to stop transmitting voice data
function stopTransmitting() {
  isTransmitting = false;
  console.log('Radio transmission stopped');
  // Code to stop capturing and sending voice data
  // ...
}

// Detect when the radio key is pressed or released
setTick(() => {
  if (IsControlJustPressed(0, RADIO_KEY) && !isTransmitting) {
    startTransmitting();
  } else if (IsControlJustReleased(0, RADIO_KEY) && isTransmitting) {
    stopTransmitting();
  }
});

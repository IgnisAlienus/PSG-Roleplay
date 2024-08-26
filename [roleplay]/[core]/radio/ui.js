// Example function to update the UI with received data
function updateUIWithData(data) {
  document.getElementById(
    'channel-info'
  ).innerText = `Channel: ${data.channel}`;
  document.getElementById('status-info').innerText = `Status: ${
    data.talking ? 'Talking' : 'Idle'
  }`;
}

// Listen for events from the client script
window.addEventListener('message', (event) => {
  if (event.data.type === 'radio:update') {
    updateUIWithData(event.data);
  }
});

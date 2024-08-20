document.getElementById('prev-channel').addEventListener('click', () => {
  fetch(`https://${GetParentResourceName()}/changeChannel`, {
    method: 'POST',
    body: JSON.stringify({ direction: 'prev' }),
  });
});

document.getElementById('next-channel').addEventListener('click', () => {
  fetch(`https://${GetParentResourceName()}/changeChannel`, {
    method: 'POST',
    body: JSON.stringify({ direction: 'next' }),
  });
});

document.getElementById('scan-toggle').addEventListener('click', () => {
  fetch(`https://${GetParentResourceName()}/toggleScan`, {
    method: 'POST',
  });
});

document.getElementById('close-radio').addEventListener('click', () => {
  document.getElementById('radio-container').style.display = 'none';
  fetch(`https://${GetParentResourceName()}/closeRadio`, {
    method: 'POST',
  });
});

window.addEventListener('message', (event) => {
  if (event.data.type === 'updateRadio') {
    document.getElementById('channel-display').innerText = event.data.channel;
    document.getElementById('scan-display').innerText = `Scanning: ${
      event.data.scan ? 'On' : 'Off'
    }`;
  }
});

// Toggle radio UI visibility with a keybind
document.addEventListener('keydown', (event) => {
  if (event.key === 'F1') {
    // Replace 'F1' with the desired key
    const radioContainer = document.getElementById('radio-container');
    if (
      radioContainer.style.display === 'none' ||
      radioContainer.style.display === ''
    ) {
      radioContainer.style.display = 'block';
      fetch(`https://${GetParentResourceName()}/openRadio`, {
        method: 'POST',
      });
    } else {
      radioContainer.style.display = 'none';
      fetch(`https://${GetParentResourceName()}/closeRadio`, {
        method: 'POST',
      });
    }
  }
});

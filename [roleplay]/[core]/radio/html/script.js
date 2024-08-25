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

// Add event listeners for keydown and keyup events
document.addEventListener('keydown', (event) => {
  if (event.key === 'N' && !event.repeat) {
    fetch(`https://${GetParentResourceName()}/startTransmission`, {
      method: 'POST',
    });
  }
});

document.addEventListener('keyup', (event) => {
  if (event.key === 'N') {
    fetch(`https://${GetParentResourceName()}/stopTransmission`, {
      method: 'POST',
    });
  }
});

window.addEventListener('message', (event) => {
  if (event.data.type === 'updateRadio') {
    document.getElementById('channel-display').innerText = event.data.channel;
    document.getElementById('scan-display').innerText = `Scanning: ${
      event.data.scan ? 'On' : 'Off'
    }`;
  } else if (event.data.type === 'toggleRadio') {
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
  } else if (event.data.type === 'startTransmission') {
    fetch(`https://${GetParentResourceName()}/startTransmission`, {
      method: 'POST',
    });
    document.getElementById('transmission-status').style.backgroundColor =
      'green';
  } else if (event.data.type === 'stopTransmission') {
    fetch(`https://${GetParentResourceName()}/stopTransmission`, {
      method: 'POST',
    });
    document.getElementById('transmission-status').style.backgroundColor =
      'transparent';
  } else if (event.data.type === 'transmissionStart') {
    document.getElementById('transmission-status').style.backgroundColor =
      'red';
  } else if (event.data.type === 'transmissionEnd') {
    document.getElementById('transmission-status').style.backgroundColor =
      'transparent';
  }
});

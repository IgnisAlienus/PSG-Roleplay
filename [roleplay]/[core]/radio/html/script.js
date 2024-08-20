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

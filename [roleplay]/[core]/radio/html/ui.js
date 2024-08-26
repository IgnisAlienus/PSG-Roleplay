document.getElementById('stop-scan').addEventListener('click', () => {
  fetch(`https://${GetParentResourceName()}/stopScan`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json; charset=UTF-8',
    },
  });
});

window.addEventListener('message', (event) => {
  if (event.data.type === 'updateChannel') {
    document.getElementById(
      'channel-display'
    ).innerText = `Channel: ${event.data.channel}`;
  } else if (event.data.type === 'playVoice') {
    // Handle playing voice data
    const audioElement = new Audio(event.data.voiceUrl);
    audioElement.play();
  }
});

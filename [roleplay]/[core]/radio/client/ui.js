window.addEventListener('message', function (event) {
  if (event.data.type === 'radioMessage') {
    let display = document.getElementById('radio-display');
    let messageElement = document.createElement('div');
    messageElement.innerText = `[Channel ${event.data.channel}] ${event.data.message}`;
    display.appendChild(messageElement);

    setTimeout(() => {
      display.removeChild(messageElement);
    }, 5000);
  }
});

const verifyButton = document.getElementById('verify-btn');
const messageElement = document.getElementById('message');

// Function to show the UI
function showUI() {
  document.body.style.display = 'flex'; // Show the UI
}

// Function to hide the UI
function hideUI() {
  document.body.style.display = 'none'; // Hide the UI
}

verifyButton.addEventListener('click', () => {
  messageElement.textContent = 'Verifying roles, please wait...';

  fetch(`https://${GetParentResourceName()}/verifyRoles`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json; charset=UTF-8',
    },
  })
    .then((response) => {
      if (!response.ok) {
        console.error(
          '[ERROR] Network response was not ok. Status:',
          response.status
        );
        throw new Error('Network response was not ok.');
      }
      return response.json();
    })
    .then((data) => {
      console.log('[DEBUG] Response received:', data);
      if (data.success) {
        messageElement.textContent =
          'Roles verified. You can now access the server.';
        setTimeout(() => {
          hideUI(); // Close the UI after a delay
        }, 3000);
      } else {
        messageElement.textContent =
          'You still do not have the required roles.';
      }
    })
    .catch((error) => {
      console.error('[ERROR] Error during role verification:', error);
      messageElement.textContent =
        'An error occurred while verifying roles. Please try again later.';
    });
});

// Listen for messages from the client to show or hide the UI
window.addEventListener('message', (event) => {
  if (event.data.type === 'showUI') {
    showUI();
  } else if (event.data.type === 'hideUI') {
    hideUI();
  }
});

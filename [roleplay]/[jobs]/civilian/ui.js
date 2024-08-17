const verifyButton = document.getElementById('verify-btn');
const messageElement = document.getElementById('message');

verifyButton.addEventListener('click', () => {
  messageElement.textContent = 'Verifying roles, please wait...';

  fetch('https://cfx-nui-civilian/verifyRoles', {
    method: 'POST',
  })
    .then((response) => {
      console.log(response);
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
        SetNuiFocus(false, false);
        SendNUIMessage({ action: 'hideUI' });
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

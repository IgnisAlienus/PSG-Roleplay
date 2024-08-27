// Event to receive role check result
onNet('civilian:checkRoleResult', (hasRequiredRole) => {
  console.log(`[DEBUG] Received role check result: ${hasRequiredRole}`);

  const playerPed = PlayerPedId();
  const shouldFreeze = !hasRequiredRole;
  FreezeEntityPosition(playerPed, shouldFreeze);

  console.log(
    `[DEBUG] Player has been ${shouldFreeze ? 'frozen' : 'unfrozen'}.`
  );

  if (shouldFreeze) {
    // Display the UI if the player is frozen
    SetNuiFocus(true, false);
    SendNuiMessage(JSON.stringify({ type: 'showUI' }));
  } else {
    // Hide the UI if the player is unfrozen
    SetNuiFocus(false, false);
    SendNuiMessage(JSON.stringify({ type: 'hideUI' }));
  }

  // Mark role check as complete
  roleChecked = true;

  // Re-enable verification after a cooldown
  setTimeout(() => {
    canVerify = true;
  }, 3000);
});

// NUI callback to verify roles
RegisterNuiCallbackType('verifyRoles');
on('__cfx_nui:verifyRoles', (data, cb) => {
  console.log(`[DEBUG] Received verifyRoles NUI callback.`);
  if (canVerify) {
    console.log(`[DEBUG] Re-verifying roles for the player.`);
    canVerify = false;

    emitNet('civilian:requestRoleCheck');

    // Wait for role check result
    onNet('civilian:checkRoleResult', (hasRequiredRole) => {
      console.log(`[DEBUG] Role re-check result: ${hasRequiredRole}`);
      if (hasRequiredRole) {
        // Hide the UI if the role is verified
        SetNuiFocus(false, false);
        SendNuiMessage(JSON.stringify({ type: 'hideUI' }));
      }
      cb({ success: hasRequiredRole });
    });
  } else {
    console.log(`[DEBUG] Re-verification attempted too soon.`);
    cb({ success: false });
  }
});

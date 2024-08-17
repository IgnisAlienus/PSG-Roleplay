// client.js

let canVerify = true; // Prevent spam by disabling re-verification temporarily

// Event to receive role check result
onNet('civilian:checkRoleResult', (hasRequiredRole) => {
  console.log(`[DEBUG] Received role check result: ${hasRequiredRole}`);

  // Freeze or unfreeze the player directly
  const playerPed = PlayerPedId();
  const shouldFreeze = !hasRequiredRole;
  FreezeEntityPosition(playerPed, shouldFreeze);

  console.log(
    `[DEBUG] Player has been ${shouldFreeze ? 'frozen' : 'unfrozen'}.`
  );
  if (shouldFreeze) {
    // Display the UI if the player is frozen
    SetNuiFocus(true, true);
    SendNUIMessage({
      action: 'showUI',
    });
  } else {
    // Hide the UI if the player is unfrozen
    SetNuiFocus(false, false);
    SendNUIMessage({
      action: 'hideUI',
    });
  }

  // Re-enable verification after a cooldown
  setTimeout(() => {
    canVerify = true;
  }, 3000); // 3-second cooldown
});

// NUI callback to verify roles
RegisterNuiCallbackType('verifyRoles');
on('__cfx_nui:verifyRoles', (data, cb) => {
  console.log(`[DEBUG] Received verifyRoles NUI callback.`);
  if (canVerify) {
    console.log(`[DEBUG] Re-verifying roles for the player.`);
    canVerify = false;

    emitNet('civilian:requestRoleCheck');

    onNet('civilian:checkRoleResult', (hasRequiredRole) => {
      console.log(`[DEBUG] Role re-check result: ${hasRequiredRole}`);
      cb({ success: hasRequiredRole });
    });
  } else {
    console.log(`[DEBUG] Re-verification attempted too soon.`);
    cb({ success: false });
  }
});

// Hook into the player spawn event
on('playerSpawned', () => {
  const playerPed = PlayerPedId();
  SetEntityCoords(playerPed, 425.1, -979.5, 29.9, 0, 0, 0, false);
  SetEntityHeading(playerPed, 90.0);

  // Request role check from the server
  console.log(`[DEBUG] Emitting civilian:requestRoleCheck event`);
  emitNet('civilian:requestRoleCheck');
});

// Overriding spawnmanager's default spawn behavior
on('onClientMapStart', () => {
  exports.spawnmanager.setAutoSpawn(false);
  setTimeout(() => {
    exports.spawnmanager.spawnPlayer({
      x: 425.1,
      y: -979.5,
      z: 30.7,
      heading: 90.0,
      model: 'mp_m_freemode_01',
      skipFade: false,
    });
  }, 1000);
});

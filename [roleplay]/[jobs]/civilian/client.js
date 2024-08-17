// client.js

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
});

// Hook into the player spawn event
on('playerSpawned', () => {
  const playerPed = PlayerPedId();
  SetEntityCoords(playerPed, 425.1, -979.5, 30.0, 0, 0, 0, false);
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

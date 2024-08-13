// client/main.js

let shouldFreezePlayer = false;

// Event to receive role check result
onNet('civilian:checkRoleResult', (hasRequiredRole) => {
  console.log(`[DEBUG] Received role check result: ${hasRequiredRole}`);
  shouldFreezePlayer = !hasRequiredRole;
  console.log(`[DEBUG] shouldFreezePlayer set to: ${shouldFreezePlayer}`);

  // Emit event to freeze/unfreeze player based on role check result
  const playerId = GetPlayerServerId(PlayerId());
  console.log(
    `[DEBUG] Emitting civilian:freezePlayer event with playerId: ${playerId} and shouldFreezePlayer: ${shouldFreezePlayer}`
  );
  emitNet('civilian:freezePlayer', playerId, shouldFreezePlayer);
});

// Event to freeze or unfreeze the player
onNet('civilian:freezePlayer', (playerId, shouldFreeze) => {
  console.log(
    `[DEBUG] Received freezePlayer event for playerId: ${playerId}, shouldFreeze: ${shouldFreeze}`
  );

  const player = GetPlayerFromServerId(playerId);
  console.log(`[DEBUG] Player entity: ${player}`);
  if (player) {
    FreezeEntityPosition(player, shouldFreeze);
    console.log(
      `[DEBUG] FreezeEntityPosition called with player: ${player}, shouldFreeze: ${shouldFreeze}`
    );
    console.log(
      `[DEBUG] Player ${playerId} has been ${
        shouldFreeze ? 'frozen' : 'unfrozen'
      }.`
    );
  } else {
    console.log(`[ERROR] Player ${playerId} not found.`);
  }
});

// Hook into the player spawn event
on('playerSpawned', (spawn) => {
  const playerPed = PlayerPedId();
  SetEntityCoords(playerPed, 425.1, -979.5, 30.7, 0, 0, 0, false);
  SetEntityHeading(playerPed, 90.0);

  // Request role check from the server
  console.log(`[DEBUG] Emitting civilian:requestRoleCheck event`);
  emitNet('civilian:requestRoleCheck');
});

// Optional: Handle spawn when triggered by the server
onNet('forcePlayerSpawn', () => {
  const playerPed = PlayerPedId();
  SetEntityCoords(playerPed, 425.1, -979.5, 30.7, 0, 0, 0, false);
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

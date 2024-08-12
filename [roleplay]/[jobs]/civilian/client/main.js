// client/main.js

// Event to freeze or unfreeze the player
onNet('civilian:freezePlayer', (source, shouldFreeze) => {
  console.log(
    `[DEBUG] Received freezePlayer event for source: ${source}, shouldFreeze: ${shouldFreeze}`
  );

  const player = GetPlayerFromServerId(source);
  if (player) {
    if (shouldFreeze) {
      FreezeEntityPosition(player, true);
      console.log(`[DEBUG] Player ${source} has been frozen.`);
    } else {
      FreezeEntityPosition(player, false);
      console.log(`[DEBUG] Player ${source} has been unfrozen.`);
    }
  } else {
    console.log(`[ERROR] Player ${source} not found.`);
  }
});

// Hook into the player spawn event
on('playerSpawned', (spawn) => {
  const playerPed = PlayerPedId();
  // Set the player's position to the police station coordinates
  SetEntityCoords(playerPed, 425.1, -979.5, 30.7, 0, 0, 0, false);
  SetEntityHeading(playerPed, 90.0);
});

// Check roles and potentially freeze the player during spawn
onNet('forcePlayerSpawn', () => {
  const playerPed = PlayerPedId();

  // Check the player's roles via server
  emitNet('civilian:checkPlayerRoleOnSpawn', source);

  // Set the player's position to the police station coordinates
  SetEntityCoords(playerPed, 425.1, -979.5, 30.7, 0, 0, 0, false);
  SetEntityHeading(playerPed, 90.0);
});

// Overriding spawnmanager's default spawn behavior
on('onClientMapStart', () => {
  // Disable auto-spawn to manage it manually
  exports.spawnmanager.setAutoSpawn(false);
  // Trigger a custom spawn
  setTimeout(() => {
    // Wait for the map to load fully
    exports.spawnmanager.spawnPlayer({
      x: 425.1,
      y: -979.5,
      z: 30.7,
      heading: 90.0,
      model: 'mp_m_freemode_01', // Optional: Set default player model
      skipFade: false,
    });
  }, 1000);
});

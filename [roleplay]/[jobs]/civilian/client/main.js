// client/main.js

let shouldFreezePlayer = true;

// Event to receive role check result
onNet('civilian:checkRoleResult', (hasRequiredRole) => {
  shouldFreezePlayer = !hasRequiredRole;
});

// Event to freeze or unfreeze the player
onNet('civilian:freezePlayer', (source, shouldFreeze) => {
  console.log(
    `[DEBUG] Received freezePlayer event for source: ${source}, shouldFreeze: ${shouldFreeze}`
  );

  const player = GetPlayerFromServerId(source);
  if (player) {
    FreezeEntityPosition(player, shouldFreeze);
    console.log(
      `[DEBUG] Player ${source} has been ${
        shouldFreeze ? 'frozen' : 'unfrozen'
      }.`
    );
  } else {
    console.log(`[ERROR] Player ${source} not found.`);
  }
});

// Hook into the player spawn event
on('playerSpawned', (spawn) => {
  const playerPed = PlayerPedId();
  SetEntityCoords(playerPed, 425.1, -979.5, 30.7, 0, 0, 0, false);
  SetEntityHeading(playerPed, 90.0);

  if (shouldFreezePlayer) {
    FreezeEntityPosition(playerPed, true);
    console.log(`[DEBUG] Player has been frozen upon spawn.`);
  }
});

// Optional: Handle spawn when triggered by the server
onNet('forcePlayerSpawn', () => {
  const playerPed = PlayerPedId();
  SetEntityCoords(playerPed, 425.1, -979.5, 30.7, 0, 0, 0, false);
  SetEntityHeading(playerPed, 90.0);

  if (shouldFreezePlayer) {
    FreezeEntityPosition(playerPed, true);
    console.log(`[DEBUG] Player has been frozen upon forced spawn.`);
  }
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

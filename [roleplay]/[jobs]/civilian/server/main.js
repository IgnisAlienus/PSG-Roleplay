// server/main.js
// Hook into the playerConnecting event
on('playerConnecting', (name, setKickReason, deferrals) => {
  const source = global.source;
  deferrals.defer();

  console.log(`[DEBUG] Player connecting: ${name} (source: ${source})`);

  // Perform any necessary checks or initialization here
  exports.discord_integration.CheckPlayerRole(source, (hasRequiredRole) => {
    if (typeof hasRequiredRole !== 'boolean') {
      console.log(
        `[ERROR] Invalid type for hasRequiredRole: ${typeof hasRequiredRole}`
      );
      deferrals.done('An error occurred while checking your role.');
      return;
    }
    if (hasRequiredRole) {
      console.log(
        `[DEBUG] Player ${name} (source: ${source}) has the required role.`
      );
    } else {
      console.log(
        `[DEBUG] Player ${name} (source: ${source}) does not have the required role.`
      );
      // Freeze the player during spawn
      emitNet('civilian:freezePlayer', source, true);
    }

    deferrals.done();
    console.log(
      `[DEBUG] Deferrals done for player: ${name} (source: ${source})`
    );
  });
});

// Check role on spawn and handle freezing
onNet('civilian:checkPlayerRoleOnSpawn', (source) => {
  exports.discord_integration.CheckPlayerRole(source, (hasRequiredRole) => {
    if (!hasRequiredRole) {
      console.log(
        `[DEBUG] Player (source: ${source}) does not have the required role. Freezing player.`
      );
      emitNet('civilian:freezePlayer', source, true);
    }
  });
});

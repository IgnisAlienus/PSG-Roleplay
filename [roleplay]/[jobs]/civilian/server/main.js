// server/main.js
// Hook into the playerConnecting event
on('playerConnecting', (name, setKickReason, deferrals) => {
  const source = global.source;
  deferrals.defer();

  console.log(`[DEBUG] Player connecting: ${name} (source: ${source})`);

  // Perform any necessary checks or initialization here
  // For example, check if the player has the required role
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
        `[DEBUG] Player ${name} (source: ${source}) does not have the required role. Freezing player.`
      );
      // Trigger the client event to freeze the player
      emitNet('civilian:freezePlayer', source, true);
    }

    deferrals.done();
    console.log(
      `[DEBUG] Deferrals done for player: ${name} (source: ${source})`
    );
  });
});

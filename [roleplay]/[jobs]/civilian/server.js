on('playerConnecting', async (name, setKickReason, deferrals) => {
  deferrals.defer();

  const source = global.source; // This is the correct server-side player ID

  console.log(`[DEBUG] Player connecting: ${name}, Source ID: ${source}`);

  // Proceed with the connection
  deferrals.done();
});

onNet('civilian:requestRoleCheck', () => {
  const source = global.source; // Get the server-side player ID

  console.log(
    `[DEBUG] Received civilian:requestRoleCheck event from Source ID: ${source}`
  );

  exports.discord_integration.CheckPlayerRole(source, (hasRequiredRole) => {
    if (typeof hasRequiredRole !== 'boolean') {
      console.log(
        `[ERROR] Invalid type for hasRequiredRole: ${typeof hasRequiredRole}`
      );
      return;
    }

    console.log(
      `[DEBUG] Emitting civilian:checkRoleResult event for Source ID: ${source}`
    );
    emitNet('civilian:checkRoleResult', source, hasRequiredRole);
  });
});

onNet('civilian:freezePlayer', (playerId, shouldFreeze) => {
  console.log(
    `[DEBUG] Received freezePlayer event for playerId: ${playerId}, shouldFreeze: ${shouldFreeze}`
  );
  emitNet('civilian:freezePlayer', playerId, shouldFreeze);
});

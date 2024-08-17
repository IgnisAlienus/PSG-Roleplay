// server.js

on('playerConnecting', (name, setKickReason, deferrals) => {
  deferrals.defer();

  console.log(`[DEBUG] Player connecting: ${name}`);

  // Emit RoleCheck event to the client
  emitNet('civilian:requestRoleCheck');

  deferrals.done();
  console.log(`[DEBUG] Deferrals done for player: ${name}`);
});

// Handle role check request from the client
onNet('civilian:requestRoleCheck', () => {
  const source = global.source;

  console.log(
    `[DEBUG] Received civilian:requestRoleCheck event from source: ${source}`
  );

  exports.discord_integration.CheckPlayerRole(source, (hasRequiredRole) => {
    if (typeof hasRequiredRole !== 'boolean') {
      console.log(
        `[ERROR] Invalid type for hasRequiredRole: ${typeof hasRequiredRole}`
      );
      return;
    }

    console.log(`[DEBUG] Emitting civilian:checkRoleResult event`);
    emitNet('civilian:checkRoleResult', source, hasRequiredRole);
  });
});

onNet('civilian:freezePlayer', (playerId, shouldFreeze) => {
  console.log(
    `[DEBUG] Received freezePlayer event for playerId: ${playerId}, shouldFreeze: ${shouldFreeze}`
  );
  emitNet('civilian:freezePlayer', playerId, shouldFreeze);
});

// server/main.js

on('playerConnecting', (name, setKickReason, deferrals) => {
  const source = global.source;
  deferrals.defer();

  console.log(`[DEBUG] Player connecting: ${name} (source: ${source})`);

  exports.discord_integration.CheckPlayerRole(source, (hasRequiredRole) => {
    if (typeof hasRequiredRole !== 'boolean') {
      console.log(
        `[ERROR] Invalid type for hasRequiredRole: ${typeof hasRequiredRole}`
      );
      deferrals.done('An error occurred while checking your role.');
      return;
    }

    emitNet('civilian:checkRoleResult', source, hasRequiredRole);

    deferrals.done();
    console.log(
      `[DEBUG] Deferrals done for player: ${name} (source: ${source})`
    );
  });
});

// Handle role check request from the client
onNet('civilian:requestRoleCheck', () => {
  const source = global.source;

  exports.discord_integration.CheckPlayerRole(source, (hasRequiredRole) => {
    if (typeof hasRequiredRole !== 'boolean') {
      console.log(
        `[ERROR] Invalid type for hasRequiredRole: ${typeof hasRequiredRole}`
      );
      return;
    }

    emitNet('civilian:checkRoleResult', source, hasRequiredRole);
  });
});

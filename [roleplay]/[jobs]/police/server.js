// resources/[roleplay]/[jobs]/police/server/main.js

// Register the event for entering police job mode
onNet('police:enterJobMode', () => {
  const source = global.source;

  // Check if player has role with discord_integration
  exports.discord_integration.CheckPlayerRole(
    source,
    'police',
    (hasRequiredRole) => {
      if (typeof hasRequiredRole !== 'boolean') {
        console.log(
          `[ERROR] Invalid type for hasRequiredRole: ${typeof hasRequiredRole}`
        );
        return;
      }

      console.log(
        `[DEBUG] Emitting civilian:checkRoleResult event for Source ID: ${source}`
      );
      emitNet('chat:addMessage', source, {
        args: ['You are now on duty as a police officer'],
      });
    }
  );
});

// Register the command for spawning a police car
RegisterCommand(
  'spawnpolicecar',
  (source, args, rawCommand) => {
    // Check if the player has permission to spawn a police car
    // For simplicity, we'll allow all players to spawn the car
    emitNet('police:spawnVehicle', source, 'police');
  },
  false
);

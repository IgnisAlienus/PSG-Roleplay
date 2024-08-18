// resources/[roleplay]/[jobs]/police/server/main.js

onNet('police:requestRoleCheck', () => {
  const source = global.source;

  console.log(
    `[DEBUG] Received police:requestRoleCheck event from Source ID: ${source}`
  );

  exports.discord_integration.CheckPlayerRole(
    source,
    'police',
    (hasRequiredRole) => {
      if (typeof hasRequiredRole !== 'boolean') {
        console.log(
          `[ERROR] Invalid type for hasRequiredRole: ${typeof hasRequiredRole}`
        );
        emitNet('police:checkRoleResult', source, false);
        return;
      }

      console.log(
        `[DEBUG] Emitting police:checkRoleResult event for Source ID: ${source}`
      );
      emitNet('police:checkRoleResult', source, hasRequiredRole);
    }
  );
});

// Register the event for entering police job mode
onNet('police:enterJobMode', () => {
  const source = global.source;
  // Here you can set the player's job to police or handle any other logic
  // For simplicity, we'll just notify the player
  emitNet('chat:addMessage', source, {
    args: ['You are now on duty as a police officer'],
  });
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

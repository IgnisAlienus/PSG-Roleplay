// resources/[roleplay]/[jobs]/police/server/main.js

// Register the event for entering police job mode
onNet('police:enterJobMode', () => {
  const source = global.source;

  exports.discord_integration.CheckPlayerRole(
    source,
    'police',
    (hasRequiredRole) => {
      if (typeof hasRequiredRole !== 'boolean' || !hasRequiredRole) {
        console.log(
          `[ERROR] Invalid type or role check failed for player ${source}`
        );
        emitNet('chat:addMessage', source, {
          args: ['You do not have permission to be a police officer'],
        });
        return;
      }

      console.log(
        `[DEBUG] Player ${source} has the police role, entering duty mode.`
      );
      emitNet('chat:addMessage', source, {
        args: ['You are now on duty as a police officer'],
      });

      // Notify client to prevent being wanted by AI police
      emitNet('police:setPoliceIgnore', source, true);
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

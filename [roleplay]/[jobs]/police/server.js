// resources/[roleplay]/[jobs]/police/server/main.js

onNet('police:requestRoleCheck', () => {
  const source = global.source;

  console.log(
    `[DEBUG] Received police:requestRoleCheck event from Source ID: ${source}`
  );

  // Return a promise that resolves with the role check result
  const checkPlayerRole = () => {
    return new Promise((resolve, reject) => {
      exports.discord_integration.CheckPlayerRole(
        source,
        'police',
        (hasRequiredRole) => {
          if (typeof hasRequiredRole !== 'boolean') {
            console.log(
              `[ERROR] Invalid type for hasRequiredRole: ${typeof hasRequiredRole}`
            );
            return reject(new Error('Invalid role check result'));
          }

          console.log(
            `[DEBUG] Role check completed for Source ID: ${source}, Result: ${hasRequiredRole}`
          );
          resolve(hasRequiredRole);
        }
      );
    });
  };

  // Handle the promise and send the result back to the client
  checkPlayerRole()
    .then((hasRequiredRole) => {
      emitNet('police:checkRoleResult', source, hasRequiredRole);
    })
    .catch((error) => {
      console.log(`[ERROR] Role check failed: ${error.message}`);
      emitNet('police:checkRoleResult', source, false);
    });
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

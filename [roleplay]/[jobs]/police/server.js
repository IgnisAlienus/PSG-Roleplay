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

      // Define an array with male and female cop models
      const copModels = ['s_m_y_cop_01', 's_f_y_cop_01'];

      // Randomly select a model
      const randomModel =
        copModels[Math.floor(Math.random() * copModels.length)];

      // Change the player model to the randomly selected cop model
      emitNet('police:changePlayerModel', source, randomModel);

      // Give police weapon loadout
      emitNet('police:giveWeaponLoadout', source);
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

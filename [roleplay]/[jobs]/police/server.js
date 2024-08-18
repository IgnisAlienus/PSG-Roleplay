// resources/[roleplay]/[jobs]/police/server/main.js
const wantedPlayers = {};

// Handle the event when a non-cop player becomes wanted
onNet('police:playerWanted', (playerId) => {
  if (!wantedPlayers[playerId]) {
    // Store the player as wanted
    wantedPlayers[playerId] = true;

    // Get the player's coordinates and notify all cops
    const playerCoords = GetEntityCoords(GetPlayerPed(playerId));
    emitNet('police:addWantedBlip', -1, playerId, playerCoords);
  }
});

// Handle the event when a non-cop player is no longer wanted
onNet('police:playerNotWanted', (playerId) => {
  if (wantedPlayers[playerId]) {
    // Remove the player from the wanted list
    delete wantedPlayers[playerId];

    // Notify all cops to remove the blip
    emitNet('police:removeWantedBlip', -1, playerId);
  }
});

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
          args: ['You do not have permission to be a Police Officer'],
        });
        return;
      }

      console.log(
        `[DEBUG] Player ${source} has the Police Role, entering duty mode.`
      );
      emitNet('chat:addMessage', source, {
        args: ['You are now on duty as a Police Officer'],
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

      // Set Cop Status
      emitNet('police:setCopStatus', source, true);

      // Add a delay before giving weapons
      setTimeout(() => {
        emitNet('police:giveWeaponLoadout');
      }, 5000);
    }
  );
});

RegisterCommand(
  'givepoliceweapons',
  () => {
    emitNet('police:giveWeaponLoadout');
  },
  false
);

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

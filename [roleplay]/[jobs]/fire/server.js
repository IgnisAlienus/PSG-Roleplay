// Register the event for entering fire job mode
onNet('fire:enterJobMode', () => {
  const source = global.source;

  exports.discord_integration.CheckPlayerRole(
    source,
    'fire',
    (hasRequiredRole) => {
      if (typeof hasRequiredRole !== 'boolean' || !hasRequiredRole) {
        console.log(
          `[ERROR] Invalid type or role check failed for player ${source}`
        );
        emitNet('chat:addMessage', source, {
          args: ['You do not have permission to be a Firefighter'],
        });
        return;
      }

      console.log(
        `[DEBUG] Player ${source} has the Firefigher Role, entering duty mode.`
      );
      emitNet('chat:addMessage', source, {
        args: ['You are now on duty as a Firefighter'],
      });

      // Notify client to prevent being wanted by AI police
      emitNet('fire:setPoliceIgnore', source, true);

      // Define an array with male and female fire models
      const fireModels = ['s_m_y_fireman_01', 's_f_y_fire_01'];

      // Randomly select a model
      const randomModel =
        fireModels[Math.floor(Math.random() * fireModels.length)];

      // Change the player model to the randomly selected fire model
      emitNet('fire:changePlayerModel', source, randomModel);

      // Give fire weapon loadout
      emitNet('fire:giveWeaponLoadout', source);

      // Set Firefighter Status
      emitNet('fire:setFireStatus', source, true);
    }
  );
});

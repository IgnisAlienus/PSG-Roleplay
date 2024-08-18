// Register the event for entering ems job mode
onNet('ems:enterJobMode', () => {
  const source = global.source;

  exports.discord_integration.CheckPlayerRole(
    source,
    'ems',
    (hasRequiredRole) => {
      if (typeof hasRequiredRole !== 'boolean' || !hasRequiredRole) {
        console.log(
          `[ERROR] Invalid type or role check failed for player ${source}`
        );
        emitNet('chat:addMessage', source, {
          args: ['You do not have permission to be a Paramedic'],
        });
        return;
      }

      console.log(
        `[DEBUG] Player ${source} has the Paramedic Role, entering duty mode.`
      );
      emitNet('chat:addMessage', source, {
        args: ['You are now on duty as a Paramedic'],
      });

      // Notify client to prevent being wanted by AI police
      emitNet('ems:setPoliceIgnore', source, true);

      // Define an array with male and female ems models
      const emsModels = ['s_m_m_paramedic_01'];

      // Randomly select a model
      const randomModel =
        emsModels[Math.floor(Math.random() * emsModels.length)];

      // Change the player model to the randomly selected ems model
      emitNet('ems:changePlayerModel', source, randomModel);

      // Set EMS Status
      emitNet('ems:setEMSStatus', source, true);

      // Add a delay before giving weapons
      setTimeout(() => {
        emitNet('ems:giveWeaponLoadout', source);
      }, 5000);
    }
  );
});

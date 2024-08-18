// resources/[roleplay]/[jobs]/police/server/main.js

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

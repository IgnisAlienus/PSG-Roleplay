// server.js

// Event handler for player connecting
on('playerConnecting', (name, setKickReason, deferrals) => {
  const source = global.source;

  // Check if the player has the 'dev' role
  exports.discord_integration.CheckPlayerRole(
    source,
    'dev',
    (hasRequiredRole) => {
      if (typeof hasRequiredRole !== 'boolean' || !hasRequiredRole) {
        console.log(
          `[ERROR] Invalid type or role check failed for player ${source}`
        );
        return;
      }

      console.log(`[DEBUG] Player ${source} has the Dev Role.`);
      emitNet('chat:addMessage', source, {
        args: ['You have the Dev Role.'],
      });

      // Broadcast a message to all players saying the dev joined with the dev's username
      emitNet('chat:addMessage', -1, {
        args: [`PSG Developer ${GetPlayerName(source)} has joined the server.`],
      });

      emitNet('dev:devCommands', source);
    }
  );
});

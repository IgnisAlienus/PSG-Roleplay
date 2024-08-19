// server.js

// Event handler for player connecting
on('playerConnecting', (name, setKickReason, deferrals) => {
  const source = global.source;

  // Check if the player has the 'admin' role
  exports.discord_integration.CheckPlayerRole(
    source,
    'admin',
    (hasRequiredRole) => {
      if (typeof hasRequiredRole !== 'boolean' || !hasRequiredRole) {
        console.log(
          `[ERROR] Invalid type or role check failed for player ${source}`
        );
        return;
      }

      console.log(`[DEBUG] Player ${source} has the Admin Role.`);
      emitNet('chat:addMessage', source, {
        args: ['You have the Admin Role.'],
      });

      // Broadcast a message to all players saying the admin joined with the admin's username
      emitNet('chat:addMessage', -1, {
        args: [`PSG Admin ${GetPlayerName(source)} has joined the server.`],
      });

      emitNet('admin:adminCommands', source);
    }
  );
});

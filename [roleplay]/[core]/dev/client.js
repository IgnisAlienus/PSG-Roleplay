// resources/dev/client.js
// Handle giving the police weapon loadout
onNet('dev:devCommands', () => {
  RegisterCommand(
    'getcoords',
    () => {
      const playerPed = PlayerPedId();
      const coords = GetEntityCoords(playerPed);
      const msg = `Current coordinates: x = ${coords[0].toFixed(
        2
      )}, y = ${coords[1].toFixed(2)}, z = ${coords[2].toFixed(2)}`;
      console.log(msg);
      emit('chat:addMessage', {
        color: [255, 0, 0],
        multiline: true,
        args: ['Me', msg],
      });
    },
    false
  );
});

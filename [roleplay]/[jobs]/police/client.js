// resources/[roleplay]/[jobs]/police/client/main.js

// Create the blip for the police station
const blip = AddBlipForCoord(441.84, -982.14, 30.69); // Coordinates for the downtown police station in Los Santos
SetBlipSprite(blip, 60); // Blip icon (60 is for a police station)
SetBlipDisplay(blip, 4);
SetBlipScale(blip, 1.0);
SetBlipColour(blip, 29);
SetBlipAsShortRange(blip, true);
BeginTextCommandSetBlipName('STRING');
AddTextComponentString('Police Station');
EndTextCommandSetBlipName(blip);

// Coordinates for the circle hologram
const hologramCoords = [441.84, -982.14, 30.69];

// Check if player is near the blip to enter police job mode
setTick(async () => {
  console.log('setTick is running'); // Debug log

  const playerPed = PlayerPedId();
  const coords = GetEntityCoords(playerPed);
  const distance = Vdist(
    coords[0],
    coords[1],
    coords[2],
    hologramCoords[0],
    hologramCoords[1],
    hologramCoords[2]
  );

  // Draw the circle hologram
  DrawMarker(
    1, // Marker type (1 is for a vertical cylinder)
    hologramCoords[0],
    hologramCoords[1],
    hologramCoords[2] - 1.0, // Adjust the Z coordinate to place it on the ground
    0,
    0,
    0, // Direction vector
    0,
    0,
    0, // Rotation
    1.5,
    1.5,
    0.5, // Scale (X, Y, Z)
    0,
    0,
    255,
    100, // Color (R, G, B, Alpha)
    false, // Bob up and down
    false, // Face camera
    2, // P19 (unknown, usually set to 2)
    false, // Rotate
    null, // Texture dictionary
    null, // Texture name
    false // Draw on entities
  );

  if (distance < 1.0) {
    console.log('Player is near the blip'); // Debug log

    // Request Role Check and await the response
    const hasPoliceRole = await new Promise((resolve) => {
      console.log('Requesting police role check'); // Debug log
      emitNet('police:requestRoleCheck', (result) => {
        console.log('Received police role check result:', result); // Debug log
        resolve(result);
      });
    });

    if (hasPoliceRole) {
      // Display help notification
      BeginTextCommandDisplayHelp('STRING');
      AddTextComponentSubstringPlayerName(
        'Press ~INPUT_CONTEXT~ to enter police job mode'
      );
      EndTextCommandDisplayHelp(0, false, true, -1);

      if (IsControlJustReleased(0, 38)) {
        // E key
        emitNet('police:enterJobMode');
      }
    } else {
      console.log('Player does not have the police role'); // Debug log
      // Notify player they don't have the police role
      emitNet('chat:addMessage', -1, {
        args: [
          'You do not have the police role and cannot interact with this blip.',
        ],
      });
    }
  }
});

// Handle vehicle spawning
onNet('police:spawnVehicle', (vehicleName) => {
  const playerPed = PlayerPedId();
  const coords = GetEntityCoords(playerPed);

  // Load the vehicle model
  RequestModel(vehicleName);
  const interval = setInterval(() => {
    if (HasModelLoaded(vehicleName)) {
      clearInterval(interval);

      // Create the vehicle
      const vehicle = CreateVehicle(
        vehicleName,
        coords[0],
        coords[1],
        coords[2],
        GetEntityHeading(playerPed),
        true,
        false
      );
      SetPedIntoVehicle(playerPed, vehicle, -1);
    }
  }, 500);
});

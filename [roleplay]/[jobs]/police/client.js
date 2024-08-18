// resources/[roleplay]/[jobs]/police/client/main.js
let isCop = false;
let playerBlips = {};

// Set this flag if the player is a cop
onNet('police:setCopStatus', (status) => {
  isCop = status;
});

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

// Unified setTick function
setTick(() => {
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
  }

  if (!isCop) {
    const playerId = PlayerId();
    const wantedLevel = GetPlayerWantedLevel(playerId);

    if (wantedLevel > 0 && !playerBlips[GetPlayerServerId(playerId)]) {
      // Emit an event to the server to notify that this non-cop player is wanted
      console.log(`Player ${playerId} is wanted with level ${wantedLevel}`);
      emitNet('police:playerWanted', GetPlayerServerId(playerId));
    } else if (wantedLevel === 0 && playerBlips[GetPlayerServerId(playerId)]) {
      // Emit an event to the server to notify that this non-cop player is no longer wanted
      console.log(`Player ${playerId} is no longer wanted`);
      emitNet('police:playerNotWanted', GetPlayerServerId(playerId));
    }
  }
});

// Add a blip on the map for wanted players
onNet('police:addWantedBlip', (wantedPlayerId, coords) => {
  console.log(`Adding blip for wanted player ${wantedPlayerId}`);
  if (isCop && !playerBlips[wantedPlayerId]) {
    // Create a blip at the wanted player's location
    const blip = AddBlipForCoord(coords[0], coords[1], coords[2]);
    SetBlipSprite(blip, 1); // Standard blip icon
    SetBlipColour(blip, 1); // Red color for wanted player
    SetBlipScale(blip, 1.0);
    SetBlipAsShortRange(blip, false); // Blip is visible from any distance
    BeginTextCommandSetBlipName('STRING');
    AddTextComponentString('Wanted Player');
    EndTextCommandSetBlipName(blip);

    // Store the blip for later removal
    playerBlips[wantedPlayerId] = blip;
  }
});

// Remove the blip when the player is no longer wanted
onNet('police:removeWantedBlip', (wantedPlayerId) => {
  console.log(`Removing blip for wanted player ${wantedPlayerId}`);
  if (isCop && playerBlips[wantedPlayerId]) {
    // Remove the blip from the map
    RemoveBlip(playerBlips[wantedPlayerId]);
    delete playerBlips[wantedPlayerId];
  }
});

// Handle setting police ignore state
onNet('police:setPoliceIgnore', (ignore) => {
  const playerPed = PlayerPedId();

  // Set wanted level to 0
  SetPlayerWantedLevel(PlayerId(), 0, false);
  SetPlayerWantedLevelNow(PlayerId(), false);
  SetMaxWantedLevel(0);

  // Ignore or stop ignoring the player by AI police
  SetPoliceIgnorePlayer(playerPed, true);
});

// Handle changing the player model
onNet('police:changePlayerModel', (modelName) => {
  // Load the model
  RequestModel(modelName);
  const interval = setInterval(() => {
    if (HasModelLoaded(modelName)) {
      clearInterval(interval);

      // Set the player model
      SetPlayerModel(PlayerId(), modelName);
      SetModelAsNoLongerNeeded(modelName);
    }
  }, 500);
});

// Handle giving the police weapon loadout
onNet('police:giveWeaponLoadout', () => {
  // Remove all weapons
  RemoveAllPedWeapons(PlayerPedId(), true);

  // Give the police weapon loadout
  GiveWeaponToPed(
    PlayerPedId(),
    GetHashKey('WEAPON_NIGHTSTICK'),
    1,
    false,
    true
  );
  GiveWeaponToPed(PlayerPedId(), GetHashKey('WEAPON_PISTOL'), 100, false, true);
  GiveWeaponToPed(PlayerPedId(), GetHashKey('WEAPON_STUNGUN'), 1, false, true);
  GiveWeaponToPed(
    PlayerPedId(),
    GetHashKey('WEAPON_PUMPSHOTGUN'),
    100,
    false,
    true
  );
  GiveWeaponToPed(
    PlayerPedId(),
    GetHashKey('WEAPON_CARBINERIFLE'),
    100,
    false,
    true
  );
  GiveWeaponToPed(
    PlayerPedId(),
    GetHashKey('WEAPON_FLASHLIGHT'),
    1,
    false,
    true
  );
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

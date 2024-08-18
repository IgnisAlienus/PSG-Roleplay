// resources/[roleplay]/[jobs]/police/client/main.js
let isCop = false;
let playerBlips = {};
let currentlyWantedPlayers = new Set(); // Set to track currently wanted players

// Set this flag if the player is a cop
onNet('police:setCopStatus', (status) => {
  isCop = status;
});

// Unified setTick function
setTick(() => {
  if (!isCop) {
    const playerId = PlayerId();
    const serverId = GetPlayerServerId(playerId);
    const wantedLevel = GetPlayerWantedLevel(playerId);

    if (wantedLevel > 0 && !currentlyWantedPlayers.has(serverId)) {
      // Player becomes wanted
      console.log(`Player ${playerId} is wanted with level ${wantedLevel}`);
      emitNet('police:playerWanted', serverId);
      currentlyWantedPlayers.add(serverId); // Add to the set
    } else if (wantedLevel === 0 && currentlyWantedPlayers.has(serverId)) {
      // Player is no longer wanted
      console.log(`Player ${playerId} is no longer wanted`);
      emitNet('police:playerNotWanted', serverId);
      currentlyWantedPlayers.delete(serverId); // Remove from the set
    }
  }
});

// Add a blip on the map for wanted players
onNet('police:addWantedBlip', (wantedPlayerId, coords) => {
  console.log(`Adding blip for wanted player ${wantedPlayerId}`);
  if (isCop && !playerBlips[wantedPlayerId]) {
    // Create a blip at the wanted player's location
    const blip = AddBlipForCoord(coords[0], coords[1], coords[2]);
    SetBlipSprite(blip, 58); // Standard blip icon
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
  console.log('Giving police weapon loadout');
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
  GiveWeaponToPed(
    PlayerPedId(),
    GetHashKey('WEAPON_COMBATPISTOL'),
    100,
    false,
    true
  );
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
  console.log('Police weapon loadout given');
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

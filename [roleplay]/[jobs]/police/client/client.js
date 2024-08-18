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
  console.log(`Requesting model ${modelName}`);
  RequestModel(modelName);
  const interval = setInterval(() => {
    if (HasModelLoaded(modelName)) {
      clearInterval(interval);

      // Set the player model
      SetPlayerModel(PlayerId(), modelName);
      SetModelAsNoLongerNeeded(modelName);
      console.log(`Model ${modelName} set`);
    }
  }, 500);
});

// Handle giving the police weapon loadout
onNet('police:giveWeaponLoadout', () => {
  console.log('Giving police weapon loadout');

  const playerPed = PlayerPedId();

  // Remove all weapons
  RemoveAllPedWeapons(playerPed, true);
  console.log('All weapons removed');

  // Weapons to be given
  const weapons = [
    { name: 'WEAPON_NIGHTSTICK', ammo: 1 },
    { name: 'WEAPON_COMBATPISTOL', ammo: 100 },
    { name: 'WEAPON_STUNGUN', ammo: 1 },
    { name: 'WEAPON_PUMPSHOTGUN', ammo: 100 },
    { name: 'WEAPON_CARBINERIFLE', ammo: 100 },
    { name: 'WEAPON_FLASHLIGHT', ammo: 1 },
    { name: 'WEAPON_FIREEXTINGUISHER', ammo: 100 },
    { name: 'WEAPON_FLARE', ammo: 5 },
  ];

  // Give the police weapon loadout
  weapons.forEach((weapon) => {
    const weaponHash = GetHashKey(weapon.name);
    if (weaponHash !== null) {
      GiveWeaponToPed(playerPed, weaponHash, weapon.ammo, false, false);
      console.log(`Given ${weapon.name} with ${weapon.ammo} ammo`);
    } else {
      console.log(`Invalid weapon hash for ${weapon.name}`);
    }
  });

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

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

      // Add a delay before giving weapons
      setTimeout(() => {
        emitNet('police:giveWeaponLoadout');
      }, 2000);
    }
  }, 500);
});

RegisterCommand(
  'givepoliceweapons',
  () => {
    emitNet('police:giveWeaponLoadout');
  },
  false
);

// Handle giving the police weapon loadout
onNet('police:giveWeaponLoadout', async () => {
  console.log('Giving police weapon loadout');

  const playerPed = PlayerPedId();

  // Remove all weapons
  RemoveAllPedWeapons(playerPed, true);
  console.log('All weapons removed');

  // Wait for a moment before giving weapons
  await new Promise((resolve) => setTimeout(resolve, 500));

  // Weapons to be given
  const weapons = [
    { name: 'WEAPON_NIGHTSTICK', hash: 0x678b81b1, ammo: 1 },
    { name: 'WEAPON_COMBATPISTOL', hash: 0x5ef9fec4, ammo: 100 },
    { name: 'WEAPON_STUNGUN', hash: 0x3656c8c1, ammo: 1 },
    { name: 'WEAPON_PUMPSHOTGUN', hash: 0x1d073a89, ammo: 100 },
    { name: 'WEAPON_CARBINERIFLE', hash: 0x83bf0278, ammo: 100 },
    { name: 'WEAPON_FLASHLIGHT', hash: 0x8bb05fd7, ammo: 1 },
    { name: 'WEAPON_FIREEXTINGUISHER', hash: 0x60ec506, ammo: 100 },
    { name: 'WEAPON_FLARE', hash: 0x497facc3, ammo: 5 },
  ];

  // Give the police weapon loadout
  weapons.forEach((weapon) => {
    const weaponHash = GetHashKey(weapon.name);
    GiveWeaponToPed(playerPed, weaponHash, weapon.ammo, false, false);
    console.log(`Given ${weapon.name} with ${weapon.ammo} ammo`);
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

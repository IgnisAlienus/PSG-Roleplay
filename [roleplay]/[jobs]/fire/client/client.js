let isFirefighter = false;

// Set this flag if the player is a firefighter
onNet('fire:setFireStatus', (status) => {
  isFirefighter = status;
});

// Handle changing the player model
onNet('fire:changePlayerModel', (modelName) => {
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

// Handle giving the fire weapon loadout
onNet('fire:giveWeaponLoadout', () => {
  console.log('Giving fire weapon loadout');

  const playerPed = PlayerPedId();

  // Remove all weapons
  RemoveAllPedWeapons(playerPed, true);
  console.log('All weapons removed');

  // Weapons to be given
  const weapons = [
    { name: 'WEAPON_FLASHLIGHT', ammo: 1 },
    { name: 'WEAPON_FIREEXTINGUISHER', ammo: 100 },
    { name: 'WEAPON_HOSE', ammo: 100 },
  ];

  // Give the fire weapon loadout
  weapons.forEach((weapon) => {
    const weaponHash = GetHashKey(weapon.name);
    GiveWeaponToPed(playerPed, weaponHash, weapon.ammo, false, true);
    console.log(`Given ${weapon.name} with ${weapon.ammo} ammo`);
  });

  console.log('Fire weapon loadout given');
});

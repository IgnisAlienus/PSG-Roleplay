let isFirefighter = false;

// Set this flag if the player is a firefighter
onNet('fire:setFireStatus', (status) => {
  isFirefighter = status;
});

// Handle changing the player model
onNet('fire:changePlayerModel', (modelName) => {
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

// Handle giving the fire weapon loadout
onNet('fire:giveWeaponLoadout', async () => {
  console.log('Giving fire weapon loadout');

  const playerPed = PlayerPedId();

  // Remove all weapons
  RemoveAllPedWeapons(playerPed, true);
  console.log('All weapons removed');

  // Wait for a moment before giving weapons
  await new Promise((resolve) => setTimeout(resolve, 500));

  // Weapons to be given
  const weapons = [
    { name: 'WEAPON_FLASHLIGHT', ammo: 1 },
    { name: 'WEAPON_FLARE', ammo: 5 },
    { name: 'WEAPON_FIREEXTINGUISHER', ammo: 100 },
  ];

  // Give the fire weapon loadout
  weapons.forEach((weapon) => {
    const weaponHash = GetHashKey(weapon.name);
    GiveWeaponToPed(playerPed, weaponHash, weapon.ammo, false, true);
    console.log(`Given ${weapon.name} with ${weapon.ammo} ammo`);
  });

  console.log('Fire weapon loadout given');
});

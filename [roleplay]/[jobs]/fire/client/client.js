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
    { name: 'WEAPON_FLASHLIGHT', hash: 0x8bb05fd7, ammo: 1 },
    { name: 'WEAPON_FIREEXTINGUISHER', hash: 0x60ec506, ammo: 100 },
    { name: 'WEAPON_FLARE', hash: 0x497facc3, ammo: 5 },
  ];

  // Give the fire weapon loadout
  weapons.forEach((weapon) => {
    const weaponHash = GetHashKey(weapon.name);
    GiveWeaponToPed(playerPed, weapon.hash, weapon.ammo, false, true);
    console.log(`Given ${weapon.name} with ${weapon.ammo} ammo`);
  });

  console.log('Fire weapon loadout given');
});

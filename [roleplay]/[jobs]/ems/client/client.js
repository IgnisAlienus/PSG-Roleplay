let isEMSfighter = false;

// Set this flag if the player is ems
onNet('ems:setEMSStatus', (status) => {
  isEMSfighter = status;
});

// Handle changing the player model
onNet('ems:changePlayerModel', (modelName) => {
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

// Handle giving the ems weapon loadout
onNet('ems:giveWeaponLoadout', async () => {
  console.log('Giving ems weapon loadout');

  const playerPed = PlayerPedId();

  // Remove all weapons
  RemoveAllPedWeapons(playerPed, true);
  console.log('All weapons removed');

  // Wait for a moment before giving weapons
  await new Promise((resolve) => setTimeout(resolve, 500));

  // Weapons to be given
  const weapons = [{ name: 'WEAPON_FLASHLIGHT', ammo: 1 }];

  // Give the ems weapon loadout
  weapons.forEach((weapon) => {
    const weaponHash = GetHashKey(weapon.name);
    GiveWeaponToPed(playerPed, weaponHash, weapon.ammo, false, true);
    console.log(`Given ${weapon.name} with ${weapon.ammo} ammo`);
  });

  console.log('EMS weapon loadout given');
});

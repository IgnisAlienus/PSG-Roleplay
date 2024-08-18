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
  // Remove all weapons
  RemoveAllPedWeapons(PlayerPedId(), true);

  // Give the fire weapon loadout
  GiveWeaponToPed(
    PlayerPedId(),
    GetHashKey('WEAPON_FIREEXTINGUISHER'),
    1,
    false,
    true
  );
  GiveWeaponToPed(PlayerPedId(), GetHashKey('WEAPON_HOSE'), 1, false, true);
  GiveWeaponToPed(
    PlayerPedId(),
    GetHashKey('WEAPON_FLASHLIGHT'),
    1,
    false,
    true
  );
  GiveWeaponToPed(PlayerPedId(), GetHashKey('WEAPON_FLARE'), 1, false, true);
});

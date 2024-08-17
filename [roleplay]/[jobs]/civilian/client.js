onNet('civilian:checkRoleResult', (hasRequiredRole) => {
  console.log(`[DEBUG] Received role check result: ${hasRequiredRole}`);

  // Freeze or unfreeze the player directly
  const playerPed = PlayerPedId();
  const shouldFreeze = !hasRequiredRole;
  FreezeEntityPosition(playerPed, shouldFreeze);

  console.log(
    `[DEBUG] Player has been ${shouldFreeze ? 'frozen' : 'unfrozen'}.`
  );
});

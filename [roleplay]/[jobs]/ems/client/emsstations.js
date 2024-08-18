// Function to create a ems blip
function createEMSBlip(x, y, z, name) {
  const blip = AddBlipForCoord(x, y, z);
  SetBlipSprite(blip, 61);
  SetBlipDisplay(blip, 4);
  SetBlipScale(blip, 1.0);
  SetBlipColour(blip, 0);
  SetBlipAsShortRange(blip, true);
  BeginTextCommandSetBlipName('STRING');
  AddTextComponentString(name);
  EndTextCommandSetBlipName(blip);
}

// Array of ems stations with coordinates and names
const emsStations = [
  // Ambulance stations
  { x: 305.0, y: -1396.0, z: 32.0, name: 'Central Los Santos Hospital' },
];

// Create blips for ems stations
emsStations.forEach((station) => {
  createEMSBlip(station.x, station.y, station.z, station.name);
});

// Function to draw a hologram at the specified coordinates
function drawHologram(x, y, z) {
  const playerPed = PlayerPedId();
  const coords = GetEntityCoords(playerPed);
  const distance = Vdist(coords[0], coords[1], coords[2], x, y, z);

  // Draw the circle hologram
  DrawMarker(
    1, // Marker type (1 is for a vertical cylinder)
    x,
    y,
    z - 1.0, // Adjust the Z coordinate to place it on the ground
    0,
    0,
    0, // Direction vector
    0,
    0,
    0, // Rotation
    1.5,
    1.5,
    0.5, // Scale (X, Y, Z)
    255,
    255,
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
      'Press ~INPUT_CONTEXT~ to go on duty as a Paramedic'
    );
    EndTextCommandDisplayHelp(0, false, true, -1);

    if (IsControlJustReleased(0, 38)) {
      // E key
      emitNet('ems:enterJobMode');
    }
  }
}

// Unified setTick function to draw holograms for all ems stations
setTick(() => {
  emsStations.forEach((station) => {
    drawHologram(station.x, station.y, station.z);
  });
});

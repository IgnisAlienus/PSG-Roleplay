// Function to create a police blip
function createPoliceBlip(x, y, z, name) {
  const blip = AddBlipForCoord(x, y, z);
  SetBlipSprite(blip, 60);
  SetBlipDisplay(blip, 4);
  SetBlipScale(blip, 1.0);
  SetBlipColour(blip, 29);
  SetBlipAsShortRange(blip, true);
  BeginTextCommandSetBlipName('STRING');
  AddTextComponentString(name);
  EndTextCommandSetBlipName(blip);
}

// Array of police stations with coordinates and names
const policeStations = [
  { x: 441.84, y: -982.14, z: 30.69, name: 'Los Santos Police Station' },
  { x: 1844.3, y: 3685.7, z: 34.2, name: 'Rockford Hills Police Station' },
  { x: -1631.9, y: -1014.4, z: 13.1, name: 'Del Perro Police Station' },
  { x: 1853.9, y: 3689.6, z: 34.2, name: 'Sandy Shores Police Station' },
  { x: -447.1, y: 6010.4, z: 31.7, name: 'Paleto Bay Police Station' },
  { x: -1097.6, y: -850.9, z: 4.9, name: 'Vespucci Police Station' },
  { x: -1133.7, y: -1437.3, z: 4.9, name: 'Vespucci Beach Police Station' },
  { x: 825.3, y: -1290.8, z: 28.2, name: 'Mission Row Police Station' },
  { x: -448.7, y: 6010.4, z: 31.7, name: 'Beaver Bush Ranger Station' },
  { x: 374.2, y: -1607.5, z: 29.3, name: 'Davis Sheriff Station' },
  { x: 642.6, y: 1.6, z: 82.8, name: 'Vinewood Police Station' },
  { x: 818.3, y: -1290.2, z: 26.3, name: 'La Mesa Police Station' },
];

// Create blips for police stations
policeStations.forEach((station) => {
  createPoliceBlip(station.x, station.y, station.z, station.name);
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
    0,
    0,
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
      'Press ~INPUT_CONTEXT~ to go on duty as a Police Officer'
    );
    EndTextCommandDisplayHelp(0, false, true, -1);

    if (IsControlJustReleased(0, 38)) {
      // E key
      emitNet('police:enterJobMode');
    }
  }
}

// Unified setTick function to draw holograms for all police stations
setTick(() => {
  policeStations.forEach((station) => {
    drawHologram(station.x, station.y, station.z);
  });
});

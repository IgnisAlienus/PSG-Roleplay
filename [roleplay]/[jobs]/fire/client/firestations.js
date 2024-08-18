// Function to create a police blip
function createFireBlip(x, y, z, name) {
  const blip = AddBlipForCoord(x, y, z);
  SetBlipSprite(blip, 436);
  SetBlipDisplay(blip, 4);
  SetBlipScale(blip, 1.0);
  SetBlipColour(blip, 29);
  SetBlipAsShortRange(blip, true);
  BeginTextCommandSetBlipName('STRING');
  AddTextComponentString(name);
  EndTextCommandSetBlipName(blip);
}

// Array of police stations with coordinates and names
const fireStations = [
  { x: -368.2, y: 6118.8, z: 31.5, name: 'Paleto Bay Fire Station' },
  { x: 203.9, y: 183.6, z: 104.7, name: 'Sandy Shores Fire Station' },
  { x: -1144.7, y: -1991.1, z: 13.2, name: 'LSIA Fire Station' },
  { x: 215.3, y: -1659.9, z: 29.3, name: 'Davis Fire Station' },
  { x: 1200.7, y: -1461.1, z: 34.7, name: 'El Burro Heights Fire Station' },
  { x: -2347.3, y: 3249.8, z: 32.8, name: 'Fort Zancudo Fire Station' },
  { x: -633.5, y: -123.9, z: 39.0, name: 'Rockford Hills Fire Station' },
];

// Create blips for police stations
fireStations.forEach((station) => {
  createFireBlip(station.x, station.y, station.z, station.name);
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
    165,
    0,
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
      'Press ~INPUT_CONTEXT~ to go on duty as a Firefighter'
    );
    EndTextCommandDisplayHelp(0, false, true, -1);

    if (IsControlJustReleased(0, 38)) {
      // E key
      emitNet('fire:enterJobMode');
    }
  }
}

// Unified setTick function to draw holograms for all police stations
setTick(() => {
  fireStations.forEach((station) => {
    drawHologram(station.x, station.y, station.z);
  });
});

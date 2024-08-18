// Function to create a hospital blip
function createHospitalBlip(x, y, z, name) {
  const blip = AddBlipForCoord(x, y, z);
  SetBlipSprite(blip, 80);
  SetBlipDisplay(blip, 4);
  SetBlipScale(blip, 1.0);
  SetBlipColour(blip, 1);
  SetBlipAsShortRange(blip, true);
  BeginTextCommandSetBlipName('STRING');
  AddTextComponentString(name);
  EndTextCommandSetBlipName(blip);
}

// Array of hospital stations with coordinates and names
const hopitals = [
  { x: 300.0, y: -1396.0, z: 32.0, name: 'Central Los Santos Hospital' },
  { x: -874.0, y: -307.0, z: 39.0, name: 'Pillbox Hill Medical Center' },
  { x: 1839.0, y: 3672.0, z: 34.0, name: 'Sandy Shores Medical Center' },
  { x: -246.0, y: 6330.0, z: 32.0, name: 'Paleto Bay Medical Center' },
];

// Create blips for hospital stations
hopitals.forEach((station) => {
  createHospitalBlip(station.x, station.y, station.z, station.name);
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
    0,
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
      'Press ~INPUT_CONTEXT~ to heal yourself.'
    );
    EndTextCommandDisplayHelp(0, false, true, -1);

    if (IsControlJustReleased(0, 38)) {
      // E key
      // Heal the player
    }
  }
}

// Unified setTick function to draw holograms for all hopitals stations
setTick(() => {
  hopitals.forEach((station) => {
    drawHologram(station.x, station.y, station.z);
  });
});

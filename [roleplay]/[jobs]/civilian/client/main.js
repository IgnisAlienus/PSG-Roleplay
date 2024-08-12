// client/main.js

// Event to freeze or unfreeze the player
onNet('civilian:freezePlayer', (freeze) => {
    const playerPed = PlayerPedId();
    FreezeEntityPosition(playerPed, freeze);
    
    if (freeze) {
        // Optionally, display a message to the player
        emit('chat:addMessage', {
            args: ['You do not have the required permissions to move.']
        });
    }
});

// Hook into the player spawn event
on('playerSpawned', (spawn) => {
    const playerPed = PlayerPedId();
    // Set the player's position to the police station coordinates
    SetEntityCoords(playerPed, 425.1, -979.5, 30.7, 0, 0, 0, false);
    SetEntityHeading(playerPed, 90.0);
});

// Optional: Handle spawn when triggered by the server
onNet('forcePlayerSpawn', () => {
    const playerPed = PlayerPedId();
    // Set the player's position to the police station coordinates
    SetEntityCoords(playerPed, 425.1, -979.5, 30.7, 0, 0, 0, false);
    SetEntityHeading(playerPed, 90.0);
});

// Overriding spawnmanager's default spawn behavior
on('onClientMapStart', () => {
    // Disable auto-spawn to manage it manually
    exports.spawnmanager.setAutoSpawn(false);
    // Trigger a custom spawn
    setTimeout(() => { // Wait for the map to load fully
        exports.spawnmanager.spawnPlayer({
            x: 425.1,
            y: -979.5,
            z: 30.7,
            heading: 90.0,
            model: 'mp_m_freemode_01', // Optional: Set default player model
            skipFade: false
        });
    }, 1000);
});
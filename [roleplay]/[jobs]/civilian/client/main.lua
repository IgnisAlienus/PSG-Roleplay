print("Client script is running")

RegisterNetEvent('civilian:setInitialSpawn')
AddEventHandler('civilian:setInitialSpawn', function(coords)
    print("Received event 'civilian:setInitialSpawn' with coordinates: ", coords.x, coords.y, coords.z)
    -- Spawns the player by passing a table as a spawnpoint
exports.spawnmanager:spawnPlayer({
    x = coords.x,
    y = coords.y,
    z = coords.z,
    heading = 0,
    skipFade = false
})
    print("Player spawned at coordinates: ", finalCoords.x, finalCoords.y, finalCoords.z)
end)

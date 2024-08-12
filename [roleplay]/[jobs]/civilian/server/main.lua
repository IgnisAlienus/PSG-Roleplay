AddEventHandler('playerConnecting', function(name, setKickReason, deferrals)
    local source = source
    local spawnCoords = vector3(441.84, -982.14, 30.69) -- Coordinates for the downtown police station in Los Santos
    print("Player connecting: ", name, " with source: ", source)
    print("Sending initial spawn coordinates: ", spawnCoords.x, spawnCoords.y, spawnCoords.z)
    
    -- Additional logging for the sent coordinates
    TriggerClientEvent('civilian:setInitialSpawn', source, {x = spawnCoords.x, y = spawnCoords.y, z = spawnCoords.z})
end)

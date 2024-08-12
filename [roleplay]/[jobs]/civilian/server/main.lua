-- resources/[roleplay]/[jobs]/civilian/server/main.lua
AddEventHandler('playerConnecting', function(name, setKickReason, deferrals)
    local source = source
    local spawnCoords = vector3(441.84, -982.14, 30.69) -- Coordinates for the downtown police station in Los Santos
    print("Player connecting: ", name, " with source: ", source)
    print("Sending initial spawn coordinates: ", spawnCoords.x, spawnCoords.y, spawnCoords.z)
    TriggerClientEvent('civilian:setInitialSpawn', source, spawnCoords)
end)
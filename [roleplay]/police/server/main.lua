-- resources/[roleplay]/police/server/main.lua
RegisterCommand('spawnpolicecar', function(source, args, rawCommand)
    -- Check if the player has permission to spawn a police car
    -- For simplicity, we'll allow all players to spawn the car
    TriggerClientEvent('police:spawnVehicle', source, 'police')
end, false)
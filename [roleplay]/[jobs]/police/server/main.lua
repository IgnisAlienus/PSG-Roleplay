-- resources/[roleplay]/[jobs]/police/server/main.lua
RegisterNetEvent('police:enterJobMode')
AddEventHandler('police:enterJobMode', function()
    local source = source
    -- Here you can set the player's job to police or handle any other logic
    -- For simplicity, we'll just notify the player
    TriggerClientEvent('chat:addMessage', source, {
        args = { 'You are now on duty as a police officer' }
    })
end)

RegisterCommand('spawnpolicecar', function(source, args, rawCommand)
    -- Check if the player has permission to spawn a police car
    -- For simplicity, we'll allow all players to spawn the car
    TriggerClientEvent('police:spawnVehicle', source, 'police')
end, false)
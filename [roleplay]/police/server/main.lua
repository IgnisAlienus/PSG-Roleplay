-- resources/[roleplay]/police/server/main.lua
RegisterCommand('spawnpolicecar', function(source, args, rawCommand)
    local xPlayer = ESX.GetPlayerFromId(source)
    if xPlayer.job.name == 'police' then
        TriggerClientEvent('police:spawnVehicle', source, 'police')
    else
        xPlayer.showNotification('You are not a police officer!')
    end
end, false)
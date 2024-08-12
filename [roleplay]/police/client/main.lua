-- resources/[roleplay]/police/client/main.lua
RegisterNetEvent('police:spawnVehicle')
AddEventHandler('police:spawnVehicle', function(vehicleName)
    local playerPed = PlayerPedId()
    local coords = GetEntityCoords(playerPed)

    ESX.Game.SpawnVehicle(vehicleName, coords, 0.0, function(vehicle)
        TaskWarpPedIntoVehicle(playerPed, vehicle, -1)
    end)
end)
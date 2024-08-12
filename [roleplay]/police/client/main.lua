-- resources/[roleplay]/police/client/main.lua
RegisterNetEvent('police:spawnVehicle')
AddEventHandler('police:spawnVehicle', function(vehicleName)
    local playerPed = PlayerPedId()
    local coords = GetEntityCoords(playerPed)

    -- Load the vehicle model
    RequestModel(vehicleName)
    while not HasModelLoaded(vehicleName) do
        Wait(500)
    end

    -- Create the vehicle
    local vehicle = CreateVehicle(vehicleName, coords.x, coords.y, coords.z, GetEntityHeading(playerPed), true, false)

    -- Warp the player into the vehicle
    TaskWarpPedIntoVehicle(playerPed, vehicle, -1)

    -- Set the vehicle as no longer needed to allow the game to clean it up
    SetEntityAsNoLongerNeeded(vehicle)
    SetModelAsNoLongerNeeded(vehicleName)
end)
-- resources/[roleplay]/[jobs]/police/client/main.lua

-- Create the blip for the police station
local blip = AddBlipForCoord(441.84, -982.14, 30.69) -- Coordinates for the downtown police station in Los Santos
SetBlipSprite(blip, 60) -- Blip icon (60 is for a police station)
SetBlipDisplay(blip, 4)
SetBlipScale(blip, 1.0)
SetBlipColour(blip, 29)
SetBlipAsShortRange(blip, true)
BeginTextCommandSetBlipName("STRING")
AddTextComponentString("Police Station")
EndTextCommandSetBlipName(blip)

-- Check if player is near the blip to enter police job mode
Citizen.CreateThread(function()
    while true do
        Citizen.Wait(0)
        local playerPed = PlayerPedId()
        local coords = GetEntityCoords(playerPed)
        local distance = Vdist(coords, 441.84, -982.14, 30.69)

        if distance < 1.0 then
            -- Display help notification
            SetTextComponentFormat('STRING')
            AddTextComponentString("Press ~INPUT_CONTEXT~ to enter police job mode")
            DisplayHelpTextFromStringLabel(0, 0, 1, -1)

            if IsControlJustReleased(0, 38) then -- E key
                TriggerServerEvent('police:enterJobMode')
            end
        end
    end
end)

-- Handle vehicle spawning
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
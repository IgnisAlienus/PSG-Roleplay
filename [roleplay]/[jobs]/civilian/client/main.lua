-- resources/[roleplay]/[jobs]/civilian/client/main.lua
RegisterNetEvent('civilian:setInitialSpawn')
AddEventHandler('civilian:setInitialSpawn', function(coords)
    print("Received event 'civilian:setInitialSpawn' with coordinates: ", coords.x, coords.y, coords.z)
    local playerPed = PlayerPedId()
    
    -- Wait until the player is fully connected
    while not NetworkIsPlayerActive(PlayerId()) do
        Citizen.Wait(100)
    end
    
    SetEntityCoords(playerPed, coords.x, coords.y, coords.z, false, false, false, true)
    print("Player spawned at coordinates: ", coords.x, coords.y, coords.z)
end)

-- Add a command to trigger the event
RegisterCommand('testspawn', function()
    TriggerEvent('civilian:setInitialSpawn', {x = 441.83999633789, y = -982.14001464844, z = 30.690000534058})
end, false)
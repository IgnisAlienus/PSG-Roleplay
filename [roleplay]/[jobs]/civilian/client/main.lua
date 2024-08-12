-- resources/[roleplay]/[jobs]/civilian/client/main.lua
RegisterNetEvent('civilian:setInitialSpawn')
AddEventHandler('civilian:setInitialSpawn', function(coords)
    print("Received event 'civilian:setInitialSpawn' with coordinates: ", coords.x, coords.y, coords.z)
    local playerPed = PlayerPedId()
    
    -- Wait until the player is fully connected
    while not NetworkIsPlayerActive(PlayerId()) do
        Citizen.Wait(100)
    end
    
    -- Add a delay before setting the coordinates
    Citizen.Wait(1000)
    
    SetEntityCoords(playerPed, coords.x, coords.y, coords.z, false, false, false, true)
    print("Player spawned at coordinates: ", coords.x, coords.y, coords.z)
end)
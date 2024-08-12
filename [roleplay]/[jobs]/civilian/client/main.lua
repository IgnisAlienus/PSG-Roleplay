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
    
    -- Additional logging before setting the coordinates
    print("Attempting to spawn player at: ", coords.x, coords.y, coords.z)
    SetEntityCoords(playerPed, coords.x, coords.y, coords.z, false, false, false, true)
    
    -- Confirm the player's coordinates after setting them
    local finalCoords = GetEntityCoords(playerPed)
    print("Player spawned at coordinates: ", finalCoords.x, finalCoords.y, finalCoords.z)
end)

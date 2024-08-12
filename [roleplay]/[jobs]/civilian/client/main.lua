RegisterNetEvent('civilian:setInitialSpawn')
AddEventHandler('civilian:setInitialSpawn', function(coords)
    print("Received event 'civilian:setInitialSpawn' with coordinates: ", coords.x, coords.y, coords.z)
    local playerPed = PlayerPedId()
    
    -- Wait until the player is fully connected
    while not NetworkIsPlayerActive(PlayerId()) do
        Citizen.Wait(100)
    end
    
    -- Add a delay to ensure all resources are loaded
    Citizen.Wait(1000)
    
    -- Ensure collision and load the map area
    RequestCollisionAtCoord(coords.x, coords.y, coords.z)
    while not HasCollisionLoadedAroundEntity(playerPed) do
        Citizen.Wait(100)
    end

    -- Optionally load a model if necessary
    local model = GetEntityModel(playerPed)
    RequestModel(model)
    while not HasModelLoaded(model) do
        Citizen.Wait(100)
    end
    
    -- Finally, set the player's position and freeze them briefly to ensure proper placement
    SetEntityCoords(playerPed, coords.x, coords.y, coords.z, false, false, false, true)
    FreezeEntityPosition(playerPed, true)
    Citizen.Wait(1000)
    FreezeEntityPosition(playerPed, false)
    
    -- Confirm the player's coordinates after setting them
    local finalCoords = GetEntityCoords(playerPed)
    print("Player spawned at coordinates: ", finalCoords.x, finalCoords.y, finalCoords.z)
end)

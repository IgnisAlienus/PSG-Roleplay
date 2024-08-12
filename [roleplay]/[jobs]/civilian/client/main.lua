-- client/main.lua

-- Hook into the player spawn event
AddEventHandler('playerSpawned', function(spawn)
    local playerPed = PlayerPedId()
    -- Set the player's position to the police station coordinates
    SetEntityCoords(playerPed, 425.1, -979.5, 30.7, 0, 0, 0, false)
    SetEntityHeading(playerPed, 90.0)
end)

-- Optional: Handle spawn when triggered by the server
RegisterNetEvent('forcePlayerSpawn')
AddEventHandler('forcePlayerSpawn', function()
    local playerPed = PlayerPedId()
    -- Set the player's position to the police station coordinates
    SetEntityCoords(playerPed, 425.1, -979.5, 30.7, 0, 0, 0, false)
    SetEntityHeading(playerPed, 90.0)
end)

-- Overriding spawnmanager's default spawn behavior
AddEventHandler('onClientMapStart', function()
    -- Disable auto-spawn to manage it manually
    exports.spawnmanager:setAutoSpawn(false)

    -- Trigger a custom spawn
    Citizen.Wait(1000) -- Wait for the map to load fully
    exports.spawnmanager:spawnPlayer({
        x = 425.1,
        y = -979.5,
        z = 30.7,
        heading = 90.0,
        model = 'mp_m_freemode_01', -- Optional: Set default player model
        skipFade = false
    })
end)

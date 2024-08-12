-- client/main.lua

-- Event to freeze or unfreeze the player
RegisterNetEvent('civilian:freezePlayer')
AddEventHandler('civilian:freezePlayer', function(freeze)
    local playerPed = PlayerPedId()
    FreezeEntityPosition(playerPed, freeze)
    
    if freeze then
        -- Optionally, display a message to the player
        TriggerEvent('chat:addMessage', {
            args = {'You do not have the required permissions to move.'}
        })
    end
end)

-- Hook into the player spawn event
AddEventHandler('playerSpawned', function(spawn)
    local playerPed = PlayerPedId()
    -- Set the player's position to the police station coordinates
    SetEntityCoords(playerPed, 425.1, -979.5, 30.7, false, false, false, true)
    SetEntityHeading(playerPed, 90.0)
end)

-- Optional: Handle spawn when triggered by the server
RegisterNetEvent('forcePlayerSpawn')
AddEventHandler('forcePlayerSpawn', function()
    local playerPed = PlayerPedId()
    -- Set the player's position to the police station coordinates
    SetEntityCoords(playerPed, 425.1, -979.5, 30.7, false, false, false, true)
    SetEntityHeading(playerPed, 90.0)
end)

-- Overriding spawnmanager's default spawn behavior
AddEventHandler('onClientMapStart', function()
    -- Disable auto-spawn to manage it manually
    exports.spawnmanager:setAutoSpawn(false)
    -- Trigger a custom spawn
    Citizen.SetTimeout(1000, function() -- Wait for the map to load fully
        exports.spawnmanager:spawnPlayer({
            x = 425.1,
            y = -979.5,
            z = 30.7,
            heading = 90.0,
            model = 'mp_m_freemode_01', -- Optional: Set default player model
            skipFade = false
        })
    end)
end)
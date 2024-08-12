-- server/main.lua

-- Hook into the playerConnecting event
AddEventHandler('playerConnecting', function(name, setKickReason, deferrals)
    -- Perform any necessary checks or initialization here

    -- Trigger the client event to force the player to spawn at a specific location
    TriggerClientEvent('forcePlayerSpawn', source)
end)

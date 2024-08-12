-- server/main.lua
-- Hook into the playerConnecting event
AddEventHandler('playerConnecting', function(name, setKickReason, deferrals)
    local source = source
    deferrals.defer()
    
    -- Perform any necessary checks or initialization here
    -- For example, check if the player has the required role
    local hasRequiredRole = CheckPlayerRole(source) -- Implement this function based on your role system
    
    if not hasRequiredRole then
        -- Trigger the client event to freeze the player
        TriggerClientEvent('civilian:freezePlayer', source, true)
    end
    
    deferrals.done()
end)

-- Example function to check player role
function CheckPlayerRole(playerId)
    -- Implement your role checking logic here
    -- Return true if the player has the required role, otherwise false
    return false -- For demonstration purposes, all players will be frozen
end
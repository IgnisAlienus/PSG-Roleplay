-- server/main.lua

-- Hook into the playerConnecting event
AddEventHandler('playerConnecting', function(name, setKickReason, deferrals)
    local source = source
    deferrals.defer()
    
    print("[DEBUG] Player connecting: " .. name .. " (source: " .. source .. ")")
    
    -- Perform any necessary checks or initialization here
    -- For example, check if the player has the required role
    local hasRequiredRole = CheckPlayerRole(source) -- Implement this function based on your role system
    
    if not hasRequiredRole then
        print("[DEBUG] Player " .. name .. " (source: " .. source .. ") does not have the required role. Freezing player.")
        -- Trigger the client event to freeze the player
        TriggerClientEvent('civilian:freezePlayer', source, true)
    else
        print("[DEBUG] Player " .. name .. " (source: " .. source .. ") has the required role.")
    end
    
    deferrals.done()
    print("[DEBUG] Deferrals done for player: " .. name .. " (source: " .. source .. ")")
end)

-- Example function to check player role
function CheckPlayerRole(playerId)
    -- Implement your role checking logic here
    -- Return true if the player has the required role, otherwise false
    print("[DEBUG] Checking role for player (source: " .. playerId .. ")")
    return false -- For demonstration purposes, all players will be frozen
end
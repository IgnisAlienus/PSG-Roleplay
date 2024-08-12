-- server/main.lua
-- Hook into the playerConnecting event
AddEventHandler('playerConnecting', function(name, setKickReason, deferrals)
    local source = source
    deferrals.defer()
    
    print("[DEBUG] Player connecting: " .. name .. " (source: " .. source .. ")")
    
    -- Perform any necessary checks or initialization here
    -- For example, check if the player has the required role
    exports.discord_integration.CheckPlayerRole(source, function(hasRequiredRole)
        if type(hasRequiredRole) ~= "boolean" then
            print("[ERROR] Invalid type for hasRequiredRole: " .. type(hasRequiredRole))
            deferrals.done("An error occurred while checking your role.")
            return
        end
        if hasRequiredRole then
            print("[DEBUG] Player " .. name .. " (source: " .. source .. ") has the required role.")
        else
            print("[DEBUG] Player " .. name .. " (source: " .. source .. ") does not have the required role. Freezing player.")
            -- Trigger the client event to freeze the player
            TriggerClientEvent('civilian:freezePlayer', source, true)
        end
        
        deferrals.done()
        print("[DEBUG] Deferrals done for player: " .. name .. " (source: " .. source .. ")")
    end)
end)
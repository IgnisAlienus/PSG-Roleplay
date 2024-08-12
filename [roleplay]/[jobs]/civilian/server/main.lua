-- server/main.lua

-- Require the discord_integration module
local discord_integration = require('roleplay.discord_integration.server.main')

-- Hook into the playerConnecting event
AddEventHandler('playerConnecting', function(name, setKickReason, deferrals)
    local source = source
    deferrals.defer()
    
    print("[DEBUG] Player connecting: " .. name .. " (source: " .. source .. ")")
    
    -- Perform any necessary checks or initialization here
    -- For example, check if the player has the required role
    discord_integration.CheckPlayerRole(source, function(hasRequiredRole)
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
end)

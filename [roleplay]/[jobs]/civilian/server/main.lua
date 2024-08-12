-- server/main.lua

-- Hook into the playerConnecting event
AddEventHandler('playerConnecting', function(name, setKickReason, deferrals)
    local source = source
    deferrals.defer()

    print(('[DEBUG] Player connecting: %s (source: %s)'):format(name, source))

    -- Perform any necessary checks or initialization here
    -- For example, check if the player has the required role
    exports.discord_integration:CheckPlayerRole(source, function(hasRequiredRole)
        if type(hasRequiredRole) ~= 'boolean' then
            print(('[ERROR] Invalid type for hasRequiredRole: %s'):format(type(hasRequiredRole)))
            deferrals.done('An error occurred while checking your role.')
            return
        end
        if hasRequiredRole then
            print(('[DEBUG] Player %s (source: %s) has the required role.'):format(name, source))
        else
            print(('[DEBUG] Player %s (source: %s) does not have the required role. Freezing player.'):format(name, source))
            -- Trigger the client event to freeze the player
            TriggerClientEvent('civilian:freezePlayer', source, true)
        end

        deferrals.done()
        print(('[DEBUG] Deferrals done for player: %s (source: %s)'):format(name, source))
    end)
end)
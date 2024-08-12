-- civilian/server/main.lua

AddEventHandler('playerConnecting', function(name, setKickReason, deferrals)
    local source = source
    deferrals.defer()

    print(('[DEBUG] Player connecting: %s (source: %s)'):format(name, source))

    -- Debugging: Check the type of `CheckPlayerRole` function reference
    local checkPlayerRole = exports['discord_integration']:CheckPlayerRole
    print('Type of checkPlayerRole:', type(checkPlayerRole))  -- This should print "function"

    -- Call the `CheckPlayerRole` function
    checkPlayerRole(source, function(hasRequiredRole)
        if type(hasRequiredRole) ~= 'boolean' then
            print(('[ERROR] Invalid type for hasRequiredRole: %s'):format(type(hasRequiredRole)))
            deferrals.done('An error occurred while checking your role.')
            return
        end

        if hasRequiredRole then
            print(('[DEBUG] Player %s (source: %s) has the required role.'):format(name, source))
            deferrals.done()  -- Let the player connect
        else
            print(('[DEBUG] Player %s (source: %s) does not have the required role. Freezing player.'):format(name, source))
            TriggerClientEvent('civilian:freezePlayer', source, true)  -- Freeze the player
            deferrals.done('You do not have the required role in Discord to join this server.')
        end
    end)
end)

-- civilian/server/main.lua

AddEventHandler('playerConnecting', function(name, setKickReason, deferrals)
    local source = source
    deferrals.defer()

    print(string.format('[DEBUG] Player connecting: %s (source: %s)', name, source))

    -- Debugging: Check the type of `CheckPlayerRole` function reference
    local checkPlayerRole = exports['discord_integration']:CheckPlayerRole
    print(string.format('Type of checkPlayerRole: %s', type(checkPlayerRole)))  -- This should print "function"

    -- Call the `CheckPlayerRole` function
    checkPlayerRole(source, function(hasRequiredRole)
        if type(hasRequiredRole) ~= 'boolean' then
            print(string.format('[ERROR] Invalid type for hasRequiredRole: %s', type(hasRequiredRole)))
            deferrals.done('An error occurred while checking your role.')
            return
        end

        if hasRequiredRole then
            print(string.format('[DEBUG] Player %s (source: %s) has the required role.', name, source))
            deferrals.done()  -- Let the player connect
        else
            print(string.format('[DEBUG] Player %s (source: %s) does not have the required role. Freezing player.', name, source))
            TriggerClientEvent('civilian:freezePlayer', source, true)  -- Freeze the player
            deferrals.done('You do not have the required role in Discord to join this server.')
        end
    end)
end)
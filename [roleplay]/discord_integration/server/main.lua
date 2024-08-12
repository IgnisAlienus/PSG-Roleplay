-- server/main.lua

-- Read configuration values from server.cfg
local DISCORD_BOT_TOKEN = GetConvar('discord_bot_token', '')
local GUILD_ID = GetConvar('guild_id', '')
local REQUIRED_ROLE_ID = GetConvar('required_role_id', '')

-- Function to log an error and stop the script if a configuration value is missing
local function checkConfigValue(value, name)
    if value == '' then
        print(('[ERROR] Missing configuration value for %s'):format(name))
        StopResource(GetCurrentResourceName())
    else
        print(('[DEBUG] Configuration value for %s is set.'):format(name))
    end
end

-- Check if all required configuration values are set
checkConfigValue(DISCORD_BOT_TOKEN, 'discord_bot_token')
checkConfigValue(GUILD_ID, 'guild_id')
checkConfigValue(REQUIRED_ROLE_ID, 'required_role_id')

-- Function to get Discord roles of a player
local function GetDiscordRoles(discordId, callback)
    print(('[DEBUG] Fetching Discord roles for Discord ID: %s'):format(discordId))
    PerformHttpRequest(
        ('https://discord.com/api/guilds/%s/members/%s'):format(GUILD_ID, discordId),
        function(err, response, headers)
            print(('[DEBUG] HTTP request completed with status code: %d'):format(err))
            if err == 200 then
                local data = json.decode(response)
                print(('[DEBUG] Successfully fetched roles for Discord ID: %s'):format(discordId))
                callback(data.roles)
            else
                print(('[ERROR] Failed to fetch roles for Discord ID: %s (Error: %d)'):format(discordId, err))
                callback(nil)
            end
        end,
        'GET',
        '',
        { ['Authorization'] = ('Bot %s'):format(DISCORD_BOT_TOKEN) }
    )
end

-- Function to get the Discord ID of a player
local function GetDiscordId(playerId)
    if type(playerId) ~= 'number' and type(playerId) ~= 'string' then
        print(('[ERROR] Invalid playerId type: %s'):format(type(playerId)))
        return nil
    end

    print(('[DEBUG] Fetching Discord ID for player ID: %s'):format(playerId))
    local identifiers = GetPlayerIdentifiers(playerId)
    for _, id in ipairs(identifiers) do
        if id:find('discord:') then
            local discordId = id:sub(9) -- Remove the "discord:" prefix
            print(('[DEBUG] Found Discord ID: %s for player ID: %s'):format(discordId, playerId))
            return discordId
        end
    end
    print(('[DEBUG] No Discord ID found for player ID: %s'):format(playerId))
    return nil -- Return nil if no Discord ID is found
end

-- Function to check if a player has the required role
local function CheckPlayerRole(playerId, callback)
    print('Checking callback type...')
    print('Type of callback:', type(callback))
    if type(callback) ~= 'function' then
        print(('[ERROR] Invalid callback type: %s'):format(type(callback)))
        return
    end

    print(('[DEBUG] Checking role for player ID: %s'):format(playerId))
    local discordId = GetDiscordId(playerId)
    if discordId then
        GetDiscordRoles(discordId, function(roles)
            if roles then
                print(('[DEBUG] Roles fetched for player ID: %s: %s'):format(playerId, table.concat(roles, ', ')))
                for _, role in ipairs(roles) do
                    if role == REQUIRED_ROLE_ID then
                        print(('[DEBUG] Player ID: %s has the required role.'):format(playerId))
                        callback(true)
                        return
                    end
                end
            end
            print(('[DEBUG] Player ID: %s does not have the required role.'):format(playerId))
            callback(false)
        end)
    else
        print(('[DEBUG] No Discord ID found for player ID: %s'):format(playerId))
        callback(false)
    end
end
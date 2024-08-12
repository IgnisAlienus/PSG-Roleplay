-- Read configuration values from server.cfg
local DISCORD_BOT_TOKEN = GetConvar('discord_bot_token', '')
local GUILD_ID = GetConvar('guild_id', '')
local REQUIRED_ROLE_ID = GetConvar('required_role_id', '')

-- Function to log an error and stop the script if a configuration value is missing
local function checkConfigValue(value, name)
    if value == '' then
        print('[ERROR] Missing configuration value for ' .. name)
        StopResource(GetCurrentResourceName())
    else
        print('[DEBUG] Configuration value for ' .. name .. ' is set.')
    end
end

-- Check if all required configuration values are set
checkConfigValue(DISCORD_BOT_TOKEN, 'discord_bot_token')
checkConfigValue(GUILD_ID, 'guild_id')
checkConfigValue(REQUIRED_ROLE_ID, 'required_role_id')

-- Function to get Discord roles of a player
function GetDiscordRoles(discordId, callback)
    print('[DEBUG] Fetching Discord roles for Discord ID: ' .. discordId)
    PerformHttpRequest("https://discord.com/api/guilds/" .. GUILD_ID .. "/members/" .. discordId, function(err, response, headers)
        print('[DEBUG] HTTP request completed with status code: ' .. err)
        if err == 200 then
            local data = json.decode(response)
            print('[DEBUG] Successfully fetched roles for Discord ID: ' .. discordId)
            callback(data.roles)
        else
            print('[ERROR] Failed to fetch roles for Discord ID: ' .. discordId .. ' (Error: ' .. err .. ')')
            callback(nil)
        end
    end, 'GET', '', { ["Authorization"] = "Bot " .. DISCORD_BOT_TOKEN })
end

-- Function to get the Discord ID of a player
function GetDiscordId(playerId)
    print('[DEBUG] Fetching Discord ID for player ID: ' .. tostring(playerId))
    local identifiers = GetPlayerIdentifiers(playerId)
    for _, id in ipairs(identifiers) do
        if string.find(id, "discord:") then
            local discordId = string.sub(id, 9) -- Remove the "discord:" prefix
            print('[DEBUG] Found Discord ID: ' .. discordId .. ' for player ID: ' .. tostring(playerId))
            return discordId
        end
    end
    print('[DEBUG] No Discord ID found for player ID: ' .. tostring(playerId))
    return nil -- Return nil if no Discord ID is found
end

-- Function to check if a player has the required role
function CheckPlayerRole(playerId, callback)
    print('[DEBUG] Checking role for player ID: ' .. tostring(playerId))
    local discordId = GetDiscordId(playerId)
    if discordId then
        GetDiscordRoles(discordId, function(roles)
            if roles then
                print('[DEBUG] Roles fetched for player ID: ' .. tostring(playerId) .. ': ' .. table.concat(roles, ', '))
                for _, role in ipairs(roles) do
                    if role == REQUIRED_ROLE_ID then
                        print('[DEBUG] Player ID: ' .. tostring(playerId) .. ' has the required role.')
                        callback(true)
                        return
                    end
                end
            end
            print('[DEBUG] Player ID: ' .. tostring(playerId) .. ' does not have the required role.')
            callback(false)
        end)
    else
        print('[DEBUG] No Discord ID found for player ID: ' .. tostring(playerId))
        callback(false)
    end
end
-- Read configuration values from server.cfg
local DISCORD_BOT_TOKEN = GetConvar('discord_bot_token', '')
local GUILD_ID = GetConvar('guild_id', '')
local REQUIRED_ROLE_ID = GetConvar('required_role_id', '')

-- Function to log an error and stop the script if a configuration value is missing
local function checkConfigValue(value, name)
    if value == '' then
        print('Error: Missing configuration value for ' .. name)
        StopResource(GetCurrentResourceName())
    end
end

-- Check if all required configuration values are set
checkConfigValue(DISCORD_BOT_TOKEN, 'discord_bot_token')
checkConfigValue(GUILD_ID, 'guild_id')
checkConfigValue(REQUIRED_ROLE_ID, 'required_role_id')

-- Function to get Discord roles of a player
function GetDiscordRoles(discordId, callback)
    PerformHttpRequest("https://discord.com/api/guilds/" .. GUILD_ID .. "/members/" .. discordId, function(err, response, headers)
        if err == 200 then
            local data = json.decode(response)
            callback(data.roles)
        else
            callback(nil)
        end
    end, 'GET', '', { ["Authorization"] = "Bot " .. DISCORD_BOT_TOKEN })
end

-- Function to get the Discord ID of a player
function GetDiscordId(playerId)
    local identifiers = GetPlayerIdentifiers(playerId)
    for _, id in ipairs(identifiers) do
        if string.find(id, "discord:") then
            return string.sub(id, 9) -- Remove the "discord:" prefix
        end
    end
    return nil -- Return nil if no Discord ID is found
end

-- Function to check if a player has the required role
function CheckPlayerRole(playerId, callback)
    local discordId = GetDiscordId(playerId)
    if discordId then
        GetDiscordRoles(discordId, function(roles)
            if roles then
                for _, role in ipairs(roles) do
                    if role == REQUIRED_ROLE_ID then
                        callback(true)
                        return
                    end
                end
            end
            callback(false)
        end)
    else
        callback(false)
    end
end
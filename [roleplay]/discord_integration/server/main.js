// server/main.js

// Read configuration values from server.cfg
const DISCORD_BOT_TOKEN = GetConvar('discord_bot_token', '');
const GUILD_ID = GetConvar('guild_id', '');
const REQUIRED_ROLE_ID = GetConvar('required_role_id', '');

// Function to log an error and stop the script if a configuration value is missing
function checkConfigValue(value, name) {
  if (value === '') {
    console.log(`[ERROR] Missing configuration value for ${name}`);
    StopResource(GetCurrentResourceName());
  } else {
    console.log(`[DEBUG] Configuration value for ${name} is set.`);
  }
}

// Check if all required configuration values are set
checkConfigValue(DISCORD_BOT_TOKEN, 'discord_bot_token');
checkConfigValue(GUILD_ID, 'guild_id');
checkConfigValue(REQUIRED_ROLE_ID, 'required_role_id');

// Function to get Discord roles of a player
function GetDiscordRoles(discordId, callback) {
  console.log(`[DEBUG] Fetching Discord roles for Discord ID: ${discordId}`);
  PerformHttpRequest(
    `https://discord.com/api/guilds/${GUILD_ID}/members/${discordId}`,
    (err, response, headers) => {
      console.log(`[DEBUG] HTTP request completed with status code: ${err}`);
      if (err === 200) {
        const data = JSON.parse(response);
        console.log(
          `[DEBUG] Successfully fetched roles for Discord ID: ${discordId}`
        );
        callback(data.roles);
      } else {
        console.log(
          `[ERROR] Failed to fetch roles for Discord ID: ${discordId} (Error: ${err})`
        );
        callback(null);
      }
    },
    'GET',
    '',
    { Authorization: `Bot ${DISCORD_BOT_TOKEN}` }
  );
}

// Function to get the Discord ID of a player
function GetDiscordId(playerId, callback) {
  if (typeof playerId !== 'number' && typeof playerId !== 'string') {
    console.log(`[ERROR] Invalid playerId type: ${typeof playerId}`);
    callback(null);
    return;
  }

  console.log(`[DEBUG] Fetching Discord ID for player ID: ${playerId}`);
  emit('fivem:fetchDiscordId', playerId, (discordId) => {
    if (discordId) {
      console.log(
        `[DEBUG] Found Discord ID: ${discordId} for player ID: ${playerId}`
      );
      callback(discordId);
    } else {
      console.log(`[DEBUG] No Discord ID found for player ID: ${playerId}`);
      callback(null);
    }
  });
}

// Listen for the event on the server side to fetch identifiers
on('fivem:fetchDiscordId', (playerId, callback) => {
  console.log(`[DEBUG] Fetching identifiers for player ID: ${playerId}`);
  const identifiers = GetPlayerIdentifiers(playerId);
  for (const id of identifiers) {
    if (id.includes('discord:')) {
      const discordId = id.substring(8); // Remove the "discord:" prefix
      callback(discordId);
      return;
    }
  }
  callback(null); // Return null if no Discord ID is found
});

function GetPlayerIdentifiers(player) {
  const numIds = GetNumPlayerIdentifiers(player);
  let identifiers = [];

  for (i = 0; i < numIds; i++) {
    identifiers.push(GetPlayerIdentifier(player, i));
  }
  return identifiers;
}

// Function to check if a player has the required role
function CheckPlayerRole(playerId, callback) {
  console.log('Checking callback type...');
  console.log('Type of callback:', typeof callback);
  if (typeof callback !== 'function') {
    console.log(`[ERROR] Invalid callback type: ${typeof callback}`);
    return;
  }

  console.log(`[DEBUG] Checking role for player ID: ${playerId}`);
  GetDiscordId(playerId, (discordId) => {
    if (discordId) {
      GetDiscordRoles(discordId, (roles) => {
        if (roles) {
          console.log(
            `[DEBUG] Roles fetched for player ID: ${playerId}: ${roles.join(
              ', '
            )}`
          );
          for (const role of roles) {
            if (role === REQUIRED_ROLE_ID) {
              console.log(
                `[DEBUG] Player ID: ${playerId} has the required role.`
              );
              callback(true);
              return;
            }
          }
        }
        console.log(
          `[DEBUG] Player ID: ${playerId} does not have the required role.`
        );
        callback(false);
      });
    } else {
      console.log(`[DEBUG] No Discord ID found for player ID: ${playerId}`);
      callback(false);
    }
  });
}

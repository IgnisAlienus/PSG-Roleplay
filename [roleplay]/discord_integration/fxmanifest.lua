-- resources/[roleplay]/discord_integration/fxmanifest.lua
fx_version 'cerulean'
game 'gta5'

author 'Your Name'
description 'Discord Integration for Roles and Permissions'
version '1.0.0'

server_scripts {
    'server/main.js'
}
server_exports {
    'CheckPlayerRole'
}

client_scripts {
    'client/main.lua'
}
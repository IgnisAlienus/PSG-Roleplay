-- resources/[roleplay]/discord_integration/fxmanifest.lua
fx_version 'cerulean'
game 'gta5'

name 'Discord Integration'
author 'Ignis'
description 'Discord Integration for Roles and Permissions'
version '1.0.0'

server_script 'server.js'
server_exports {
    'CheckPlayerRole'
}

client_script 'client.lua'
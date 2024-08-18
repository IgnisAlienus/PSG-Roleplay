-- resources/[roleplay]/[jobs]/police/fxmanifest.lua
fx_version 'cerulean'
game 'gta5'

name 'Police Job'
author 'Ignis'
description 'Police Job'
version '1.0.0'

server_script 'server.js'

client_scripts {
    'client/client.js',
    'client/policestations.js'
}

-- Dependencies
dependency 'discord_integration'
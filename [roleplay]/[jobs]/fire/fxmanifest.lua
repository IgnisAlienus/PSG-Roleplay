-- resources/[roleplay]/[jobs]/fire/fxmanifest.lua
fx_version 'cerulean'
game 'gta5'

name 'Fire Job'
author 'Ignis'
description 'Fire Job'
version '1.0.0'

server_script 'server.js'

client_scripts {
    'client/client.js',
    'client/firestations.js'
}

-- Dependencies
dependency 'discord_integration'
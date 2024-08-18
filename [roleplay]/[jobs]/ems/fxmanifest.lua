-- resources/[roleplay]/[jobs]/ems/fxmanifest.lua
fx_version 'cerulean'
game 'gta5'

name 'EMS Job'
author 'Ignis'
description 'EMS Job'
version '1.0.0'

server_script 'server.js'

client_scripts {
    'client/client.js',
    'client/emsstations.js',
    'client/hospitals.js'

}

-- Dependencies
dependency 'discord_integration'
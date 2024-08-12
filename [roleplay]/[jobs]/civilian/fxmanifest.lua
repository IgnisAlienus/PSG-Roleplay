fx_version 'cerulean'
game 'gta5'

-- Resource metadata
name 'My Custom FiveM Mod'
author 'Ignis'
version '1.0.0'

-- Scripts to be loaded
client_scripts {
    'client/main.js'
}

server_scripts {
    'server/main.js'
}

-- Dependencies
dependencies {
    'spawnmanager',
    'discord_integration'
}

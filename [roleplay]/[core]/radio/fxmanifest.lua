fx_version 'cerulean'
game 'gta5'

author 'Andrew Hunt'
description 'Police Radio System with Real-Time Communications'

client_scripts {
    'client.js'
}

server_scripts {
    'server.js'
}

ui_page 'html/ui.html'

files {
    'html/ui.html',
    'html/ui.js',
    'html/ui.css'
}

dependencies {
    'screenshot-basic',  -- For capturing UI screenshots (if needed)
}

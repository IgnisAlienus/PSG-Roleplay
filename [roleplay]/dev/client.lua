-- resources/dev/client.lua
RegisterCommand('getcoords', function()
    local playerPed = PlayerPedId()
    local coords = GetEntityCoords(playerPed)
    print(string.format("Current coordinates: x = %.2f, y = %.2f, z = %.2f", coords.x, coords.y, coords.z))
end, false)
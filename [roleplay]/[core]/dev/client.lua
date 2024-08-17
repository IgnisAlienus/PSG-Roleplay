-- resources/dev/client.lua
RegisterCommand('getcoords', function()
    local playerPed = PlayerPedId()
    local coords = GetEntityCoords(playerPed)
    local msg = string.format("Current coordinates: x = %.2f, y = %.2f, z = %.2f", coords.x, coords.y, coords.z)
    print(msg)
    TriggerEvent('chat:addMessage', {
        color = { 255, 0, 0},
        multiline = true,
        args = {"Me", msg}
    })
end, false)
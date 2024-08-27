clientsInChannel = {} -- Will be used to define a list of clients per channel

function broadcastVoiceChange(source, channelIdx, state)
    -- source is the client that changed channels, broadcasting to other clients
    -- Let any other clients in this channel know that we changed
    -- Also send the list of clients, passed as the second argument at onPlayerChangeVoiceChannels
    -- to assign their volume and targets 
    for _, clientInChannel in pairs(clientsInChannel[channelIdx]) do
        TriggerClientEvent('onPlayerChangeVoiceChannels', clientInChannel, clientsInChannel[channelIdx], channelIdx, state)
    end
end

AddEventHandler('playerDropped', function (reason)
    leaveAnyOldChannels(source)
end)

function leaveAnyOldChannels(source)
    for channelIdx, channel in pairs(clientsInChannel) do
        for clientKey, clientInChannel in pairs(channel) do
            if clientInChannel == source then
                removeClientFromChannel(source, clientKey, channelIdx)
            end
        end
    end
end

function removeClientFromChannel(source, clientKey, channelIdx)
    broadcastVoiceChange(source, channelIdx, 'left')
    table.remove(clientsInChannel[channelIdx], clientKey)
end

RegisterCommand("joinchannel", function(source, args, rawCommand)
    local channelIdx = tonumber(args[1])
    -- Create the channel if it doesn't exist
    if not clientsInChannel[channelIdx] then
        clientsInChannel[channelIdx] = {}
    end

    leaveAnyOldChannels(source)

    -- Join the channel
    table.insert(clientsInChannel[channelIdx], source)
    broadcastVoiceChange(source, channelIdx, 'joined')
end, false)
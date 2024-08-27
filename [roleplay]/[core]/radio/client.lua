RegisterNetEvent("onPlayerChangeVoiceChannels", function(clients, channel, state)
  -- Join the channel
  if state == 'joined' then
      MumbleSetVoiceChannel(channel)
  end

  -- Go through the list of clients we received from the given channel
  for _, client in pairs(clients) do
      -- We only want to know about other clients
      if client ~= GetPlayerServerId(PlayerId()) then
          Citizen.Trace(string.format('Syncing client: %d to channel (%s)\n', client, state))
      end

      -- Go through the states
      if state == 'joined' then
          MumbleSetVolumeOverrideByServerId(client, 1.0)
      elseif state == 'left' then
          if client ~= GetPlayerServerId(PlayerId()) then -- No point in handling this for ourselves
              MumbleSetVolumeOverrideByServerId(client, -1.0) -- Reset their volume levels back to normal
          end
      end
  end
end)

RegisterCommand("listenchannel", function(source, args, rawCommand)
  MumbleAddVoiceChannelListen(tonumber(args[1]))
end, false)
_G.hat = game:GetService("ReplicatedStorage").PlayerData[game.Players.LocalPlayer.Name].Hats:GetChildren()[1]

if _G.hat == nil then
    print("No hat found")
else
    _G.hat = _G.hat.Name
    print("Got hat:", _G.hat)
end
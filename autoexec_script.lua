repeat wait() until game:IsLoaded()

local connected = false
local ws

local oldprint
oldprint = hookfunc(print, newcclosure(function(...)
	if connected then
		local text = ""
		for _,v in next, {...} do
			text = text .. tostring(v) .. " "
		end
		ws:Send("print:" .. text)
	else
		oldprint(...)
	end
end))

while wait(1) do
	pcall(function()
		ws = syn.websocket.connect("ws://localhost:42069/")
		connected = true
		ws:Send("auth:" .. game.Players.LocalPlayer.Name)
		ws.OnMessage:Connect(function(msg)
			local func, err = loadstring(msg)
			if err then
				ws:Send("compile_err:" .. err)
				return
			end
			ws:Send("executed")
			func()
		end)
		ws.OnClose:Wait()
		connected = false
	end)
	connected = false
end
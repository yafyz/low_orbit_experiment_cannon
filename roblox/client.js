const croblox = require("./clients/roblox")
const csynapse = require("./clients/synapse")

function getPlaceLauncher(placeid, jobid=undefined) {
    if (jobid == undefined)
        return `https://assetgame.roblox.com/game/PlaceLauncher.ashx?request=RequestGame&placeId=${placeid}&isPlayTogetherGame=false`
    else
        return `https://assetgame.roblox.com/game/PlaceLauncher.ashx?request=RequestGameJob&placeId=${placeid}&gameId=${jobid}&isPlayTogetherGame=false`
}

function launchRoblox(placelauncher, authTicket) {
    return croblox.launch(placelauncher, authTicket)
}

function launchSynapse(placelauncher, authticket) {
    return csynapse.launch(`roblox-player:1+launchmode:play+gameinfo:${authticket}+launchtime:${Date.now()}+placelauncherurl:${encodeURIComponent(placelauncher)}+browsertrackerid:${~~(Math.random()*100000000000)}+robloxLocale:en_us+gameLocale:en_us+channel:`)
}

module.exports = {
    getPlaceLauncher: getPlaceLauncher,
    launchRoblox: launchRoblox,
    launchSynapse: launchSynapse
}
const chp = require("child_process")

var robloxPath

function findRoblox() {
    robloxPath = "C:\\Users\\fyz\\AppData\\Local\\Roblox\\Versions\\version-278f0258a7224831\\RobloxPlayerBeta.exe"
}

function launch(placelauncher, authTicket) {
    if (robloxPath == undefined)
        findRoblox()

    return chp.spawn(robloxPath, ["--play", "-a", "https://auth.roblox.com/v1/authentication-ticket/redeem", "-t", authTicket, "-j", placelauncher, "--rloc", "en_us", "--gloc", "en_us"])
}

module.exports = {
    launch: launch
}
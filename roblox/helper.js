const axios = require("axios")
const ffi = require("ffi-napi")

const kernel32 = ffi.Library("kernel32", {
    "CreateMutexA": ["int", ["int", "int", "string"]]
})

async function getServers(placeid) {
    let games = []
    let cursor = ""
    let res
    while (true) {
        res = await axios.request({
            url: `https://games.roblox.com/v1/games/${placeid}/servers/Public?sortOrder=Asc&limit=100&cursor=${cursor}`,
            maxRedirects: 0,
            validateStatus: ()=>true
        })
        if (res.status != 200) {
            console.log(`${res.statusCode} ${res.statusMessage}`)
            console.log(res.data)
            throw new Error("Message code not 200")
        }
        res.data["data"].forEach(v => games[games.length] = v["id"])
        if (res.data["nextPageCursor"] == null)
            break
        else
            cursor = res.data["nextPageCursor"]
    }
    return games
}

function multipleInstancesBypass() {
    kernel32.CreateMutexA(0, 1, "ROBLOX_singletonMutex")
}

module.exports = {
    getServers: getServers,
    multipleInstancesBypass: multipleInstancesBypass
}
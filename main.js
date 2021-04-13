const fs = require("fs")
const ws = require("ws")
const rl = require("readline").createInterface(process.stdin, process.stdout)
const rclient = require("./roblox/client")
const rhelper = require("./roblox/helper")
const racc = require("./roblox/account")

const placeid = "1229173778"

let accounts = []
fs.readFileSync("cookies.txt").toString().split("\n").forEach((v)=>{
    v = v.trim()
    if (v != "")
        accounts[accounts.length] = new racc(v)
})

async function launchRobloxInstances() {
    let gameservers = await rhelper.getServers(placeid)
    let accidx = 0
    console.log(`Total servers ${gameservers.length}`)
    if (gameservers.length > accounts.length)
        console.log("You don't have enough accounts to join all servers")

    for (let gameid of gameservers) {
        if (accidx+1 > accounts.length) {
            console.log("ran out of accounts")
            break
        }
        let acc = accounts[accidx++]
        if (acc.isValid) {
            await acc.updateAuthTicket()
            console.log(`Starting new roblox instance ${accidx}/${gameservers.length} as ${acc.username} on gameid: ${gameid}`)
            await new Promise((res,_)=>{
                rclient.launchSynapse(rclient.getPlaceLauncher(placeid, gameid), acc.authTicket).on("close", res);
            });
        } else {
            console.log("Skipping invalid account");
        }
    }
}

async function main() {
    for(let i in accounts) {
        let acc = accounts[i]
        await acc.getInfo()
        if (!acc.isValid) {
            console.log(`Acc of idx: ${i} is invalid`)
        } else {
            console.log(`User ${acc.username}`)
        }
    }

    rhelper.multipleInstancesBypass()
    await launchRobloxInstances();

    console.log("Starting websocket server")

    const wss = new ws.Server({port: 42069});
    let connected = 0
    wss.on('connection', function connection(ws) {
        console.log("client connected")
        let name
        ws.on("message", (rawmsg)=>{
            let split = rawmsg.split(":")
            let pref = split[0]
            let msg = split.map((v, i)=> {if (i != 0) return v}).join("")
            if (pref == "auth") {
                console.log(`User ${msg} has authenticated [${++connected}/${accounts.length}]`);
                name = msg
            } else if (pref == "compile_err") {
                console.log(`User ${name} had compile error: ${msg}`)
            } else if (pref == "executed") {
                //console.log(`User ${name} has executed the script succesfully`)
            } else if (pref == "print") {
                console.log(`${name} > ${msg}`)
            }
        })
    });
    wss.on("close", function() {
        console.log(`A connection was close [${--connected}/${accounts.length}]`)
    })
    function execAll(scr) {
        for (let client of wss.clients) {
            if (client.readyState == ws.OPEN) {
                client.send(scr)
            }
        }
    }

    rl.on("line", (input)=>{
        let split = input.split(" ")
        if (split[0] == "exec") {
            if (split.length != 2) {
                console.log("Invalid number of arguments")
                return
            }
            let path = `scripts/${split[1].trim()}.lua`
            if (!fs.existsSync(path)) {
                console.log("Script does not exist")
                return
            }
            execAll(fs.readFileSync(path))
        } else if (split[0] == "inline") {
            if (split.length < 2) {
                console.log("Invalid number of arguments")
                return
            }
            execAll(split.map((v, i)=> {if (i != 0) return v}).join(""))
        } else {
            console.log("unknown command");
        }
    })
}

main()